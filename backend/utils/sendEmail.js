import nodemailer from "nodemailer";

export const sendOrderConfirmationEmail = async (to, order) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify(); // 🔥 FORCE VERIFY

    const itemsHTML = order.items
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.qty}</td>
            <td>₹${item.price}</td>
          </tr>
        `
      )
      .join("");

    await transporter.sendMail({
      from: `"Capital Store" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🛍️ Order Confirmed | Capital Store",
      html: `
        <h2>Order Placed Successfully 🎉</h2>
        <p><b>Order ID:</b> ${order._id}</p>

        <table border="1" cellpadding="8" cellspacing="0">
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
          ${itemsHTML}
        </table>

        <p><b>Total:</b> ₹${order.pricing.total}</p>
        <p><b>Payment:</b> ${order.paymentMethod.toUpperCase()}</p>

        <p><b>Address:</b><br/>
          ${order.address.addressLine}<br/>
          ${order.address.city}, ${order.address.state} - ${order.address.pincode}
        </p>

        <p>Thank you for shopping with Capital Store ❤️</p>
      `,
    });

    console.log("✅ Order confirmation email sent to:", to);
  } catch (err) {
    console.error("❌ Email Error:", err.message);
  }
};