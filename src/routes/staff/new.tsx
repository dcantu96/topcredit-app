import { useRecoilState, useRecoilValue } from "recoil"

import Button from "components/atoms/button"
import ButtonLink from "components/atoms/button-link"
import FormHeader from "components/atoms/layout/form-header"
import FormContainer from "components/atoms/layout/form-container"
import { isValidStaff, newStaffState, useStaffActions } from "./atoms"
import Input from "components/atoms/input"
import Select from "components/atoms/select"
import { ROLE_OPTIONS } from "../../constants"
import { companiesSelectorQuery } from "../companies/loader"

const Screen = () => {
  const { create } = useStaffActions()
  const companies = useRecoilValue(companiesSelectorQuery)
  const [staff, editStaff] = useRecoilState(newStaffState)
  const handleStaffUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isValidStaff(staff)) {
      await create(staff)
    }
  }

  const companyOptions = companies.map((company) => ({
    label: company.name,
    value: company.id,
  }))

  return (
    <FormContainer>
      <FormHeader>
        <FormHeader.Title text="Editar Staff" />
        <FormHeader.Actions>
          <ButtonLink to=".." status="secondary">
            Ver
          </ButtonLink>
          <ButtonLink to=".." status="secondary">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-gray-400 mr-1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M3 9L21 9M12 9V20M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            Lista
          </ButtonLink>
        </FormHeader.Actions>
      </FormHeader>
      <form
        className="w-full grid grid-cols-2 gap-x-4 gap-y-0"
        onSubmit={handleStaffUpdate}
      >
        <Input
          label="Nombre"
          required
          value={staff.first_name || ""}
          id="first_name"
          onChange={(e) =>
            editStaff((prev) => ({ ...prev, first_name: e.target.value }))
          }
        />
        <Input
          label="Apellido"
          required
          value={staff.last_name || ""}
          id="last_name"
          onChange={(e) =>
            editStaff((prev) => ({ ...prev, last_name: e.target.value }))
          }
        />
        <Input
          label="Correo"
          required
          type="email"
          value={staff.email || ""}
          id="email"
          onChange={(e) =>
            editStaff((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <Input
          label="Teléfono"
          required
          type="phone"
          value={staff.phone || ""}
          id="phone"
          onChange={(e) =>
            editStaff((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
        <Select
          id="role"
          label="Rol del Usuario"
          value={staff.roles?.at(0)}
          options={ROLE_OPTIONS}
          onChange={(newRole) =>
            editStaff((prev) =>
              newRole ? { ...prev, roles: [newRole] } : prev,
            )
          }
        />
        {staff.roles?.at(0) === "admin" || staff.roles?.at(0) === "hr" ? (
          <Select
            id="company"
            label="Cliente"
            value={staff.hr_company_id}
            options={companyOptions}
            onChange={(newCompanyId) =>
              editStaff((prev) =>
                newCompanyId ? { ...prev, hr_company_id: newCompanyId } : prev,
              )
            }
          />
        ) : null}
        <div className="col-span-2 mt-2">
          <Button type="submit" fullWidth disabled={!isValidStaff(staff)}>
            Crear
          </Button>
        </div>
      </form>
    </FormContainer>
  )
}

export default Screen
