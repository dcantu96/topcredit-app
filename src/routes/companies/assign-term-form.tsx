import { useState } from "react"
import { useRecoilValue } from "recoil"

import Button from "components/atoms/button"
import Select from "components/atoms/select"
import { useFormErrors } from "hooks/useFormErrors"

import { DURATION_TYPES } from "../../constants"
import { termsState } from "./atoms"
import { useTermActions } from "./actions"
import { companyState } from "./loader"

interface AssignTermFormProps {
  companyId: string
}

const AssignTermForm = ({ companyId }: AssignTermFormProps) => {
  const [termId, setTermId] = useState<string>("")
  const { errors, handleErrors, clearErrors } = useFormErrors()
  const termsMap = useRecoilValue(termsState)
  const { assignTermToCompany } = useTermActions()
  const companyData = useRecoilValue(companyState(companyId))
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
        await assignTermToCompany({
          companyId,
          termId,
        })
        setTermId("")
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

      <Button type="button" disabled={!termId} onClick={handleAssignTerm}>
        Asignar
      </Button>
    </>
  )
}

export default AssignTermForm
