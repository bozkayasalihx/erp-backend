import { Router } from "express";
import { fileUploadController } from "../controllers";
import checkFileType from "../middlewares/checkFileType";

const router = Router();
// xlsx
// csv
router.post("/file-upload", checkFileType, fileUploadController);

export default router;
