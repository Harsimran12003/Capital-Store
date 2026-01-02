import axios from "axios";

const SHIPROCKET_API = "https://apiv2.shiprocket.in/v1/external";

let TOKEN_CACHE = null;
let TOKEN_EXPIRE_TIME = null;

/* ================= LOGIN (with cache) ================= */
export const loginShiprocket = async () => {
  if (TOKEN_CACHE && TOKEN_EXPIRE_TIME > Date.now()) {
    return TOKEN_CACHE;
  }

  console.log("🔐 Logging into Shiprocket...");

  const res = await axios.post(`${SHIPROCKET_API}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  TOKEN_CACHE = res.data.token;
  TOKEN_EXPIRE_TIME = Date.now() + 8 * 60 * 60 * 1000;

  console.log("✅ Shiprocket token refreshed");

  return TOKEN_CACHE;
};

/* =========================================================
   CORE REQUEST WRAPPER — AUTO RECOVERY FOR 401 / 403
========================================================= */
const shiprocketRequest = async (method, url, data = null) => {
  let token = await loginShiprocket();

  try {
    return await axios({
      method,
      url: `${SHIPROCKET_API}${url}`,
      headers: { Authorization: `Bearer ${token}` },
      data
    });

  } catch (err) {
    const status = err.response?.status;

    // If token expired / forbidden → RESET + RETRY ONCE
    if (status === 401 || status === 403) {
      console.log("⚠️ Shiprocket token invalid. Resetting...");

      TOKEN_CACHE = null;
      TOKEN_EXPIRE_TIME = null;

      token = await loginShiprocket();

      return await axios({
        method,
        url: `${SHIPROCKET_API}${url}`,
        headers: { Authorization: `Bearer ${token}` },
        data
      });
    }

    throw err;
  }
};

/* ================= CREATE ORDER ================= */
export const createShiprocketOrder = async ({ order, user }) => {
  if (!order?.address) {
    throw new Error("Order has no address. Cannot create Shiprocket order.");
  }

  const addr = order.address;

  const payload = {
    order_id: order._id.toString(),
    order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    
    pickup_location: process.env.SHIPROCKET_PICKUP || "Default",
    // remove channel id if unused
    // channel_id: process.env.SHIPROCKET_CHANNEL_ID || "",

    billing_customer_name: user.name || "Customer",
    billing_last_name: "",
    billing_address: addr.addressLine || "Address",
    billing_city: addr.city || "City",
    billing_state: addr.state || "State",
    billing_country: "India",
    billing_pincode: addr.pincode?.toString(),
billing_phone: (() => {
  const p = (user.phone || "").toString().replace(/\D/g, "");
  return p.length >= 10 ? p.slice(-10) : "9999999999";
})(),
    billing_email: user.email || "test@mail.com",

    shipping_is_billing: true,

    order_items: order.items.map((i) => ({
      name: i.name,
      sku: String(i.productId),
      units: i.qty,
      selling_price: i.price || i.originalPrice,
    })),

    payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",

    sub_total: order.pricing.total,
    total_discount: order.pricing.discount,

    // Required
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  console.log("📦 Creating Shiprocket Order...");

  const res = await shiprocketRequest(
    "post",
    "/orders/create/adhoc",
    payload
  );

  console.log("✅ Shiprocket Order Created");
  console.log(res.data);

  return res.data;
};

/* ================= TRACK BY AWB ================= */
export const trackShipmentByAWB = async (awb) => {
  const res = await shiprocketRequest(
    "get",
    `/courier/track/awb/${awb}`
  );

  return res.data;
};

/* ================= TRACK BY ORDER ================= */
export const trackShipmentByOrder = async (shiprocketOrderId) => {
  const res = await shiprocketRequest(
    "get",
    `/courier/track/shipment/${shiprocketOrderId}`
  );

  return res.data;
};
