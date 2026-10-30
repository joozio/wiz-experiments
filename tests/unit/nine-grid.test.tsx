// Phase B: Nine Grid's rule is "one new post per day, your oldest gets bumped". Posts live only
// in this browser, so bumping the wrong one deletes something the visitor meant to keep.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import NineGrid from '../../experiments/nine-grid/Client';

const day = (d: number) => new Date(2026, 10, d, 12, 0, 0);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
});

afterEach(() => {
  vi.useRealTimers();
});

function open() {
  const view = render(<NineGrid />);
  fireEvent.click(screen.getByRole('button', { name: 'See your nine' }));
  return view;
}

function postOn(d: number, text: string) {
  vi.setSystemTime(day(d));
  const view = open();
  fireEvent.click(screen.getByRole('button', { name: "Write today's post" }));
  fireEvent.change(screen.getByPlaceholderText('Write something worth keeping...'), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Post it' }));
  view.unmount();
}

const cardOf = (text: string) => screen.getByText(text).parentElement!;

describe('nine-grid', () => {
  it('keeps a post across visits and allows only one per day', () => {
    postOn(1, 'kept');
    vi.setSystemTime(day(1));
    open();
    expect(screen.getByText('kept')).toBeTruthy();
    expect(screen.getByText("You've posted today. Come back tomorrow to update another slot.")).toBeTruthy();
    expect(screen.queryByRole('button', { name: "Write today's post" })).toBeNull();
  });

  it('bumps the oldest seed post first', () => {
    postOn(1, 'mine');
    open();
    // the seed written 61 days ago is the oldest
    expect(screen.queryByText(/Built something today/)).toBeNull();
  });

  it('ages a post written on an earlier day', () => {
    postOn(1, 'from monday');
    vi.setSystemTime(day(3));
    open();
    expect(cardOf('from monday').textContent).toContain('2 days ago');
    expect(cardOf('from monday').textContent).not.toContain('just now');
  });

  it('bumps the oldest of your own posts, wherever it sits in the grid', () => {
    for (let d = 1; d <= 9; d++) postOn(d, `post ${d}`);
    vi.setSystemTime(day(9));
    const grid = open();
    // every seed is gone; move the day 1 post from the first slot to the last
    const cards = () => screen.getAllByText(/^post \d$/).map((p) => p.parentElement!);
    fireEvent.dragStart(cards()[0]);
    fireEvent.dragOver(cards()[8]);
    fireEvent.drop(cards()[8]);
    expect(cards()[8].textContent).toContain('post 1');
    grid.unmount();
    postOn(10, 'post 10');
    vi.setSystemTime(day(10));
    open();
    expect(screen.queryByText('post 1')).toBeNull();
    expect(screen.getByText('post 2')).toBeTruthy();
    expect(screen.getByText('post 10')).toBeTruthy();
  });
});
