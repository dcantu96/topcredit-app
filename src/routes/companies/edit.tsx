import { useState } from "react"
import { useRecoilRefresher_UNSTABLE, useRecoilState } from "recoil"
import Input from "components/atoms/input"
import Button from "components/atoms/button"
import { useNavigate, useParams } from "react-router-dom"
import { companySelectorQuery, companyState } from "./loader"
import ButtonLink from "components/atoms/button-link"
import { useFormErrors } from "hooks/useFormErrors"
import { useCompanyActions, useTermActions } from "./actions"
import Chip from "components/atoms/chip"
import { DURATION_TYPES } from "../../constants"
import Label from "components/atoms/label"

const EditCompany = () => {
  const { id } = useParams()
  if (!id) throw new Error("Missing id param")
  const [companyData, setCompanyData] = useRecoilState(companyState(id))
  const [name, setName] = useState<string>(companyData.name)
  const [domain, setDomain] = useState<string>(companyData.domain || "")
  const [rate, setRate] = useState<number>(
    companyData?.rate ? companyData.rate * 100 : 0,
  )
  const { errors, handleErrors, clearErrors } = useFormErrors()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { updateCompany } = useCompanyActions()
  const { assignTermToCompany } = useTermActions()
  const refresh = useRecoilRefresher_UNSTABLE(companySelectorQuery(id))
  const [termDuration, setTermDuration] = useState<number>(0)
  const [termDurationType, setTermDurationType] = useState<string | undefined>(
    undefined,
  )
  const to = useNavigate()

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      clearErrors()
      setIsLoading(true)
      await updateCompany({ id: Number(id), name, domain, rate: rate / 100 })
      setIsLoading(false)
      to("/companies")
      refresh()
    } catch (error) {
      handleErrors(error, ["name", "domain", "rate", "terms"])
      setIsLoading(false)
    }
  }

  const handleTermSubmit = async () => {
    if (termDuration && termDurationType) {
      const data = await assignTermToCompany({
        companyId: Number(id),
        duration: termDuration,
        durationType: termDurationType,
      })
      console.log(data)
      setCompanyData((prev) => ({
        ...prev,
        terms: [
          ...prev.terms,
          {
            id: data.id,
            duration: data.duration,
            durationType: data.durationType,
            updatedAt: "",
            createdAt: "",
          },
        ],
      }))

      setTermDuration(0)
      setTermDurationType(undefined)
    }
  }

  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="lg:flex lg:items-center lg:justify-between mb-4 w-full">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Editar Cliente
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="flex gap-2">
            <ButtonLink to=".." status="secondary">
              Ver
            </ButtonLink>
            <ButtonLink to="../.." status="secondary">
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
          </span>
        </div>
      </div>
      <form
        className="w-full grid grid-cols-2 gap-x-4 gap-y-6"
        onSubmit={handleUpdate}
      >
        <div>
          <Input
            id="name"
            label="Nombre"
            required
            value={name}
            error={errors.name}
            placeholder="Mi empresa"
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          <Input
            id="domain"
            label="Dominio"
            required
            value={domain}
            error={errors.domain}
            placeholder="miempresa.com"
            onChange={({ target }) => setDomain(target.value)}
          />
        </div>
        <div className="col-span-2">
          <Input
            id="rate"
            label="Taza"
            type="number"
            required
            error={errors.rate}
            value={rate.toString()}
            placeholder="10"
            prefix="%"
            onChange={({ target }) => setRate(Number(target.value))}
          />
        </div>
        <div>
          <Label>Plazos</Label>
          <div className="flex gap-2 mt-2">
            {companyData.terms.map((term) => (
              <Chip key={term.id}>
                {term.duration} {DURATION_TYPES.get(term.durationType)}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex gap-4 items-end">
          <Input
            id="term-duration"
            label="Agrega un plazo"
            type="number"
            error={errors.duration}
            value={termDuration.toString()}
            placeholder="10"
            onChange={({ target }) => setTermDuration(Number(target.value))}
            trailingDropdownId="term-duration-type"
            trailingDropdownLabel="Duración"
            trailingDropdownOptions={Array.from(DURATION_TYPES.entries()).map(
              ([key, value]) => ({
                label: value,
                value: key,
              }),
            )}
            trailingDropdownOnChange={({ target }) =>
              setTermDurationType(target.value)
            }
          />
          <Button
            type="button"
            onClick={handleTermSubmit}
            disabled={!termDuration || !termDurationType}
          >
            Agregar
          </Button>
        </div>
        <div className="col-span-2">
          <Button type="submit" fullWidth disabled={isLoading}>
            Actualizar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditCompany
