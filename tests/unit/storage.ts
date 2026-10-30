import { vi } from 'vitest';

// What a browser with site data blocked does: touching window.localStorage throws.
export function blockStorage() {
  const err = () => {
    throw new DOMException('The operation is insecure.', 'SecurityError');
  };
  return vi.spyOn(window, 'localStorage', 'get').mockImplementation(err);
}
