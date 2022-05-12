import { Router } from "express";
import getRelationController from "../../controllers/global/getRelationController";
import { Routes } from "../../types/routePath";

const router = Router();

router.post(Routes.USER_RELATION, getRelationController);

export default router;
