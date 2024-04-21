import { Suspense } from "react"
import { Route, Routes } from "react-router-dom"

/* Layouts */
import LoginLayout from "components/organisms/login-layout"
import DashboardLayout from "components/organisms/dashboard-layout"

/* Utility */
import ProtectedRoute from "components/providers/auth/ProtectedRoute"

/* Routes */
import Dashboard from "../routes/dashboards"
import Login from "../routes/login"
import Register from "../routes/register"
import CompaniesList from "../routes/companies/list"
import NewCompany from "../routes/companies/new"
import EditCompany from "../routes/companies/edit"
import ShowCompany from "../routes/companies/show"
import RequestsList from "../routes/requests/list"
import ShowRequest from "../routes/requests/show"
import Toaster from "components/providers/toaster/toaster"
import CreditScreen from "../routes/new-credit"
import PreAuthorizationsList from "../routes/pre-authorizations/list"
import PendingAuthorizations from "../routes/pending-authorizations/list"
import ShowPendingAuthorization from "../routes/pending-authorizations/show"
import Dispersions from "../routes/dispersions/list"
import ShowDispersions from "../routes/dispersions/show"
import Landing from "../routes/landing"
import LatestCreditMonitor from "./latest-credit-monitor"
import MyCredits from "../routes/my-credits/my-credits"
import CompanyInstallations from "../routes/company-installations/list"
import CompanyInstallation from "../routes/company-installations/show"
import CompanyPayments from "../routes/company-payments/list"
import CompanyPayment from "../routes/company-payments/show"

function App() {
  return (
    <Suspense fallback={<>loading</>}>
      <Toaster />
      <Routes>
        <Route index element={<Landing />} />
        <Route element={<LoginLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<LatestCreditMonitor />}>
          <Route path="new-credit" element={<CreditScreen />} />
        </Route>
        <Route path="my-credits" element={<MyCredits />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="companies"
            element={<ProtectedRoute allowedRoles={["companies"]} />}
          >
            <Route index element={<CompaniesList />} />
            <Route path="new" element={<NewCompany />} />
            <Route path=":id">
              <Route index element={<ShowCompany />} />
              <Route path="edit" element={<EditCompany />} />
            </Route>
          </Route>
          <Route
            path="requests"
            element={<ProtectedRoute allowedRoles={["requests"]} />}
          >
            <Route index element={<RequestsList />} />
            <Route path=":id">
              <Route index element={<ShowRequest />} />
            </Route>
          </Route>
          <Route
            path="pre-authorizations"
            element={<ProtectedRoute allowedRoles={["pre_authorizations"]} />}
          >
            <Route index element={<PreAuthorizationsList />} />
          </Route>
          <Route
            path="pending-authorizations"
            element={<ProtectedRoute allowedRoles={["authorizations"]} />}
          >
            <Route index element={<PendingAuthorizations />} />
            <Route path=":id" element={<ShowPendingAuthorization />} />
          </Route>
          <Route
            path="dispersions"
            element={<ProtectedRoute allowedRoles={["dispersions"]} />}
          >
            <Route index element={<Dispersions />} />
            <Route path=":id" element={<ShowDispersions />} />
          </Route>
          <Route
            path="installations"
            element={<ProtectedRoute allowedRoles={["installations"]} />}
          >
            <Route index element={<CompanyInstallations />} />
            <Route path=":companyId" element={<CompanyInstallation />} />
          </Route>
          <Route
            path="payments"
            element={<ProtectedRoute allowedRoles={["payments"]} />}
          >
            <Route index element={<CompanyPayments />} />
            <Route path=":companyId" element={<CompanyPayment />} />
          </Route>
        </Route>
        <Route
          path="not-allowed"
          element={
            <ProtectedRoute>
              <div>Not Allowed</div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Suspense>
  )
}

export default App
