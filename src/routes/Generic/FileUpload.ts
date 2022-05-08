import { Router } from "express";
import fileUpload from "express-fileupload";
import { fileUploadController } from "../../controllers";
import checkFileType from "../../middlewares/checkFileType";
import { __prod__ } from "../../scripts/dev";
import { Routes } from "../../types/routePath";

const router = Router();
// xlsx
// csv
const file = () => {
    return fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024, // 10mb
        },
        useTempFiles: true,
        tempFileDir: "/temp/",
        debug: !__prod__,
    });
};
router.post(Routes.FILE_UPLOAD, file(), checkFileType, fileUploadController);

export default router;
