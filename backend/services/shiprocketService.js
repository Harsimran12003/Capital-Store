import axios from "axios";

const SHIPROCKET_API = "https://apiv2.shiprocket.in/v1/external";

let TOKEN_CACHE = null;
let TOKEN_EXPIRE_TIME = null;

/* ================= LOGIN ================= */
export const loginShiprocket = async () => {
  if (TOKEN_CACHE && TOKEN_EXPIRE_TIME > Date.now()) {
    return TOKEN_CACHE;
  }

  const res = await axios.post(`${SHIPROCKET_API}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  TOKEN_CACHE = res.data.token;
  TOKEN_EXPIRE_TIME = Date.now() + 8 * 60 * 60 * 1000;

  return TOKEN_CACHE;
};

/* ================= CREATE ORDER ================= */
export const createShiprocketOrder = async ({ order, user }) => {
  const token = await loginShiprocket();

  if (!order?.address) {
    throw new Error("Order has no address. Cannot create Shiprocket order.");
  }

  const addr = order.address;

  const payload = {
  order_id: order._id.toString(),
  order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
  
  pickup_location: process.env.SHIPROCKET_PICKUP || "Default",
  channel_id: process.env.SHIPROCKET_CHANNEL_ID || "",

  billing_customer_name: user.name || "Customer",
  billing_last_name: "",
  billing_address: addr.addressLine || "Address",
  billing_city: addr.city || "City",
  billing_state: addr.state || "State",
  billing_country: "India",
  billing_pincode: addr.pincode?.toString(),
  billing_phone: user.phone || "9999999999",
  billing_email: user.email || "test@mail.com",

  shipping_is_billing: true,

  order_items: order.items.map(i => ({
    name: i.name,
    sku: String(i.productId),
    units: i.qty,
    selling_price: i.price || i.originalPrice,
  })),

  payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",

  sub_total: order.pricing.total,
  total_discount: order.pricing.discount,

  // ⭐ REQUIRED ⭐
  length: 10,
  breadth: 10,
  height: 10,
  weight: 0.5
};


  const res = await axios.post(
    `${SHIPROCKET_API}/orders/create/adhoc`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

/* ================= TRACK BY AWB ================= */
export const trackShipmentByAWB = async (awb) => {
  const token = await loginShiprocket();

  const res = await axios.get(
    `${SHIPROCKET_API}/courier/track/awb/${awb}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

/* ================= TRACK BY ORDER ================= */
export const trackShipmentByOrder = async (shiprocketOrderId) => {
  const token = await loginShiprocket();

  const res = await axios.get(
    `${SHIPROCKET_API}/courier/track/shipment/${shiprocketOrderId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
