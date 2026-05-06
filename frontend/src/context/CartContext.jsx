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

  /* ================= ADD TO CART ================= */
  const addToCart = (product, size, selectedImage) => {
    const finalSize =
      product?.category?.toLowerCase() === "unstitched"
        ? "FREE"
        : size;
    const finalImage = selectedImage || product.images?.[0];

    setCart((prev) => {
      const exists = prev.find(
        (p) =>
          p.productId === product._id && p.size === finalSize && p.image === finalImage
      );

      if (exists) {
        return prev.map((p) =>
          p.productId === product._id && p.size === finalSize && p.image === finalImage
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: finalImage,
          category: product.category, // ⭐ important
          discountedPrice: product.discountedPrice,
          originalPrice: product.originalPrice,
          size: finalSize,
          qty: 1,
        },
      ];
    });
  };

  /* ================= UPDATE SIZE ================= */
  const updateSize = (productId, image, oldSize, newSize) => {
    setCart((prev) => {
      const currentItem = prev.find(
        (p) => p.productId === productId && p.size === oldSize && p.image === image
      );
      if (!currentItem) return prev;

      const existing = prev.find(
        (p) => p.productId === productId && p.size === newSize && p.image === image
      );

      let updated = prev.filter(
        (p) => !(p.productId === productId && p.size === oldSize && p.image === image)
      );

      if (existing) {
        updated = updated.map((p) =>
          p.productId === productId && p.size === newSize && p.image === image
            ? { ...p, qty: p.qty + currentItem.qty }
            : p
        );
      } else {
        updated.push({ ...currentItem, size: newSize });
      }

      return updated;
    });
  };

  /* ================= UPDATE QTY ================= */
  const updateQty = (productId, size, image, qty) => {
    setCart((prev) =>
      prev.map((p) =>
        p.productId === productId && p.size === size && p.image === image
          ? { ...p, qty }
          : p
      )
    );
  };

  const clearCart = () => {
  setCart([]);
  localStorage.removeItem("cart");
};


  /* ================= REMOVE ================= */
  const removeFromCart = (productId, size, image) => {
    setCart((prev) =>
      prev.filter(
        (p) => !(p.productId === productId && p.size === size && p.image === image)
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
