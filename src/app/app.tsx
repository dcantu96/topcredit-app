import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

/* Layouts */
import LoginLayout from "components/organisms/login-layout";
import DashboardLayout from "components/organisms/dashboard-layout";

/* Utility */
import ProtectedRoute from "components/providers/auth/ProtectedRoute";

/* Routes */
import Home from "../routes/home";
import Login from "../routes/login";
import Register from "../routes/register";
import CompaniesList from "../routes/companies/list";
import NewCompany from "../routes/companies/new";
import EditCompany from "../routes/companies/edit";
import ShowCompany from "../routes/companies/show";
import RequestsList from "../routes/requests/list";
import ShowRequest from "../routes/requests/show";

function App() {
  return (
    <Suspense fallback={<>loading</>}>
      <Routes>
        <Route index element={<Home />} />
        <Route element={<LoginLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
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
  );
}

export default App;
