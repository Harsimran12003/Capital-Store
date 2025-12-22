import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ShippingPolicy() {
  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4D192B] mb-6">
          Shipping Policy
        </h1>

        <p className="text-sm text-gray-500 mb-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* INTRO */}
        <section className="space-y-4 mb-10">
          <p>
            At <strong>Capital Store</strong>, we aim to deliver your orders in a
            timely, safe, and reliable manner. This Shipping Policy explains how
            shipping is handled for domestic and international orders.
          </p>
        </section>

        {/* SHIPPING LOCATIONS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            1. Shipping Locations
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We ship orders across <strong>India</strong></li>
            <li>
              International shipping is available for selected countries
            </li>
          </ul>
        </section>

        {/* DELIVERY TIME */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            2. Estimated Delivery Time
          </h2>
          <p>
            Orders are usually delivered within{" "}
            <strong>5 business days</strong> from the date of dispatch.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Delivery timelines may vary depending on location, courier partner,
            weather conditions, or unforeseen circumstances.
          </p>
        </section>

        {/* SHIPPING CHARGES */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            3. Shipping Charges
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Free shipping</strong> on all orders within India
            </li>
            <li>
              For orders outside India, shipping charges will be calculated at
              checkout and must be paid by the customer
            </li>
          </ul>
        </section>

        {/* COD POLICY */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            4. Cash on Delivery (COD)
          </h2>
          <p>
            Cash on Delivery (COD) is available{" "}
            <strong>only for orders delivered within Ludhiana</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            COD is not available for orders outside Ludhiana or for
            international shipments.
          </p>
        </section>

        {/* COURIER PARTNERS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            5. Courier Partners
          </h2>
          <p>
            We use trusted logistics partners such as{" "}
            <strong>Shiprocket</strong> and associated courier services to
            ensure safe and timely delivery of your orders.
          </p>
        </section>

        {/* ORDER TRACKING */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            6. Order Tracking
          </h2>
          <p>
            Once your order is shipped, you will receive tracking details via
            email or SMS to monitor your shipment status.
          </p>
        </section>

        {/* DELAYS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            7. Delays & Exceptions
          </h2>
          <p>
            Capital Store is not responsible for delays caused by courier
            partners, natural calamities, strikes, or incorrect shipping
            information provided by the customer.
          </p>
        </section>

        {/* CONTACT */}
        <section>
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            8. Contact Us
          </h2>
          <p>
            If you have any questions regarding shipping, please contact us:
          </p>

          <p className="mt-3">
            <strong>Capital Store</strong>
            <br />
            Proprietor Name: Harish Chander
            <br />
            Email: capitalstorecs@yahoo.com
            <br />
            Phone: +91 9888320496
            <br />
            Address: B-IV, Capital Store, Ghass Mandi, Ludhiana, Punjab, 141008
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}
