/**
 * Domain models for the crypto feature.
 *
 * Shapes mirror the relevant subset of the CoinGecko API. Only fields the app
 * actually consumes are modelled; everything is strongly typed (no `any`).
 */

/** A coin as returned by the `/coins/markets` endpoint. */
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  last_updated: string;
}

/** Localized text blocks (e.g. descriptions) keyed by language code. */
export type LocalizedText = Record<string, string>;

/** Market data block nested inside a coin detail response. */
export interface CoinMarketData {
  current_price: Record<string, number>;
  market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  price_change_percentage_24h: number;
  high_24h: Record<string, number>;
  low_24h: Record<string, number>;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: Record<string, number>;
  atl: Record<string, number>;
}

/** Detailed coin data as returned by `/coins/{id}`. */
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: LocalizedText;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: CoinMarketData;
  last_updated: string;
}

/**
 * Response of the `/coins/markets` endpoint — a plain list of coins.
 * Kept as a named alias so call sites read intentionally.
 */
export type MarketResponse = Coin[];

/** A single entry within a search result. */
export interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

/** Response of the `/search` endpoint (coins only). */
export interface SearchResult {
  coins: SearchCoin[];
}

/** Error envelope returned by the CoinGecko API. */
export interface ApiErrorResponse {
  status?: {
    error_code?: number;
    error_message?: string;
  };
  error?: string;
}

/** Options accepted when requesting the top coins list. */
export interface GetTopCoinsOptions {
  currency?: string;
  perPage?: number;
  page?: number;
}
