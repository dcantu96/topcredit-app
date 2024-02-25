import { useState } from "react"
import Input from "components/atoms/input"
import Button from "components/atoms/button"
import { useRecoilRefresher_UNSTABLE } from "recoil"
import { useNavigate } from "react-router-dom"
import { companiesSelectorQuery } from "./loader"
import { useCompanyActions } from "./actions"

const NewCompany = () => {
  const [name, setName] = useState<string>("")
  const [domain, setDomain] = useState<string>("")
  const [rate, setRate] = useState<number>(0)
  const [terms, setTerms] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { createCompany } = useCompanyActions()
  const refresh = useRecoilRefresher_UNSTABLE(companiesSelectorQuery)
  const to = useNavigate()

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await createCompany({ name, domain, rate: rate / 100, terms })
      setIsLoading(false)
      refresh()
      to("/companies")
    } catch (error) {
      console.log("error", error)
      setIsLoading(false)
    }
  }

  return (
    <form
      className="w-full container mx-auto grid grid-cols-2 gap-x-4 gap-y-6"
      onSubmit={handleCreate}
    >
      <div>
        <Input
          id="name"
          label="Nombre"
          required
          value={name}
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
          placeholder="miempresa.com"
          onChange={({ target }) => setDomain(target.value)}
        />
      </div>
      <div>
        <Input
          id="rate"
          label="Taza"
          type="number"
          required
          value={rate.toString()}
          placeholder="10"
          prefix="%"
          onChange={({ target }) => setRate(Number(target.value))}
        />
      </div>
      <div>
        <Input
          id="terms"
          label="Plazos"
          required
          value={terms}
          placeholder="2 años, 1 mes"
          onChange={({ target }) => setTerms(target.value)}
        />
      </div>
      <div className="col-span-2">
        <Button type="submit" fullWidth disabled={isLoading}>
          Crear
        </Button>
      </div>
    </form>
  )
}

export default NewCompany
