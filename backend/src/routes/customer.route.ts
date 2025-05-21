import { Router } from "express";
import multer from "multer";
import {
  createCustomerController,
  getCustomersController,
  getCustomerCountsController,
  importCustomersController,
  exportCustomersController,
} from "../controllers/customer.controller";
import { csvImportMiddleware } from "../middlewares/csv.middleware";

const upload = multer({ dest: "uploads/" });
const customerRoutes = Router();

customerRoutes.get("/", getCustomersController);
customerRoutes.get("/counts", getCustomerCountsController);
customerRoutes.post("/", createCustomerController);
customerRoutes.post("/import", upload.single("file"), csvImportMiddleware, importCustomersController);
customerRoutes.get("/export", exportCustomersController);

export default customerRoutes;
