import axios from "axios";
import Order from "../models/Order.js";

const BASE_URL =
  process.env.PHONEPE_ENV === "PROD"
    ? "https://api.phonepe.com/apis/pg"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";


/****************************************
 * 1️⃣ GENERATE AUTH TOKEN
 ****************************************/
const getPhonePeToken = async () => {
  const res = await axios.post(
    `${BASE_URL}/v1/oauth/token`,
    new URLSearchParams({
      client_id: process.env.PHONEPE_CLIENT_ID,
      client_version: "1",
      client_secret: process.env.PHONEPE_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
};


/****************************************
 * 2️⃣ CREATE PAYMENT (Checkout V2)
 ****************************************/
export const createPhonePePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const token = await getPhonePeToken();

    const payload = {
      merchantOrderId: orderId,
      amount: Math.round(amount * 100), // paise
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/callback/${orderId}`,
        },
      },
    };

    const response = await axios.post(
      `${BASE_URL}/checkout/v2/pay`,
      payload,
      {
        headers: {
          Authorization: `O-Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      success: true,
      redirectUrl: response?.data?.redirectUrl,
      orderId: response?.data?.orderId,
    });

  } catch (err) {
    console.log("Create Payment Error:", err?.response?.data || err.message);

    res.status(500).json({
      message: "PhonePe payment failed",
      phonepeError: err?.response?.data || err.message,
    });
  }
};



/****************************************
 * 3️⃣ VERIFY STATUS (Callback)
 ****************************************/
export const phonePeCallback = async (req, res) => {
  try {
    const { orderId } = req.params;

    const token = await getPhonePeToken();

    const status = await axios.get(
      `${BASE_URL}/checkout/v2/order/${orderId}/status`,
      {
        headers: {
          Authorization: `O-Bearer ${token}`,
        },
      }
    );
    console.log("PHONEPE STATUS RAW ---->");
console.log(JSON.stringify(status.data, null, 2));

    const state = status?.data?.payload?.state;

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
    console.log("Status Error:", err?.response?.data || err.message);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};
