import { Router } from "express";
import { fileUploadController } from "../../controllers";
import checkFileType from "../../middlewares/checkFileType";
import { Routes } from "../../types/routePath";

const router = Router();
// xlsx
// csv
router.post(Routes.FILE_UPLOAD, checkFileType, fileUploadController);

export default router;
