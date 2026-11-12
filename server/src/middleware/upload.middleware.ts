import multer from "multer";
import { ApiError } from "../utils/api-error";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new ApiError(422, "Only image files can be uploaded."));
      return;
    }
    callback(null, true);
  },
});

/** Accepts up to 10 hotel or room photos under the field name `images`. */
export const uploadHotelImages = upload.array("images", 10);
