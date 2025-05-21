import CustomerModel, { CustomerDocument } from "../models/customer.model";

export const createCustomerService = async (data: Partial<CustomerDocument>) => {
  const customer = new CustomerModel(data);
  await customer.save();
  return customer;
};

export const getCustomersService = async (
  page: number,
  limit: number,
  search: string
) => {
  const query = search
    ? {
        $or: [
          { company: { $regex: search, $options: "i" } },
          { "primaryContact.name": { $regex: search, $options: "i" } },
          { "primaryContact.email": { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { groups: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const customers = await CustomerModel.find(query)
    .sort({ dateCreated: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await CustomerModel.countDocuments(query);

  return { customers, total };
};

export const getCustomerCountsService = async () => {
  const total = await CustomerModel.countDocuments();
  const active = await CustomerModel.countDocuments({ active: true });
  const inactive = await CustomerModel.countDocuments({ active: false });
  return { total, active, inactive };
};

export const importCustomersService = async (customers: any[]) => {
  await CustomerModel.insertMany(customers);
};

export const exportCustomersService = async () => {
  return await CustomerModel.find();
};
