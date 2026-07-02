import { AssetRow } from './AssetRow';
import type { AssetCollectionProps } from './asset.types';

const HEADERS = ['#', 'Name', 'Price', '24h %', 'Market Cap', ''] as const;

/** Desktop responsive table listing coins. */
export function AssetTable({
  coins,
  watchlist,
  query,
  onToggleWatchlist,
  onSelect,
}: AssetCollectionProps) {
  const watchlistIds = new Set(watchlist);

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        Cryptocurrency market data. Activate a coin name to view details.
      </caption>
      <thead>
        <tr className="border-b border-slate-200 text-xs font-medium tracking-wide text-slate-500 uppercase dark:border-slate-800">
          {HEADERS.map((header, index) => (
            <th
              key={header || `col-${index}`}
              scope="col"
              className={
                index <= 1
                  ? 'px-4 py-3 font-medium'
                  : 'px-4 py-3 text-right font-medium'
              }
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => (
          <AssetRow
            key={coin.id}
            coin={coin}
            isWatchlisted={watchlistIds.has(coin.id)}
            query={query}
            onToggle={onToggleWatchlist}
            onSelect={onSelect}
          />
        ))}
      </tbody>
    </table>
  );
}
