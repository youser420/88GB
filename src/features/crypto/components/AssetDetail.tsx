import { DEFAULT_CURRENCY } from '@/constants';
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
} from '@/utils';

import type { CoinDetail } from '../types';
import { getChangeColorClass, stripHtml, truncate } from '../utils';

const DESCRIPTION_MAX_LENGTH = 300;

function inCurrency(map: Record<string, number>): number {
  return map[DEFAULT_CURRENCY] ?? 0;
}

function formatSupply(value: number | null, symbol: string): string {
  if (value === null || value === 0) return '—';
  return `${formatNumber(value, { maximumFractionDigits: 0 })} ${symbol.toUpperCase()}`;
}

/** Detailed, formatted view of a single coin shown inside the modal. */
export function AssetDetail({ coin }: { coin: CoinDetail }) {
  const { market_data: market } = coin;
  const change = market.price_change_percentage_24h;

  const stats: ReadonlyArray<{ label: string; value: string }> = [
    { label: '24h High', value: formatCurrency(inCurrency(market.high_24h)) },
    { label: '24h Low', value: formatCurrency(inCurrency(market.low_24h)) },
    {
      label: 'Market Cap',
      value: formatCompactCurrency(inCurrency(market.market_cap)),
    },
    { label: 'All-Time High', value: formatCurrency(inCurrency(market.ath)) },
    { label: 'All-Time Low', value: formatCurrency(inCurrency(market.atl)) },
    {
      label: 'Circulating Supply',
      value: formatSupply(market.circulating_supply, coin.symbol),
    },
    {
      label: 'Total Supply',
      value: formatSupply(market.total_supply, coin.symbol),
    },
    {
      label: 'Max Supply',
      value: formatSupply(market.max_supply, coin.symbol),
    },
  ];

  const description = truncate(
    stripHtml(coin.description.en ?? ''),
    DESCRIPTION_MAX_LENGTH,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
          {formatCurrency(inCurrency(market.current_price))}
        </span>
        <span
          className={`pb-1 text-sm font-semibold ${getChangeColorClass(change)}`}
        >
          {formatPercentage(change)}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40"
          >
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {stat.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {description ? (
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {description}
        </p>
      ) : null}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Last updated: {formatDate(coin.last_updated)}
      </p>
    </div>
  );
}
