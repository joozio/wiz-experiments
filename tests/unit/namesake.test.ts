// Phase B: Namesake's promise is "same spelling, same plant, on any screen", and shared links
// carry only the name. If specimen() stopped being deterministic, every shared link would
// open a different plant from the one that was sent.
import { describe, expect, it } from 'vitest';
import { MAX_CHARS, normalize, specimen } from '../../experiments/namesake/namesake';

describe('namesake', () => {
  it('grows the same specimen for the same name every time', () => {
    const a = specimen('honorata')!;
    const b = specimen('honorata')!;
    expect(b).toEqual(a);
    expect(a.binomial.startsWith('Honorata ')).toBe(true);
  });

  it('treats case and spacing as the same name', () => {
    expect(normalize('  Anna   Maria ').name).toBe('anna maria');
    expect(specimen(normalize('ANNA').name)).toEqual(specimen('anna'));
  });

  it('caps a name at MAX_CHARS and says it trimmed', () => {
    const long = 'x'.repeat(MAX_CHARS + 5);
    expect(normalize(long)).toEqual({ name: 'x'.repeat(MAX_CHARS), trimmed: true });
    expect(normalize('short').trimmed).toBe(false);
  });

  it('refuses input with no letters instead of growing nothing', () => {
    expect(specimen('')).toBeNull();
    expect(specimen('1234 !!')).toBeNull();
  });

  it('crosses two names with a plus and keeps segment counts bounded', () => {
    const hybrid = specimen('anna + zoe')!;
    expect(hybrid.binomial).toBe('Anna x zoiae');
    for (const name of ['a', 'zzzzzzzzzzzzzzzzzzzzzzzz', 'anna + zoe']) {
      const n = specimen(name)!.segs.length;
      expect(n).toBeGreaterThanOrEqual(40);
      expect(n).toBeLessThanOrEqual(2600);
    }
  });

  it('survives the round trip through a shared link', () => {
    const name = normalize('Zoë Ł + 太郎').name;
    const url = new URL(`https://wiz.jock.pl/experiments/namesake/?n=${encodeURIComponent(name)}`);
    const back = normalize(url.searchParams.get('n')!).name;
    expect(back).toBe(name);
    expect(specimen(back)).toEqual(specimen(name));
  });
});
