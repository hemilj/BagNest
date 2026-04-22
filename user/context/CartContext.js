'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../lib/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
    else setCartItems([]);
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCartItems(data.items || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, qty = 1) => {
    const { data } = await API.post('/cart', { productId, qty });
    setCartItems(data.items || []);
  };

  const removeFromCart = async (productId) => {
    const { data } = await API.delete(`/cart/${productId}`);
    setCartItems(data.items || []);
  };

  const clearCart = async () => {
    await API.delete('/cart');
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * (item.product?.price || 0), 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, addToCart, removeFromCart, clearCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
