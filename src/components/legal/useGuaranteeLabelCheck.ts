'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DurabilityLabelData } from '@/lib/consumer-guarantee';
import { fetchGuaranteeLabels, type GuaranteeCheckStatus } from '@/lib/guarantee-label-check';

type CheckResult =
  | { key: string; status: 'ready'; labels: Record<string, DurabilityLabelData> }
  | { key: string; status: 'error' };

const NO_LABELS: Record<string, DurabilityLabelData> = {};

/**
 * GARAN verification for the products in the cart. The result is bound to the
 * exact set of product ids it was computed for: any cart change puts the
 * check back to "loading" in the same render, so a stale "ready" can never
 * unlock the order button.
 */
export function useGuaranteeLabelCheck(productIds: readonly string[]) {
  const key = useMemo(() => [...productIds].sort().join(','), [productIds]);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    fetchGuaranteeLabels(key.split(','))
      .then((labels) => {
        if (!cancelled) setResult({ key, status: 'ready', labels });
      })
      .catch(() => {
        if (!cancelled) setResult({ key, status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [key, attempt]);

  const retry = useCallback(() => {
    setResult(null);
    setAttempt((value) => value + 1);
  }, []);

  const current = result && result.key === key ? result : null;
  const status: GuaranteeCheckStatus = current ? current.status : 'loading';
  const labels = current?.status === 'ready' ? current.labels : NO_LABELS;

  return { status, labels, retry };
}
