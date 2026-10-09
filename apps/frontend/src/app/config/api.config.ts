import { Effect, Layer } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/http';

export type ApiConfig = Readonly<{
  /** The API origin; requests go to `/api/…` on the page's origin. */
  url: string;
}>;

/** The HttpClient every *Http implementation uses, pointed at the API origin. */
export const ApiHttpClient = (cfg: ApiConfig) =>
  Layer.effect(
    HttpClient.HttpClient,
    Effect.map(
      HttpClient.HttpClient,
      HttpClient.mapRequest(HttpClientRequest.prependUrl(cfg.url)),
    ),
  ).pipe(Layer.provide(FetchHttpClient.layer));
