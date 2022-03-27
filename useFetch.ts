import { useState } from 'react';

type UseFetchOptions<T> = {
  /**
   * Function for useFetch hook to use to request data.
   */
  dataRequest: () => Promise<T>;
};

type UseFetchReturnValue<T> = {
  /**
   * API response data of type T
   */
  data?: T;
  /**
   * True if request is in progress
   */
  isFetching: boolean;
  /**
   * True if a successful request has been made
   */
  isDataInitialised: boolean;
  /**
   * Captured error if request fails
   */
  fetchErrorObject: unknown;
  /**
   * True if latest request has failed
   */
  fetchError: boolean;
  /**
   * Use this to make a request for data
   */
  fetchData: () => void;
  /**
   * Reset state back to initial values
   */
  reset: () => void;
};

const emptyFetchError = () => ({
  fetchError: false,
  fetchErrorObject: undefined
});

/**
 * A simple hook to make requests & maintain request progress tracking information such as
 * whether a request in progress, an error has occurred or if data has been initialised etc.
 */
export function useFetch<T>({
  dataRequest
}: UseFetchOptions<T>): UseFetchReturnValue<T> {
  const [fetchErrorInfo, setFetchErrorInfo] = useState(emptyFetchError());
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<T>();

  const fetchData = async () => {
    setFetchErrorInfo(emptyFetchError());
    setIsFetching(true);
    try {
      const data = await dataRequest();

      setData(data);
    } catch (e) {
      setFetchErrorInfo({
        fetchError: true,
        fetchErrorObject: e
      });
    } finally {
      setIsFetching(false);
    }
  };

  const reset = () => {
    setData(undefined);
    setFetchErrorInfo(emptyFetchError());
    setIsFetching(false);
  };

  return {
    data,
    ...fetchErrorInfo,
    isFetching,
    isDataInitialised: data !== undefined,
    fetchData,
    reset
  };
}
