// Phase B: the one place on the site that takes money. Pins what the browser sends to the
// analysis and checkout endpoints and what the visitor sees when either of them fails.
// fetch is mocked; nothing here reaches wiz.jock.pl.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import AIShoppingChecker from '../../experiments/ai-shopping-checker/Client';

const STORE = 'https://shop.example.com';
const NAMES = ['Structured Data', 'AI Crawler Policy', 'Page Metadata', 'Semantic HTML', 'Server Rendering',
  'Checkout Flow', 'API & Protocols', 'Payment Flow', 'Bot Detection', 'Accessibility',
  'Product Data Quality', 'Security & Trust'];

function analysis(grade: 'A' | 'C') {
  return {
    url: STORE,
    totalScore: grade === 'A' ? 92 : 55,
    grade,
    analyzedAt: '2026-10-30T00:00:00Z',
    criteria: NAMES.map((name) => ({
      name, emoji: '*', score: 5, status: 'partial', findings: ['f'], recommendations: ['r'],
    })),
  };
}

// the label carries the price; matched loosely so the separator character does not matter
const PRICE_BUTTON = /^Get Full Report . \$29\.99$/;

const json = (status: number, body: unknown) =>
  ({ ok: status < 400, status, json: async () => body }) as Response;

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.useFakeTimers();
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function analyze(url: string) {
  fireEvent.change(screen.getByPlaceholderText('https://yourstore.com'), { target: { value: url } });
  fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));
  // the page holds the result until the criteria reveal has played out
  await act(async () => {
    await vi.advanceTimersByTimeAsync(6000);
  });
}

describe('analysis', () => {
  it('rejects a URL without a scheme and never calls the API', async () => {
    render(<AIShoppingChecker />);
    await analyze('shop.example.com');
    expect(screen.getByText('URL must start with http:// or https://')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts the trimmed URL to the analysis endpoint and shows the grade', async () => {
    fetchMock.mockResolvedValueOnce(json(200, analysis('A')));
    render(<AIShoppingChecker />);
    await analyze(`  ${STORE}  `);
    expect(fetchMock).toHaveBeenCalledWith('https://wiz.jock.pl/api/analyze-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: STORE }),
    });
    expect(screen.getByText('Detailed Breakdown')).toBeTruthy();
    // an A store is not offered the paid report
    expect(screen.queryByRole('button', { name: /Get Full Report/ })).toBeNull();
  });

  it('shows the server error and offers a retry', async () => {
    fetchMock.mockResolvedValueOnce(json(429, { error: 'Too many requests, try again in a minute.' }));
    render(<AIShoppingChecker />);
    await analyze(STORE);
    expect(screen.getByText('Analysis failed')).toBeTruthy();
    expect(screen.getByText('Too many requests, try again in a minute.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });
});

describe('paid report checkout', () => {
  async function toResults() {
    fetchMock.mockResolvedValueOnce(json(200, analysis('C')));
    render(<AIShoppingChecker />);
    await analyze(STORE);
    return screen.getByRole('button', { name: PRICE_BUTTON });
  }

  it('sends the product and the analysed store to checkout', async () => {
    const buy = await toResults();
    fetchMock.mockResolvedValueOnce(json(200, { url: 'https://checkout.example.com/session' }));
    // jsdom cannot leave the page and logs "Not implemented: navigation" for the redirect
    await act(async () => {
      fireEvent.click(buy);
    });
    expect(fetchMock).toHaveBeenLastCalledWith('https://wiz.jock.pl/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: 'ai-store-readiness-report', store_url: STORE }),
    });
    expect(screen.getByRole('button', { name: 'Redirecting...' })).toHaveProperty('disabled', true);
  });

  it('shows the checkout error and lets the visitor try again', async () => {
    const buy = await toResults();
    fetchMock.mockResolvedValueOnce(json(502, { error: 'Payment provider unavailable.' }));
    await act(async () => {
      fireEvent.click(buy);
    });
    expect(screen.getByText('Payment provider unavailable.')).toBeTruthy();
    expect(screen.getByRole('button', { name: PRICE_BUTTON })).toHaveProperty('disabled', false);
  });

  it('does not navigate when checkout returns no URL', async () => {
    const buy = await toResults();
    fetchMock.mockResolvedValueOnce(json(200, {}));
    await act(async () => {
      fireEvent.click(buy);
    });
    expect(screen.getByText('No checkout URL returned.')).toBeTruthy();
    expect(screen.getByRole('button', { name: PRICE_BUTTON })).toHaveProperty('disabled', false);
  });

  it('links subscribers to the free claim with the store URL encoded', async () => {
    await toResults();
    const claim = screen.getByRole('link', { name: 'Claim free' });
    expect(claim.getAttribute('href')).toBe(
      `/store/subscriber-access?product=ai-store-readiness-report&store_url=${encodeURIComponent(STORE)}`,
    );
  });
});
