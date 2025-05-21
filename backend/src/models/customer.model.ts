import mongoose, { Document, Schema } from "mongoose";

export interface CustomerDocument extends Document {
  company: string;
  primaryContact: { name: string; email: string };
  phone: string;
  active: boolean;
  groups: string[];
  dateCreated: Date;
}

const customerSchema = new Schema<CustomerDocument>(
  {
    company: { type: String, required: true, trim: true },
    primaryContact: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
    },
    phone: { type: String, required: true, trim: true },
    active: { type: Boolean, default: false },
    groups: [{ type: String, trim: true }],
    dateCreated: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const CustomerModel = mongoose.model<CustomerDocument>("Customer", customerSchema);
export default CustomerModel;
