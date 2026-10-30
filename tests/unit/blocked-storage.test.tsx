// Phase A regression: experiments that remember things in localStorage must still work for a
// visitor whose browser refuses site storage. In that browser, reading window.localStorage
// throws SecurityError. Before the fix these three pages hit an uncaught exception on mount
// and Next replaced the whole page with "Application error: a client-side exception".
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { blockStorage } from './storage';
import NineGrid from '../../experiments/nine-grid/Client';
import WhatWouldYouAutomate from '../../experiments/what-would-you-automate/Client';
import DungeonOfOpus from '../../experiments/dungeon-of-opus/Client';

describe('with site storage blocked', () => {
  it('nine-grid renders and still takes a post', () => {
    blockStorage();
    render(<NineGrid />);
    fireEvent.click(screen.getByRole('button', { name: 'See your nine' }));
    fireEvent.click(screen.getByRole('button', { name: "Write today's post" }));
    fireEvent.change(screen.getByPlaceholderText('Write something worth keeping...'), {
      target: { value: 'A post that has nowhere to be saved' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Post it' }));
    expect(screen.getByText('A post that has nowhere to be saved')).toBeTruthy();
  });

  it('what-would-you-automate renders and still shows results', () => {
    blockStorage();
    render(<WhatWouldYouAutomate />);
    fireEvent.click(screen.getByRole('button', { name: /Reading and replying to emails/ }));
    fireEvent.click(screen.getByRole('button', { name: 'See Results' }));
    expect(screen.getByText('Your Automation Profile')).toBeTruthy();
  });

  it('dungeon-of-opus renders its title screen', () => {
    blockStorage();
    render(<DungeonOfOpus />);
    expect(screen.getByRole('heading', { name: 'Dungeon of Opus' })).toBeTruthy();
  });
});

describe('with corrupt saved data', () => {
  it('nine-grid ignores a value that is not a list of posts', () => {
    window.localStorage.setItem('nine-grid-posts', '{"oops":true}');
    render(<NineGrid />);
    fireEvent.click(screen.getByRole('button', { name: 'See your nine' }));
    expect(screen.getByRole('heading', { name: 'Nine Grid' })).toBeTruthy();
  });

  it('nine-grid ignores a value that is not JSON', () => {
    window.localStorage.setItem('nine-grid-posts', 'not json');
    render(<NineGrid />);
    expect(screen.getByRole('button', { name: 'See your nine' })).toBeTruthy();
  });
});
