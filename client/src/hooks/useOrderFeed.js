import { useCallback, useEffect, useState } from 'react';
import { getOrders } from '../services/orderService.js';

// Keep the last successful snapshot visible while refreshing; failures never claim a fresh connection.
export function useOrderFeed(branch = '', autoRefresh = true) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => { setOrders([]); setLastUpdated(null); setLoading(true); }, [branch]);
  useEffect(() => {
    let active = true;
    let pending = false;
    const load = async () => {
      if (pending || document.hidden) return;
      pending = true; setRefreshing(true);
      try {
        const response = await getOrders(branch ? { branch } : {});
        if (active) { setOrders(response.data || []); setError(null); setLastUpdated(new Date()); }
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'تعذر تحديث الطلبات. البيانات المعروضة من آخر تحديث ناجح.');
      } finally {
        pending = false;
        if (active) { setLoading(false); setRefreshing(false); }
      }
    };
    load();
    const timer = autoRefresh ? setInterval(load, 15000) : null;
    const onVisible = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { active = false; if (timer) clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [branch, autoRefresh, revision]);
  return { orders, loading, refreshing, error, lastUpdated, refresh };
}
