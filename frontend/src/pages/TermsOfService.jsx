import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfService() {
  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4D192B] mb-6">
          Terms of Service
        </h1>

        <p className="text-sm text-gray-500 mb-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* INTRO */}
        <section className="space-y-4 mb-10">
          <p>
            Welcome to <strong>Capital Store</strong>. These Terms of Service
            ("Terms") govern your access to and use of our website, products,
            and services.
          </p>
          <p>
            By accessing or using our website, you agree to be bound by these
            Terms. If you do not agree, please do not use our services.
          </p>
        </section>

        {/* ELIGIBILITY */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            1. Eligibility
          </h2>
          <p>
            You must be at least 18 years old or have legal parental consent to
            use this website. By using our services, you represent that you are
            legally capable of entering into a binding agreement.
          </p>
        </section>

        {/* ACCOUNT */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            2. User Account
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You are responsible for maintaining account confidentiality</li>
            <li>All information provided must be accurate and up to date</li>
            <li>We reserve the right to suspend or terminate accounts for misuse</li>
          </ul>
        </section>

        {/* ORDERS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            3. Orders & Payments
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All orders are subject to availability and confirmation</li>
            <li>
              Payments are securely processed via <strong>PhonePe</strong>
            </li>
            <li>We do not store payment credentials</li>
            <li>
              Prices, discounts, and offers are subject to change without notice
            </li>
          </ul>
        </section>

        {/* SHIPPING */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            4. Shipping & Delivery
          </h2>
          <p>
            Orders are shipped using <strong>Shiprocket</strong> or our trusted
            logistics partners. Delivery timelines are estimates and may vary
            due to location, courier delays, or unforeseen circumstances.
          </p>
        </section>

        {/* RETURNS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            5. Returns & Refunds
          </h2>
          <p>
            Returns and refunds are governed by our Refund & Cancellation
            Policy. Please review the policy before placing an order.
          </p>
        </section>

        {/* INTELLECTUAL PROPERTY */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            6. Intellectual Property
          </h2>
          <p>
            All content, logos, images, designs, and materials on this website
            are the intellectual property of Capital Store and may not be used,
            copied, or distributed without permission.
          </p>
        </section>

        {/* PROHIBITED USE */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            7. Prohibited Activities
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violation of laws or regulations</li>
            <li>Fraudulent transactions</li>
            <li>Abuse, harassment, or misuse of the platform</li>
            <li>Attempting to breach website security</li>
          </ul>
        </section>

        {/* LIMITATION */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            8. Limitation of Liability
          </h2>
          <p>
            Capital Store shall not be liable for indirect, incidental, or
            consequential damages arising from the use or inability to use our
            services.
          </p>
        </section>

        {/* TERMINATION */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            9. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate access to our services
            at our sole discretion, without prior notice, if these Terms are
            violated.
          </p>
        </section>

        {/* GOVERNING LAW */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            10. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with
            the laws of India. Any disputes shall be subject to the jurisdiction
            of Indian courts.
          </p>
        </section>

        {/* CHANGES */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            11. Changes to Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            website after changes implies acceptance of the revised Terms.
          </p>
        </section>

        {/* CONTACT */}
        <section>
          <h2 className="text-xl font-semibold text-[#4D192B] mb-3">
            12. Contact Information
          </h2>
          <p>
            For questions regarding these Terms, please contact:
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
