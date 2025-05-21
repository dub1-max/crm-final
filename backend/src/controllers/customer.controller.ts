import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  createCustomerService,
  getCustomersService,
  getCustomerCountsService,
  importCustomersService,
  exportCustomersService,
} from "../services/customer.service";
import { createCustomerSchema } from "../validation/customer.validation";
import { Parser } from "json2csv";

export const createCustomerController = asyncHandler(async (req: Request, res: Response) => {
  const data = createCustomerSchema.parse(req.body);
  const customer = await createCustomerService(data);
  res.status(201).json(customer);
});

export const getCustomersController = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 25;
  const search = (req.query.search as string) || "";
  const { customers, total } = await getCustomersService(page, limit, search);
  res.json({ customers, total });
});

export const getCustomerCountsController = asyncHandler(async (_req: Request, res: Response) => {
  const counts = await getCustomerCountsService();
  res.json(counts);
});

export const importCustomersController = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const customers = req.customers;
  await importCustomersService(customers);
  res.json({ message: "Import successful" });
});

export const exportCustomersController = asyncHandler(async (_req: Request, res: Response) => {
  const customers = await exportCustomersService();
  const fields = [
    { label: "Company", value: "company" },
    { label: "Primary Contact Name", value: "primaryContact.name" },
    { label: "Primary Contact Email", value: "primaryContact.email" },
    { label: "Phone", value: "phone" },
    { label: "Active", value: "active" },
    { label: "Groups", value: (row: any) => row.groups.join(";") },
    { label: "Date Created", value: "dateCreated" },
  ];
  const parser = new Parser({ fields });
  const csvData = parser.parse(customers);
  res.header("Content-Type", "text/csv");
  res.attachment("customers.csv");
  return res.send(csvData);
});
