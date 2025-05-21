import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignIn from "@/page/auth/Sign-in";
import SignUp from "@/page/auth/Sign-up";
import WorkspaceDashboard from "@/page/workspace/Dashboard";
import Members from "@/page/workspace/Members";
import ProjectDetails from "@/page/workspace/ProjectDetails";
import Settings from "@/page/workspace/Settings";
import Tasks from "@/page/workspace/Tasks";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";
import InviteUser from "@/page/invite/InviteUser";
import Customers from "@/page/workspace/Customers";
import Proposals from "@/page/workspace/sales/Proposals";
import Estimates from "@/page/workspace/sales/Estimates";
import Invoices from "@/page/workspace/sales/Invoices";
import Payments from "@/page/workspace/sales/Payments";
import PaymentDetails from "@/page/workspace/sales/PaymentDetails";
import { Contracts } from "@/page/workspace/contracts";
import Reports from "@/page/workspace/Reports";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
  { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetails /> },
  { path: PROTECTED_ROUTES.CUSTOMERS, element: <Customers /> },
  { path: PROTECTED_ROUTES.SALES_PROPOSALS, element: <Proposals /> },
  { path: PROTECTED_ROUTES.SALES_ESTIMATES, element: <Estimates /> },
  { path: PROTECTED_ROUTES.SALES_INVOICES, element: <Invoices /> },
  { path: PROTECTED_ROUTES.SALES_PAYMENTS, element: <Payments /> },
  { path: PROTECTED_ROUTES.SALES_PAYMENT_DETAILS, element: <PaymentDetails /> },
  { path: PROTECTED_ROUTES.CONTRACTS, element: <Contracts /> },
  { path: "/workspace/:workspaceId/reports", element: <Reports /> },
];

export const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
];
