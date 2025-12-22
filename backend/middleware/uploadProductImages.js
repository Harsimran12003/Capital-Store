import multer from "multer";
import multerStorageCloudinary from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new multerStorageCloudinary({
  cloudinary,
  params: {
    folder: "capitalstore/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadProductImages = multer({ storage });

export default uploadProductImages;
