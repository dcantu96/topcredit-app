import { useRecoilValue } from "recoil"
import { useParams } from "react-router-dom"

import Button from "components/atoms/button"
import ButtonLink from "components/atoms/button-link"
import Chip from "components/atoms/chip"
import Label from "components/atoms/label"
import FormHeader from "components/atoms/layout/form-header"
import FormContainer from "components/atoms/layout/form-container"
import { staffSelector } from "./atoms"

const EditCompany = () => {
  const { id } = useParams()
  if (!id) throw new Error("Missing id param")
  const staff = useRecoilValue(staffSelector(id))

  return (
    <FormContainer>
      <FormHeader>
        <FormHeader.Title text="Editar Cliente" />
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
      <form className="w-full grid grid-cols-2 gap-x-4 gap-y-0">
        <div>
          <Label>Nombre</Label>
          <p>
            {staff.first_name} {staff.last_name}
          </p>
        </div>
        <div>
          <Label>Correo</Label>
          <p>{staff.email}</p>
        </div>
        <div className="flex gap-4 items-center col-span-2">
          <Label>Asignar roles</Label>
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>Roles asignados</Label>
          <div className="flex gap-2 mt-2 flex-wrap mb-8">
            {staff.roles?.map((role) => <Chip key={role}>{role}</Chip>)}
          </div>
        </div>
        <div className="col-span-2 mt-2">
          <Button type="submit" fullWidth>
            Actualizar
          </Button>
        </div>
      </form>
    </FormContainer>
  )
}

export default EditCompany
