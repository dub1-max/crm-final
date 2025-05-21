import React, { useEffect, useState } from "react";
import { Customer } from "../types/api.type";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../components/ui/pagination";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const API_BASE = "http://localhost:8000/api/customer";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchCounts();
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, limit, search]);

  const fetchCounts = async () => {
    const res = await axios.get(`${API_BASE}/counts`);
    setCounts(res.data);
  };

  const fetchCustomers = async () => {
    const res = await axios.get(API_BASE, {
      params: { page, limit, search },
    });
    setCustomers(res.data.customers);
    setTotal(res.data.total);
  };

  const handleExport = async () => {
    const res = await axios.get(`${API_BASE}/export`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    await axios.post(`${API_BASE}/import`, formData);
    setImporting(false);
    fetchCustomers();
    fetchCounts();
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Customers</h1>
        <div className="flex gap-4 mb-2">
          <span>{counts.total} <span className="font-semibold">Total Customers</span></span>
          <span className="text-green-600">{counts.active} <span className="font-semibold">Active Customers</span></span>
          <span className="text-red-600">{counts.inactive} <span className="font-semibold">Inactive Customers</span></span>
        </div>
        <div className="flex gap-2 mb-4">
          <Button>+ New Customer</Button>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              Import Customers
              <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
            </label>
          </Button>
        </div>
        <div className="flex gap-2 items-center mb-4">
          <Select value={limit.toString()} onValueChange={v => { setLimit(Number(v)); setPage(1); }}>
            {PAGE_SIZE_OPTIONS.map(opt => (
              <option key={opt} value={opt.toString()}>{opt}</option>
            ))}
          </Select>
          <Button variant="outline" onClick={handleExport}>Export</Button>
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-64"
          />
        </div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Primary Contact</TableCell>
              <TableCell>Primary Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Groups</TableCell>
              <TableCell>Date Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c, idx) => (
              <TableRow key={c._id}>
                <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                <TableCell>{c.company}</TableCell>
                <TableCell>{c.primaryContact.name}</TableCell>
                <TableCell>{c.primaryContact.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>
                  <input type="checkbox" checked={c.active} readOnly className="accent-green-500" />
                </TableCell>
                <TableCell>
                  {c.groups.map(g => (
                    <Badge key={g} className="mr-1">{g}</Badge>
                  ))}
                </TableCell>
                <TableCell>{new Date(c.dateCreated).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <span>Showing {customers.length ? (page - 1) * limit + 1 : 0} to {(page - 1) * limit + customers.length} of {total} entries</span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                />
              </PaginationItem>
              {[...Array(Math.ceil(total / limit)).keys()].map(i => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={e => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (page < Math.ceil(total / limit)) setPage(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Customers; 