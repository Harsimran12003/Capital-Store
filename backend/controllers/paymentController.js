import axios from "axios";
import Order from "../models/Order.js";

const BASE_URL =
  process.env.PHONEPE_ENV === "PROD"
    ? "https://api.phonepe.com/apis/pg"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";


/* ================= GET ACCESS TOKEN ================= */
const getPhonePeToken = async () => {
  const res = await axios.post(
    `${BASE_URL}/oauth/token`,
    "grant_type=client_credentials&scope=payments",
    {
      auth: {
        username: process.env.PHONEPE_CLIENT_ID,
        password: process.env.PHONEPE_CLIENT_SECRET,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return res.data.access_token;
};


/* ================= CREATE PAYMENT ================= */
export const createPhonePePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!process.env.PHONEPE_CLIENT_ID || !process.env.PHONEPE_CLIENT_SECRET) {
      return res.status(500).json({ message: "PhonePe not configured" });
    }

    const token = await getPhonePeToken();

    const payload = {
      merchantId: process.env.PHONEPE_CLIENT_ID,        // IMPORTANT
      merchantTransactionId: orderId,
      merchantUserId: "user_" + req.user._id,
      amount: Math.round(amount * 100),                 // ₹ to paise
      redirectUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/callback/${orderId}`,
      callbackUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/callback/${orderId}`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const response = await axios.post(
      `${BASE_URL}/pg/v1/pay`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      success: true,
      redirectUrl: response?.data?.data?.redirectUrl,
    });

  } catch (err) {
    console.log("PG V5 Create Error:", err?.response?.data || err.message);
    return res.status(500).json({
      message: "PhonePe payment failed",
      phonepeError: err?.response?.data || err.message,
    });
  }
};



/* ================= CALLBACK / STATUS VERIFY ================= */
export const phonePeCallback = async (req, res) => {
  try {
    const { orderId } = req.params;

    const token = await getPhonePeToken();

    const status = await axios.get(
      `${BASE_URL}/pg/v1/status/${process.env.PHONEPE_CLIENT_ID}/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const state = status?.data?.data?.state;

    if (state === "COMPLETED") {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "placed",
      });

      return res.redirect(
        `${process.env.FRONTEND_URL}/order-summary/${orderId}`
      );
    }

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);

  } catch (err) {
    console.log("PhonePe Callback Error:", err?.response?.data || err.message);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};
