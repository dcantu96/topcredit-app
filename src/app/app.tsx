import { Suspense, lazy } from "react"
import { Route, Routes } from "react-router-dom"

/* Layouts */
import LoginLayout from "components/organisms/login-layout"
import DashboardLayout from "components/organisms/dashboard-layout"

/* Utility */
import ProtectedRoute from "components/providers/auth/ProtectedRoute"
import Toaster from "components/providers/toaster/toaster"
import NotFound from "components/molecules/not-found"

/* Routes */
const Dashboard = lazy(() => import("../routes/dashboards"))
const Login = lazy(() => import("../routes/login"))
const Register = lazy(() => import("../routes/register"))
const RegisterSuccess = lazy(() => import("../routes/register/success"))
const CompaniesList = lazy(() => import("../routes/companies/list"))
const StaffList = lazy(() => import("../routes/staff/list"))
const EditStaff = lazy(() => import("../routes/staff/edit"))
const NewStaff = lazy(() => import("../routes/staff/new"))
const NewCompany = lazy(() => import("../routes/companies/new"))
const EditCompany = lazy(() => import("../routes/companies/edit"))
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
const CompanyPayments = lazy(() => import("../routes/company-payments/list"))
const CompanyPayment = lazy(() => import("../routes/company-payments/show"))
const Credit = lazy(() => import("../routes/credits/show"))
const CreditPayments = lazy(() => import("../routes/credits/payments/show"))
const CompanyCompletedCreditsList = lazy(
  () => import("../routes/company-completed-credits/list"),
)
const CompanyCompletedCredits = lazy(
  () => import("../routes/company-completed-credits/show"),
)
const ConfirmationSuccess = lazy(() => import("../routes/confirmation-success"))
const GeneratePassword = lazy(() => import("../routes/generate-password"))
const ConfirmationFailure = lazy(() => import("../routes/confirmation-failure"))
const SendConfirmation = lazy(() => import("../routes/send-confirmation"))
const HR = lazy(() => import("../routes/hr/general"))
const HRPayments = lazy(() => import("../routes/hr/payments"))
const RequestsHR = lazy(() => import("../routes/hr/requests"))
const ShowHR = lazy(() => import("../routes/hr/show"))
const ShowUser = lazy(() => import("../routes/users/show"))
const ShowCompanyCredits = lazy(
  () => import("../routes/companies/credits/index"),
)
const CompanyOverview = lazy(() => import("../routes/companies/overview/index"))

function App() {
  return (
    <Suspense fallback={null}>
      <Toaster />
      <Routes>
        <Route index element={<Landing />} />
        <Route path="generate-password" element={<GeneratePassword />} />
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
          <Route path="companies">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["companies"]}>
                  <CompaniesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute allowedRoles={["companies"]}>
                  <NewCompany />
                </ProtectedRoute>
              }
            />
            <Route path=":id">
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["companies", "hr"]}>
                    <CompanyOverview />
                  </ProtectedRoute>
                }
              />
              <Route path="credits" element={<ShowCompanyCredits />} />
              <Route
                path="edit"
                element={
                  <ProtectedRoute allowedRoles={["companies"]}>
                    <EditCompany />
                  </ProtectedRoute>
                }
              />
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
            path="users"
            element={<ProtectedRoute allowedRoles={["requests", "hr"]} />}
          >
            <Route path=":id">
              <Route index element={<ShowUser />} />
              <Route
                path="edit"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <div>pending edit user</div>
                  </ProtectedRoute>
                }
              />
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
            path="completed-credits"
            element={<ProtectedRoute allowedRoles={["hr"]} />}
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
            element={<ProtectedRoute allowedRoles={["payments", "hr"]} />}
          >
            <Route path=":id">
              <Route index element={<Credit />} />
              <Route
                path="payments"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <CreditPayments />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route
            path="staff"
            element={<ProtectedRoute allowedRoles={["admin"]} />}
          >
            <Route index element={<StaffList />} />
            <Route path="new" element={<NewStaff />} />
            <Route path=":id/edit" element={<EditStaff />} />
          </Route>
          <Route
            path="hr/:id"
            element={<ProtectedRoute allowedRoles={["hr"]} />}
          >
            <Route index element={<HR />} />
            <Route path="payments" element={<HRPayments />} />
            <Route path="requests">
              <Route index element={<RequestsHR />} />
              <Route path=":creditId" element={<ShowHR />} />
            </Route>
            <Route path=":creditId" element={<ShowHR />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
