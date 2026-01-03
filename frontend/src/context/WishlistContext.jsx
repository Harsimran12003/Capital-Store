import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(saved);
    } else {
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.productId === product._id);
      if (exists) {
        return prev.filter((p) => p.productId !== product._id);
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.images[0],
          price: product.originalPrice,
          category: product.category,
          discountedPrice: product.discountedPrice,
        },
      ];
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
