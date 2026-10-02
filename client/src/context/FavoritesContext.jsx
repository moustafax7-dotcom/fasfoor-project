import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCustomerAuth } from './CustomerAuthContext.jsx';
import { getFavorites, toggleFavorite as toggleFavoriteApi } from '../services/favoriteService.js';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useCustomerAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoriteItems, setFavoriteItems] = useState([]);

  const loadFavorites = useCallback(() => {
    if (!isAuthenticated) { setFavoriteIds(new Set()); setFavoriteItems([]); return; }
    getFavorites().then((res) => {
      setFavoriteItems(res.data || []);
      setFavoriteIds(new Set((res.data || []).map((i) => i._id)));
    });
  }, [isAuthenticated]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const toggle = async (itemId) => {
    if (!isAuthenticated) return { needsLogin: true };
    const res = await toggleFavoriteApi(itemId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (res.favorited) next.add(itemId); else next.delete(itemId);
      return next;
    });
    loadFavorites();
    return { favorited: res.favorited };
  };

  const isFavorite = (itemId) => favoriteIds.has(itemId);

  return (
    <FavoritesContext.Provider value={{ favoriteItems, isFavorite, toggle, refresh: loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
