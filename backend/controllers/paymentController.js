import crypto from "crypto";
import axios from "axios";
import Order from "../models/Order.js";

const BASE_URL = process.env.PHONEPE_ENV === "PROD"
  ? "https://api.phonepe.com/apis/hermes"
  : "https://api-preprod.phonepe.com/apis/hermes";   // UAT

const merchantId = process.env.PHONEPE_MERCHANT_ID;
const saltKey = process.env.PHONEPE_SALT_KEY;
const saltIndex = process.env.PHONEPE_SALT_INDEX || 1;
const backend = process.env.BACKEND_URL;
const frontend = process.env.FRONTEND_URL;


// ================= CREATE PAYMENT =================
export const createPhonePePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!merchantId || !saltKey) {
      return res
        .status(500)
        .json({ message: "PhonePe not configured" });
    }

    const payload = {
      merchantId,
      merchantTransactionId: orderId,
      merchantUserId: req.user._id.toString(),
      amount: amount * 100,
      redirectUrl: `${backend}/api/payment/phonepe/callback/${orderId}`,
      redirectMode: "POST",
      callbackUrl: `${backend}/api/payment/phonepe/callback/${orderId}`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    const checksum =
      crypto
        .createHash("sha256")
        .update(base64Payload + "/pg/v1/pay" + saltKey)
        .digest("hex") +
      "###" +
      saltIndex;

    const phonePeRes = await axios.post(
      `${BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );

    return res.json({
      success: true,
      redirectUrl: phonePeRes.data.data.instrumentResponse.redirectInfo.url,
    });

  } catch (err) {
    console.error("PhonePe Create Error:", err?.response?.data || err.message);
    res.status(500).json({ message: "PhonePe payment failed" });
  }
};



// ================= VERIFY VIA STATUS API =================
export const phonePeCallback = async (req, res) => {
  try {
    const { orderId } = req.params;

    const checksum =
      crypto
        .createHash("sha256")
        .update(`/pg/v1/status/${merchantId}/${orderId}` + saltKey)
        .digest("hex") +
      "###" +
      saltIndex;

    const statusRes = await axios.get(
      `${BASE_URL}/pg/v1/status/${merchantId}/${orderId}`,
      {
        headers: {
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": merchantId,
          "Content-Type": "application/json",
        },
      }
    );

    const status = statusRes.data.data;

    if (status.state === "COMPLETED") {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
      });

      return res.redirect(`${frontend}/order-summary/${orderId}`);
    }

    return res.redirect(`${frontend}/payment-failed`);

  } catch (err) {
    console.error("PhonePe Verify Error:", err?.response?.data || err.message);
    res.redirect(`${frontend}/payment-failed`);
  }
};
