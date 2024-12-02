import { NetworkError } from "../errors";
import { stringifyValues } from "../formattes/object";
import { ENDPOINTS } from "./endpoints";

// fetchはJSの組み込み型 typofで、このfetch関数の型を取得する
// 返値: Promiseで、Responseオブジェクトに解決する = fetch関数の呼び出しが返すPromiseオブジェクトは、成功時Responseオブジェクトに切り替わる(解決される)
// fetch()の第一引数、第二引数を表す
// 失敗時はエラーオブジェクトが返される。
type FetchArgs = Parameters<typeof fetch>;
type RequestUrl = FetchArgs[0];
type FetchConfig = FetchArgs[1];
type RequestConfig = Omit<FetchConfig, "method" | "body">;

// makeFetchの戻り値をこれでアノテートしたいが、なぜかエラーが出る。
type ClientResponse<T = any> = Promise<{ data: T; response: Response }>;

type FetchPayload = BodyInit | undefined | null;

/** 責務は　API通信と共通の処理の実装　Nextサーバを介さず、直接バックエンドにリクエストを送ること */
const initClient = () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_HOST || "http://localhost:3000";
  const publicApiUrl =
    process.env.NEXT_PUBLIC_APP_HOST || "http://localhost:8000";

  /**
   * requestを送るurlを作成する
   * @param {RequestInfo} requestUrl fetch()の第一引数の型RequestInfo 送信先のエンドポイント
   * @param {RequestInit} config fetch()の第二引数の型RequestInit
   * */
  const makeFetch = async <T = any>(
    requestUrl: RequestUrl,
    config?: FetchConfig
  ): Promise<{ data: T; response: Response }> => {
    let reqUrl = requestUrl.toString();

    const isServerSide = typeof window === "undefined";
    const baseUrl = isServerSide ? appUrl : publicApiUrl;

    const url =
      typeof requestUrl === "string" ? new URL(reqUrl, baseUrl) : reqUrl;

    try {
      const response = await fetch(url, {
        ...config,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(config && "headers" in config && (config.headers as object)),
        },
        credentials: "include",
      });

      let dataJson;
      try {
        dataJson = await response.json();
      } catch (e) {
        dataJson = undefined;
      }

      if (!response.ok && !isServerSide) {
        throw new NetworkError(
          response.status,
          response.statusText,
          dataJson?.detail
        );
      }
      return {
        data: dataJson,
        response,
      };
    } catch (err) {
      throw err;
    }
  };

  // returnした関数を呼び出せる
  // 各メソッド内でmakefetch()を使用する
  return {
    get: <T = any>(url: RequestUrl, config?: FetchConfig) => {
      return makeFetch<T>(url, config);
    },
    post: <T extends any, K extends FetchPayload = string>(
      url: RequestUrl,
      payload: K,
      config?: FetchConfig
    ) => {
      return makeFetch<T>(url, {
        method: "POST",
        body: payload,
        ...config,
      });
    },
    patch: <T extends any, K extends FetchPayload = string>(
      url: RequestUrl,
      payload: K,
      config?: FetchConfig
    ) => {
      return makeFetch<T>(url, {
        method: "PATCH",
        body: payload,
        ...config,
      });
    },
    delete: <T extends any, K extends FetchPayload = string>(
      url: RequestUrl,
      payload: K,
      config?: FetchConfig
    ) => {
      return makeFetch<T>(url, {
        method: "DELETE",
        body: payload,
        ...config,
      });
    },
    makeUrl: (relativeurl: string, searchParams?: Record<string, any>) => {
      const url = new URL(relativeurl, publicApiUrl);
      url.search = new URLSearchParams(
        // パラメータが渡されていればそれぞれのキーと値を文字列にし、なければ空のオブジェクトを返すÏ
        (searchParams && stringifyValues(searchParams)) || {}
      ).toString();
      return url
    },
  };
};

export const apiClient = initClient();
