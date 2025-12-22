import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4D192B] mb-6">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-500 mb-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* INTRO */}
        <section className="space-y-4 mb-10">
          <p>
            Welcome to <strong>Capital Store</strong>. Your privacy is important
            to us. This Privacy Policy explains how we collect, use, disclose,
            and protect your information when you visit or make a purchase from
            our website.
          </p>
          <p>
            By using our website, you agree to the terms outlined in this
            Privacy Policy.
          </p>
        </section>

        {/* INFORMATION COLLECTION */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            1. Information We Collect
          </h2>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone
              number, shipping and billing address.
            </li>
            <li>
              <strong>Order Information:</strong> Products purchased, order
              history, and delivery details.
            </li>
            <li>
              <strong>Payment Information:</strong> Payments are securely
              processed via <strong>PhonePe</strong>. We do not store your card,
              UPI, or bank details.
            </li>
            <li>
              <strong>Shipping Information:</strong> Shared with
              <strong> Shiprocket</strong> for order fulfillment and delivery.
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, device
              information, and usage data.
            </li>
          </ul>
        </section>

        {/* USAGE */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To process and fulfill orders</li>
            <li>To enable secure payments via PhonePe</li>
            <li>To ship orders using Shiprocket</li>
            <li>To provide customer support and order updates</li>
            <li>To improve website performance and security</li>
            <li>To comply with legal and regulatory requirements</li>
          </ul>
        </section>

        {/* SHARING */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            3. Sharing of Information
          </h2>
          <p className="mb-3">
            We do not sell or rent your personal information. Data is shared
            only with:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>PhonePe – for payment processing</li>
            <li>Shiprocket – for logistics and delivery</li>
            <li>Legal authorities – when required by law</li>
          </ul>
        </section>

        {/* SECURITY */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            4. Data Security
          </h2>
          <p>
            We use industry-standard security measures such as encrypted
            connections (HTTPS) and secure servers to protect your information.
            However, no online system is completely secure.
          </p>
        </section>

        {/* COOKIES */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            5. Cookies
          </h2>
          <p>
            We may use cookies to enhance user experience, analyze traffic, and
            improve our website. You can disable cookies via your browser
            settings.
          </p>
        </section>

        {/* USER RIGHTS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            6. Your Rights
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access your personal data</li>
            <li>Request corrections</li>
            <li>Request account deletion (subject to legal requirements)</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </section>

        {/* COMPLIANCE */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            7. Compliance
          </h2>
          <p>
            This policy complies with PhonePe merchant guidelines, Shiprocket
            data processing policies, and applicable Indian data protection
            laws.
          </p>
        </section>

        {/* CONTACT */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            8. Contact Us
          </h2>
          <p>If you have questions about this Privacy Policy, contact us:</p>
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
