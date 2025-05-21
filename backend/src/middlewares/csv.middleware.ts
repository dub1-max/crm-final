import { Request, Response, NextFunction } from "express";
import csv from "csv-parser";
import fs from "fs";

export const csvImportMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }
  const results: any[] = [];
  fs.createReadStream(req.file!.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      (req as any).customers = results.map(row => ({
        company: row.company,
        primaryContact: { name: row.primaryContactName, email: row.primaryContactEmail },
        phone: row.phone,
        active: row.active === "true",
        groups: row.groups ? row.groups.split(";") : [],
        dateCreated: row.dateCreated ? new Date(row.dateCreated) : new Date(),
      }));
      fs.unlinkSync(req.file!.path);
      next();
    });
};
