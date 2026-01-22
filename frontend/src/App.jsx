import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Homepage from "./pages/Homepage";
import ReadymadePage from "./pages/ReadymadePage";
import Unstitched from "./pages/Unstitched";
import CottonPage from "./pages/CottonPage";
import WinterPage from "./pages/WinterPage";
import PartywearPage from "./pages/PartywearPage";
import BestsellerPage from "./pages/BestsellerPage";
import NewArrivalPage from "./pages/NewArrival";
import ReadymadeCottonPage from "./pages/ReadymadeCotton";
import ReadymadeWinterPage from "./pages/ReadymadeWinter";
import ReadymadePartywearPage from "./pages/ReadymadePartywear";
import UnstitchedCottonPage from "./pages/UnstitchedCotton";
import UnstitchedWinterPage from "./pages/UnstitchedWinter";
import UnstitchedPartywearPage from "./pages/UnstitchedPartywear";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import OrderSummary from "./pages/OrderSummary";
import Dashboard from "./pages/admin/Dashboard";
import AddSliderImages from "./pages/admin/AddSliderImages";
import AddProduct from "./pages/admin/AddProduct";
import ViewProducts from "./pages/admin/ViewProducts";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import Profile from "./pages/Profile";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import ShippingPolicy from "./pages/ShippingPolicy.jsx";
import RefundExchangePolicy from "./pages/RefundExchangePolicy.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import ChangeCredentials from "./pages/admin/ChangeCredentials.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AdminSidebar from "./components/AdminSidebar.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

function App() {
  const { user, loading } = useAuth();

  if (loading) return null; //
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />

          <Route path="/" element={<Homepage />} />

          <Route path="/readymade" element={<ReadymadePage />} />
          <Route path="/unstitched" element={<Unstitched />} />
          <Route path="/cotton" element={<CottonPage />} />
          <Route path="/winter" element={<WinterPage />} />
          <Route path="/partywear" element={<PartywearPage />} />
          <Route path="/bestseller" element={<BestsellerPage />} />
          <Route path="/new-arrival" element={<NewArrivalPage />} />

          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          <Route path="/readymade/cotton" element={<ReadymadeCottonPage />} />
          <Route path="/readymade/winter" element={<ReadymadeWinterPage />} />
          <Route
            path="/readymade/partywear"
            element={<ReadymadePartywearPage />}
          />

          <Route path="/unstitched/cotton" element={<UnstitchedCottonPage />} />
          <Route path="/unstitched/winter" element={<UnstitchedWinterPage />} />
          <Route
            path="/unstitched/partywear"
            element={<UnstitchedPartywearPage />}
          />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/address" element={<Address />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/summary" element={<OrderSummary />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/slider" element={<AddSliderImages />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<ViewProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route
            path="/admin/change-credentials"
            element={<ChangeCredentials />}
          />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route
            path="/return-refund-policy"
            element={<RefundExchangePolicy />}
          />

          <Route path="/order-summary/:id" element={<OrderSuccess />} />
          <Route path="/track/:id" element={<TrackOrder />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
