import Router from "express";
import {
  getPublicStoreData,
  getPublicStoreProductByName,
} from "../controllers/profileShare.controller.js";

const router = Router();

router.route("/store/name/:storeName").get(getPublicStoreData);
router
  .route("/store/name/:storeName/products")
  .get(getPublicStoreProductByName);

export default router;
