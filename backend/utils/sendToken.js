import jwt from "jsonwebtoken";

const sendToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // use "none" + secure for different domains
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    user,
  });
};

export default sendToken;
