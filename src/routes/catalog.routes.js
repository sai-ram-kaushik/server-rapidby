import { Router } from "express";
import {
  addProductFromCatalog,
  createCatalog,
  getAllCatalogs,
  getProductByIdForUser,
  getProductsByUser,
  removeProductFromMyProduct
} from "../controllers/catalog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-catalog").post(upload.single("imageUrl"), createCatalog);
router.route("/get-all-catalogs").get(getAllCatalogs);
router.route("/add-product").post(verifyJWT, addProductFromCatalog);
router.route("/get-products").get(verifyJWT, getProductsByUser);
router.route("/get-product/:id").get(verifyJWT, getProductByIdForUser);
router.route("/remove-product-from-myproduct").post(verifyJWT ,removeProductFromMyProduct);


export default router;
