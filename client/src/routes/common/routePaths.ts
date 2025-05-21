export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
};

export const PROTECTED_ROUTES = {
  WORKSPACE: "/workspace/:workspaceId",
  TASKS: "/workspace/:workspaceId/tasks",
  MEMBERS: "/workspace/:workspaceId/members",
  SETTINGS: "/workspace/:workspaceId/settings",
  PROJECT_DETAILS: "/workspace/:workspaceId/project/:projectId",
  SALES: "/workspace/:workspaceId/sales",
  CUSTOMERS: "/workspace/:workspaceId/customers",
  SALES_PROPOSALS: "/workspace/:workspaceId/sales/proposals",
  SALES_ESTIMATES: "/workspace/:workspaceId/sales/estimates",
  SALES_INVOICES: "/workspace/:workspaceId/sales/invoices",
  SALES_PAYMENTS: "/workspace/:workspaceId/sales/payments",
  SALES_PAYMENT_DETAILS: "/workspace/:workspaceId/sales/payments/:invoiceId",
  CONTRACTS: "/workspace/:workspaceId/contracts",
};

export const BASE_ROUTE = {
  INVITE_URL: "/invite/workspace/:inviteCode/join",
};
