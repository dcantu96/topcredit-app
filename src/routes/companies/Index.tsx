import Button from "components/atoms/button";
import Table from "components/organisms/table";
import { authActions } from "components/providers/auth/atoms";
import { useAuth } from "components/providers/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { companies } from "./loader";
import ButtonLink from "components/atoms/button-link";

const CompaniesIndex = () => {
  const to = useNavigate();
  const { email } = useAuth();
  const { logout } = useRecoilValue(authActions);
  const companyData = useRecoilValue(companies);

  const handleLogout = () => {
    logout();
    to("/");
  };

  return (
    <div>
      <div>email: {email}</div>
      <Button onClick={handleLogout}>Logout</Button>

      <Table>
        <Table.Header
          columns={["Nombre", "Dominio", "Taza", "Plazos", "Admin", "Acciones"]}
        />
        <tbody className="bg-white">
          {companyData.map((company) => (
            <tr key={company.id}>
              <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                {company.name}
              </td>
              <td className="border-b border-slate-100 p-4 text-slate-500">
                @{company.domain}
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                {company.rate ? `${company.rate * 100}%` : "N/A"}
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                {company.terms}
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                X
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500 flex gap-2">
                <ButtonLink
                  size="sm"
                  status="secondary"
                  to={`${company.id.toString()}/edit`}
                >
                  <svg
                    className="h-4 w-3 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                  </svg>
                </ButtonLink>
                <ButtonLink size="sm" to={company.id.toString()}>
                  Ver
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CompaniesIndex;
