import { Router } from "express";
import { getUserEntityAccessController } from "../../controllers/";
import { Routes } from "../../types/routePath";

const router = Router();

router.get(Routes.GET_USER_ACCESS, getUserEntityAccessController);

export default router;
