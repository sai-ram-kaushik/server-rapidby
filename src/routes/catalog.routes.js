import { Router } from "express";
import {
  addProductFromCatalog,
  countMyProducts,
  createCatalog,
  getAllCatalogs,
  getProductByIdForUser,
  getProductsByUser,
  removeProductFromMyProduct,
} from "../controllers/catalog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-catalog").post(upload.single("imageUrl"), createCatalog);
router.route("/get-all-catalogs").get(getAllCatalogs);
router.route("/add-product").post(verifyJWT, addProductFromCatalog);
router.route("/get-products").get(verifyJWT, getProductsByUser);
router.route("/:storeName/product/:id").get(getProductByIdForUser);
router
  .route("/remove-product-from-myproduct")
  .post(verifyJWT, removeProductFromMyProduct);
router.route("/count-products").get(verifyJWT ,countMyProducts);

export default router;
