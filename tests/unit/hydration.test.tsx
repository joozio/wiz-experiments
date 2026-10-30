// Phase C regression: the site is a static export, so the HTML is rendered once at build time
// with no saved data. A returning visitor's browser then hydrates that HTML with their saved
// data present. Anything read from localStorage during render makes the two disagree, and
// React throws away the page with error #418 (seen in the harness build for both of these).
import { describe, expect, it } from 'vitest';
import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import AgentArena from '../../experiments/agent-arena/Client';
import DungeonOfOpus from '../../experiments/dungeon-of-opus/Client';

async function hydrateAsReturningVisitor(Component: ComponentType, saved: Record<string, string>) {
  window.localStorage.clear();
  const html = renderToString(<Component />);
  for (const [k, v] of Object.entries(saved)) window.localStorage.setItem(k, v);
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const root = await act(async () =>
    hydrateRoot(container, <Component />, { onRecoverableError: (e) => errors.push(e) }),
  );
  // let the mount effects that read saved data commit
  await act(async () => {});
  return { container, errors, root };
}

describe('hydration for a returning visitor', () => {
  it('dungeon-of-opus with a saved high score', async () => {
    const { container, errors, root } = await hydrateAsReturningVisitor(DungeonOfOpus, { dungeon_highscore: '120' });
    expect(errors).toEqual([]);
    expect(container.textContent).toContain('High Score: 120');
    act(() => root.unmount());
  });

  it('agent-arena with a saved leaderboard entry', async () => {
    const entry = {
      id: 'u1', name: 'Saved Model', grade: 'A', label: 'x', score: 90, resisted: 5, detected: 1,
      compromised: 0, date: '2026-10-01', source: 'user',
    };
    const { container, errors, root } = await hydrateAsReturningVisitor(AgentArena, {
      'agent-arena-leaderboard': JSON.stringify([entry]),
    });
    expect(errors).toEqual([]);
    // the Leaderboard tab counts the 8 community scores plus the saved one
    expect(container.querySelector('button span')?.textContent).toBe('9');
    act(() => root.unmount());
  });
});
