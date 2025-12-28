import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";

export const createDefaultAdmin = async () => {
  const existing = await Admin.findOne();
  if (existing) return;

  const hashed = await bcrypt.hash("admin123", 10);

  await Admin.create({
    email: "admin@capitalstore.com",
    password: hashed
  });

  console.log("Default Admin Created:");
  console.log("Email: admin@capitalstore.com");
  console.log("Password: admin123");
};
