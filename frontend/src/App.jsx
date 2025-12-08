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

function App() {
  return (
    <>
      <Router>
        <Routes>
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

          <Route path="/readymade/cotton" element={<ReadymadeCottonPage />} />
          <Route path="/readymade/winter" element={<ReadymadeWinterPage />} />
          <Route path="/readymade/partywear" element={<ReadymadePartywearPage />} />

          <Route path="/unstitched/cotton" element={<UnstitchedCottonPage />} />
          <Route path="/unstitched/winter" element={<UnstitchedWinterPage />} />
          <Route path="/unstitched/partywear" element={<UnstitchedPartywearPage />} />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/address" element={<Address />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-summary" element={<OrderSummary />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
