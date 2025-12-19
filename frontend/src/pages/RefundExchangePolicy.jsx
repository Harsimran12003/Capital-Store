import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RefundExchangePolicy() {
  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4D192B] mb-6">
          Refund, Return & Exchange Policy
        </h1>

        <p className="text-sm text-gray-500 mb-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* INTRO */}
        <section className="space-y-4 mb-10">
          <p>
            At <strong>Capital Store</strong>, customer satisfaction is our
            priority. Please read this policy carefully to understand our
            process for returns, exchanges, and refunds.
          </p>
        </section>

        {/* RETURN POLICY */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            1. Return Policy
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Returns are applicable <strong>within 7 days</strong> of product
              delivery.
            </li>
            <li>
              To initiate a return, customers must contact us on the phone
              number provided below within the return window.
            </li>
            <li>
              Products must be unused, unwashed, and in their original
              condition with tags intact.
            </li>
            <li>
              Returns requested after 7 days from delivery will not be
              accepted.
            </li>
          </ul>
        </section>

        {/* EXCHANGE POLICY */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            2. Exchange Policy
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Exchange requests are accepted within <strong>7 days</strong> of
              delivery.
            </li>
            <li>
              Exchange will be processed only after successful verification of
              the returned product.
            </li>
            <li>
              Once approved, the exchanged product will be delivered within
              approximately <strong>7 days</strong>.
            </li>
            <li>
              Exchange availability is subject to stock availability.
            </li>
          </ul>
        </section>

        {/* COURIER CHARGES */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            3. Courier & Shipping Charges
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Customers are required to bear the courier charges for returning
              or exchanging a product.
            </li>
            <li>
              Any free shipping provided at the time of order will be
              deducted from the refund amount.
            </li>
            <li>
              Courier charges are non-refundable.
            </li>
          </ul>
        </section>

        {/* REFUND POLICY */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            4. Refund Policy
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Refunds are processed only after the returned product has been
              received and verified.
            </li>
            <li>
              If approved, the refund amount will be credited to the{" "}
              <strong>original payment source</strong>.
            </li>
            <li>
              Refunds will be processed within{" "}
              <strong>7–10 business days</strong> after approval.
            </li>
            <li>
              The refunded amount will be after deducting applicable courier
              charges.
            </li>
          </ul>
        </section>

        {/* NON-REFUNDABLE CASES */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            5. Non-Refundable Cases
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Products damaged due to customer misuse</li>
            <li>Products returned after the return window</li>
            <li>Items without original tags or packaging</li>
          </ul>
        </section>

        {/* CONTACT */}
        <section>
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            6. Contact Us
          </h2>
          <p>
            To initiate a return, exchange, or refund request, please contact
            us:
          </p>

         <p className="mt-3">
            <strong>Capital Store</strong>
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
