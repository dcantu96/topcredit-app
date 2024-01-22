import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

/* Layouts */
import LoginLayout from "components/organisms/login-layout";
import DashboardLayout from "components/organisms/dashboard-layout";

/* Routes */
import Home from "../routes/home";
import Login from "../routes/login";
import Register from "../routes/register";
import CompaniesList from "../routes/companies/list";
import NewCompany from "../routes/companies/new";
import EditCompany from "../routes/companies/edit";
import ShowCompany from "../routes/companies/show";
import ProtectedRoute from "components/providers/auth/ProtectedRoute";

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
          <Route path="companies">
            <Route index element={<CompaniesList />} />
            <Route path="new" element={<NewCompany />} />
            <Route path=":id">
              <Route index element={<ShowCompany />} />
              <Route path="edit" element={<EditCompany />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
