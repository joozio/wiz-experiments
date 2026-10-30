// Phase B: Letters to Future Self is retired, and its only remaining job is to hand back
// letters people saved in this browser. Losing or altering that data would be unrecoverable.
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Letters from '../../experiments/letters-to-future-self/Client';

const KEY = 'wiz-future-letters';

describe('saved letter recovery', () => {
  it('shows every readable saved letter', () => {
    window.localStorage.setItem(KEY, JSON.stringify([
      { id: 'a', content: 'Dear me,\nkeep going.', deliveryDate: '2027-01-01', createdAt: '2026-01-01' },
      { id: 'b', content: 'Second letter', deliveryDate: '', createdAt: '2026-02-01' },
    ]));
    render(<Letters />);
    expect(screen.getByText('Letters saved in this browser (2)')).toBeTruthy();
    expect(screen.getByText(/Dear me,\s+keep going\./)).toBeTruthy();
    expect(screen.getByText('Second letter')).toBeTruthy();
  });

  it('skips entries without text but keeps the rest', () => {
    window.localStorage.setItem(KEY, JSON.stringify([null, { id: 1 }, { content: 'Survivor' }]));
    render(<Letters />);
    expect(screen.getByText('Letters saved in this browser (1)')).toBeTruthy();
    expect(screen.getByText('Survivor')).toBeTruthy();
  });

  it('renders letter text as text, never as markup', () => {
    window.localStorage.setItem(KEY, JSON.stringify([{ id: 'x', content: '<img src=x onerror=alert(1)>' }]));
    const { container } = render(<Letters />);
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeTruthy();
    expect(container.querySelector('img')).toBeNull();
  });

  it('never rewrites or deletes what is stored, even when it cannot read it', () => {
    for (const raw of ['not json', JSON.stringify([{ id: 'a', content: 'kept' }])]) {
      window.localStorage.setItem(KEY, raw);
      const view = render(<Letters />);
      expect(window.localStorage.getItem(KEY)).toBe(raw);
      view.unmount();
    }
  });

  it('says so when nothing is saved', () => {
    render(<Letters />);
    expect(screen.getByText('No saved letters found in this browser.')).toBeTruthy();
  });
});
