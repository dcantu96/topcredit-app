import { Suspense, lazy } from "react"
import { Route, Routes } from "react-router-dom"

/* Layouts */
import LoginLayout from "components/organisms/login-layout"
import DashboardLayout from "components/organisms/dashboard-layout"

/* Utility */
import ProtectedRoute from "components/providers/auth/ProtectedRoute"
import Toaster from "components/providers/toaster/toaster"

/* Routes */
const Dashboard = lazy(() => import("../routes/dashboards"))
const Login = lazy(() => import("../routes/login"))
const Register = lazy(() => import("../routes/register"))
const RegisterSuccess = lazy(() => import("../routes/register/success"))
const CompaniesList = lazy(() => import("../routes/companies/list"))
const StaffList = lazy(() => import("../routes/staff/list"))
const EditStaff = lazy(() => import("../routes/staff/edit"))
const NewCompany = lazy(() => import("../routes/companies/new"))
const EditCompany = lazy(() => import("../routes/companies/edit"))
const ShowCompany = lazy(() => import("../routes/companies/show"))
const RequestsList = lazy(() => import("../routes/requests/list/list"))
const ShowRequest = lazy(() => import("../routes/requests/show"))
const CreditScreen = lazy(() => import("../routes/new-credit"))
const PreAuthorizationsList = lazy(
  () => import("../routes/pre-authorizations/list"),
)
const PendingAuthorizations = lazy(
  () => import("../routes/pending-authorizations/list"),
)
const ShowPendingAuthorization = lazy(
  () => import("../routes/pending-authorizations/show"),
)
const Dispersions = lazy(() => import("../routes/dispersions/list"))
const ShowDispersions = lazy(() => import("../routes/dispersions/show"))
const Landing = lazy(() => import("../routes/landing"))
const LatestCreditMonitor = lazy(() => import("./latest-credit-monitor"))
const MyCredits = lazy(() => import("../routes/my-credits/my-credits"))
const CompanyInstallations = lazy(
  () => import("../routes/company-installations/list"),
)
const CompanyInstallation = lazy(
  () => import("../routes/company-installations/show"),
)
const CompanyPayments = lazy(() => import("../routes/company-payments/list"))
const CompanyPayment = lazy(() => import("../routes/company-payments/show"))
const Credit = lazy(() => import("../routes/credits/show"))
const CompanyCompletedCreditsList = lazy(
  () => import("../routes/company-completed-credits/list"),
)
const CompanyCompletedCredits = lazy(
  () => import("../routes/company-completed-credits/show"),
)
const ConfirmationSuccess = lazy(() => import("../routes/confirmation-success"))
const ConfirmationFailure = lazy(() => import("../routes/confirmation-failure"))
const SendConfirmation = lazy(() => import("../routes/send-confirmation"))
const HR = lazy(() => import("../routes/hr/general"))
const ShowHR = lazy(() => import("../routes/hr/show"))

function App() {
  return (
    <Suspense fallback={null}>
      <Toaster />
      <Routes>
        <Route index element={<Landing />} />
        <Route path="confirmation-success" element={<ConfirmationSuccess />} />
        <Route path="confirmation-failure" element={<ConfirmationFailure />} />
        <Route path="send-confirmation" element={<SendConfirmation />} />
        <Route element={<LoginLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register/success" element={<RegisterSuccess />} />
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
            path="completed-credits"
            element={<ProtectedRoute allowedRoles={["installations"]} />}
          >
            <Route index element={<CompanyCompletedCreditsList />} />
            <Route path=":companyId" element={<CompanyCompletedCredits />} />
          </Route>
          <Route
            path="payments"
            element={<ProtectedRoute allowedRoles={["payments"]} />}
          >
            <Route index element={<CompanyPayments />} />
            <Route path=":companyId" element={<CompanyPayment />} />
          </Route>
          <Route
            path="credits"
            element={<ProtectedRoute allowedRoles={["payments"]} />}
          >
            <Route path=":id" element={<Credit />} />
          </Route>
          <Route
            path="staff"
            element={<ProtectedRoute allowedRoles={["admin"]} />}
          >
            <Route index element={<StaffList />} />
            <Route path=":id/edit" element={<EditStaff />} />
          </Route>
          <Route path="hr" element={<ProtectedRoute allowedRoles={["hr"]} />}>
            <Route index element={<HR />} />
            <Route path=":id" element={<ShowHR />} />
            <Route path="history" element={<>History</>} />
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
