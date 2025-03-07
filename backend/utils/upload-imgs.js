import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const extMap = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

const fileFilter = (req, file, callback) => {
  callback(null, !!extMap[file.mimetype]);
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // callback(null, "public/img");
    callback(null, "public/users");//先存到users資料夾
  },
  filename: (req, file, callback) => {
    const f = uuidv4() + extMap[file.mimetype];
    callback(null, f);
  },
});
export default multer({ fileFilter, storage });