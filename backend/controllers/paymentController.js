import crypto from "crypto";
import axios from "axios";
import Order from "../models/Order.js";

const PHONEPE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
// use sandbox URL if testing

export const createPhonePePayment = async (req, res) => {
  const { orderId, amount } = req.body;

  const merchantId = process.env.PHONEPE_MERCHANT_ID || "";
  const saltKey = process.env.PHONEPE_SALT_KEY || "";
  const saltIndex = process.env.PHONEPE_SALT_INDEX || "";
  if (!process.env.PHONEPE_MERCHANT_ID || !process.env.PHONEPE_SALT_KEY || !process.env.PHONEPE_SALT_INDEX) {
  return res.status(500).json({ message: "Payment temporarily unavailable" });
}  

  const payload = {
    merchantId,
    merchantTransactionId: orderId,
    merchantUserId: req.user._id.toString(),
    amount: amount * 100, // ₹ → paise
    redirectUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/verify`,
    redirectMode: "POST",
    callbackUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/verify`,
    paymentInstrument: {
      type: "PAY_PAGE", // 👈 enables UPI + CARD + NETBANKING
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

  const checksum =
    crypto
      .createHash("sha256")
      .update(base64Payload + "/pg/v1/pay" + saltKey)
      .digest("hex") +
    "###" +
    saltIndex;

  try {
    const response = await axios.post(
      PHONEPE_URL,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    res.json({
      success: true,
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "PhonePe payment failed" });
  }
};

export const verifyPhonePePayment = async (req, res) => {
  const saltKey = process.env.PHONEPE_SALT_KEY || "";
  const saltIndex = process.env.PHONEPE_SALT_INDEX || "";
  if (!process.env.PHONEPE_MERCHANT_ID || !process.env.PHONEPE_SALT_KEY || !process.env.PHONEPE_SALT_INDEX) {
  return res.status(500).json({ message: "Payment temporarily unavailable" });
}

  const responseBase64 = req.body.response;
  const decoded = JSON.parse(
    Buffer.from(responseBase64, "base64").toString("utf-8")
  );

  const checksum =
    crypto
      .createHash("sha256")
      .update(responseBase64 + saltKey)
      .digest("hex") +
    "###" +
    saltIndex;

  if (checksum !== req.headers["x-verify"]) {
    return res.status(400).send("Invalid checksum");
  }

  if (decoded.code === "PAYMENT_SUCCESS") {
    await Order.findOneAndUpdate(
      { _id: decoded.data.merchantTransactionId },
      { paymentStatus: "paid", orderStatus: "confirmed" }
    );

    return res.redirect(`${process.env.FRONTEND_URL}/order-summary`);
  }

  return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};
