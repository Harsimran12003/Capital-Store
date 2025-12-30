import crypto from "crypto";

export const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || "",
  SALT_KEY: process.env.PHONEPE_SALT_KEY || "",
  SALT_INDEX: 1,
  BASE_URL: "https://api.phonepe.com/apis/hermes",
};

export const generateChecksum = (payload) => {
  const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const checksum =
    crypto
      .createHash("sha256")
      .update(base64 + "/pg/v1/pay" + PHONEPE_CONFIG.SALT_KEY)
      .digest("hex") +
    "###" +
    PHONEPE_CONFIG.SALT_INDEX;

  return { base64, checksum };
};
