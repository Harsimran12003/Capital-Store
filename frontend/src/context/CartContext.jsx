import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(saved);
    } else {
      setCart([]);
    }
  }, [user]);

  // Persist cart
  useEffect(() => {
    if (user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(p => p.productId === product._id);
      if (exists) {
        return prev.map(p =>
          p.productId === product._id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.images[0],
          price: product.discountedPrice > 0 ? product.discountedPrice : product.originalPrice,
          originalPrice: product.originalPrice,
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    setCart(prev =>
      prev.map(p =>
        p.productId === productId ? { ...p, qty } : p
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(p => p.productId !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.reduce((s, i) => s + i.qty, 0),
        addToCart,
        updateQty,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
