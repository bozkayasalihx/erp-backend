import { Router } from "express";
import {
    vdsbsRelationController,
    vdsRelationController,
} from "../../controllers";
import { Routes } from "../../types/routePath";

const router = Router();

router.post(Routes.CREATE_VDS_RELATION, vdsRelationController);
router.post(Routes.CREATE_VDBS_RELATION, vdsbsRelationController);

export default router;
