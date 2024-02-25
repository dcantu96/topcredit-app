import { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"

import Button from "components/atoms/button"
import Select from "components/atoms/select"
import { useFormErrors } from "hooks/useFormErrors"

import { DURATION_TYPES } from "../../constants"
import { termsSelectorQuery } from "./atoms"
import { useTermActions } from "./actions"
import { companyState } from "./loader"

interface AssignTermFormProps {
  companyId: string
}

const AssignTermForm = ({ companyId }: AssignTermFormProps) => {
  const [termId, setTermId] = useState<string>("")
  const { errors, handleErrors, clearErrors } = useFormErrors()
  const termsMap = useRecoilValue(termsSelectorQuery)
  const { assignTermToCompany } = useTermActions()
  const [companyData, setCompanyData] = useRecoilState(companyState(companyId))
  const termOptions = Array.from(termsMap.values())
    .filter(({ id }) => !companyData.terms.some((term) => term.id === id))
    .map(({ duration, durationType, id }) => ({
      label: `${duration} ${DURATION_TYPES.get(durationType)}`,
      value: id.toString(),
    }))

  const handleAssignTerm = async () => {
    if (termId) {
      try {
        clearErrors()
        const termToAssign = termsMap.get(termId)
        if (!termToAssign) throw new Error("Term not found")
        await assignTermToCompany({
          companyId,
          termId,
        })
        setTermId("")
        setCompanyData((prev) => ({
          ...prev,
          terms: [...prev.terms, termToAssign],
        }))
      } catch (error) {
        handleErrors(error, ["termId"])
      }
    }
  }

  return (
    <>
      <Select
        id="termId"
        label="Asignar un plazo"
        error={errors.termId}
        options={termOptions}
        value={termId}
        onChange={({ target }) => setTermId(target.value)}
      />

      <Button type="button" onClick={handleAssignTerm}>
        Asignar
      </Button>
    </>
  )
}

export default AssignTermForm
