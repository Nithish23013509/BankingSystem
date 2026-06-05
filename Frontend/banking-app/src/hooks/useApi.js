import { useState, useCallback } from 'react';

export function useApi(apiFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data
        || err.message
        || 'Something went wrong';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
