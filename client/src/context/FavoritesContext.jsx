import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useCustomerAuth } from './CustomerAuthContext.jsx';
import { getFavorites, toggleFavorite as toggleFavoriteApi } from '../services/favoriteService.js';

const FavoritesContext = createContext();
export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated, customer } = useCustomerAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);
  const [pendingIds, setPendingIds] = useState(new Set());
  const pending = useRef(new Set());
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    let active = true;
    setError(null);
    if (!isAuthenticated) { setFavoriteIds(new Set()); setFavoriteItems([]); setLoading(false); return; }
    setLoading(true);
    getFavorites().then((response) => {
      if (active) {
        const items = (response.data || []).filter(Boolean);
        setFavoriteItems(items); setFavoriteIds(new Set(items.map((item) => item._id)));
      }
    }).catch(() => { if (active) setError('تعذر تحميل المفضلة، جرّب تاني'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isAuthenticated, customer?.id, revision]);
  const toggle = async (itemId) => {
    if (!isAuthenticated) return { needsLogin: true };
    if (pending.current.has(itemId)) return { favorited: favoriteIds.has(itemId) };
    pending.current.add(itemId); setPendingIds(new Set(pending.current));
    try {
      const response = await toggleFavoriteApi(itemId);
      setFavoriteIds((previous) => { const next = new Set(previous); if (response.favorited) next.add(itemId); else next.delete(itemId); return next; });
      refresh(); return { favorited: response.favorited };
    } finally { pending.current.delete(itemId); setPendingIds(new Set(pending.current)); }
  };
  return <FavoritesContext.Provider value={{ favoriteItems, isFavorite: (id) => favoriteIds.has(id), isPending: (id) => pendingIds.has(id), toggle, refresh, loading, error }}>{children}</FavoritesContext.Provider>;
};
export const useFavorites = () => useContext(FavoritesContext);
