import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useFeatures from '../useFeatures';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('useFeatures', () => {
  it('reports Phase 2 web3 as enabled by default', () => {
    const { result } = renderHook(() => useFeatures());

    expect(result.current.isEnabled('phase2', 'web3')).toBe(true);
  });

  it('respects env override for a feature', () => {
    vi.stubEnv('VITE_FEATURE_PHASE2_WEB3', 'false');

    const { result } = renderHook(() => useFeatures());

    expect(result.current.isEnabled('phase2', 'web3')).toBe(false);
  });

  it('returns false for unknown phase/feature', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useFeatures());

    expect(result.current.isEnabled('phase9', 'missing')).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });
});
