import axios from "axios";
import Order from "../models/Order.js";

const BASE_URL =
  process.env.PHONEPE_ENV === "PROD"
    ? "https://api.phonepe.com/apis/pg"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";

/* ========== GET ACCESS TOKEN ========== */
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


/* ========== CREATE PAYMENT SESSION ========== */
export const createPhonePePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const token = await getPhonePeToken();

    const payload = {
      merchantTransactionId: orderId,
      merchantUserId: "user_" + req.user._id,
      amount: amount * 100,
      redirectUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/callback/${orderId}`,
      callbackUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/callback/${orderId}`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const response = await axios.post(
      `${BASE_URL}/v5/payments/initiate`,
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
      redirectUrl: response.data.data.redirectUrl,
    });

  } catch (err) {
    console.log("PGV5 Create Error", err?.response?.data || err.message);

    res.status(500).json({
      message: "PhonePe payment failed",
      phonepeError: err?.response?.data || err.message,
    });
  }
};


/* ========== CALLBACK + VERIFY PAYMENT ========== */
export const phonePeCallback = async (req, res) => {
  try {
    const { orderId } = req.params;

    const token = await getPhonePeToken();

    const status = await axios.get(
      `${BASE_URL}/v5/payments/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (status.data.data.state === "COMPLETED") {
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
    console.log("Callback Error", err?.response?.data || err.message);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};
