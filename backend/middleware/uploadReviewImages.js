import multer from "multer";
import multerStorageCloudinary from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new multerStorageCloudinary({
  cloudinary,
  params: {
    folder: "capitalstore/reviews",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

export default upload;
