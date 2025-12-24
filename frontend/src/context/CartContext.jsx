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

 const addToCart = (product, size) => {
  setCart((prev) => {
    const exists = prev.find(
      p => p.productId === product._id && p.size === size
    );

    if (exists) {
      return prev.map(p =>
        p.productId === product._id && p.size === size
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
        price:
          product.discountedPrice > 0
            ? product.discountedPrice
            : product.originalPrice,
        originalPrice: product.originalPrice,
        size, // ✅ STORE SIZE
        qty: 1,
      },
    ];
  });
};
  const updateSize = (productId, oldSize, newSize) => {
  setCart((prev) => {
    // item being changed
    const currentItem = prev.find(
      (p) => p.productId === productId && p.size === oldSize
    );

    if (!currentItem) return prev;

    // check if same product + new size already exists
    const existing = prev.find(
      (p) => p.productId === productId && p.size === newSize
    );

    // remove old item
    let updated = prev.filter(
      (p) => !(p.productId === productId && p.size === oldSize)
    );

    if (existing) {
      // merge quantities
      updated = updated.map((p) =>
        p.productId === productId && p.size === newSize
          ? { ...p, qty: p.qty + currentItem.qty }
          : p
      );
    } else {
      // change size
      updated.push({ ...currentItem, size: newSize });
    }

    return updated;
  });
};


  const updateQty = (productId, size, qty) => {
  setCart((prev) =>
    prev.map((p) =>
      p.productId === productId && p.size === size
        ? { ...p, qty }
        : p
    )
  );
};

const removeFromCart = (productId, size) => {
  setCart((prev) =>
    prev.filter(
      (p) => !(p.productId === productId && p.size === size)
    )
  );
};

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.reduce((s, i) => s + i.qty, 0),
        addToCart,
        updateQty,
        removeFromCart,
        updateSize,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
