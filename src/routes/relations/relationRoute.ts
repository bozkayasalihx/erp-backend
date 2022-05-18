import { Router } from "express";
import {
    createDealerRouteUser,
    createUserEntityRelationController,
    getVdsbsRelationsController,
    getVdsRelationsController,
    vdsbsRelationController,
    vdsRelationController,
} from "../../controllers";
import { IDealerRouteUser } from "../../controllers/relations/createDealerRouteUser";
import { IVDSBSRelations } from "../../controllers/relations/createVdsbsRelations";
import { IVdsRelations } from "../../controllers/relations/createVdsRelations";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_VDS_RELATION,
    new Validate<IVdsRelations>().validate(
        validationSchema.createVdsValidation()
    ),
    vdsRelationController
);
router.post(
    Routes.CREATE_VDSBS_RELATION,
    new Validate<IVDSBSRelations>().validate(
        validationSchema.createVdsbsValidation()
    ),
    vdsbsRelationController
);
router.post(
    Routes.CREATE_USER_ENTITY,
    new Validate().validate(validationSchema.createUserEntityValidation()),
    createUserEntityRelationController
);

router.post(
    Routes.CREATE_DEALER_USER_ROUTE,
    new Validate<IDealerRouteUser>().validate(
        validationSchema.createDealerRouteUser()
    ),
    createDealerRouteUser
);

router.get(`${Routes.CREATE_VDS_RELATION}/:vds_id?`, getVdsRelationsController);
router.get(
    `${Routes.CREATE_VDSBS_RELATION}/:vdsbs_id?`,
    getVdsbsRelationsController
);

export default router;
