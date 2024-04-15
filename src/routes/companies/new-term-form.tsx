import { useState } from "react"

import { useFormErrors } from "hooks/useFormErrors"
import Button from "components/atoms/button"
import Input from "components/atoms/input"

import { useTermActions } from "./actions"
import { DURATION_TYPES } from "../../constants"
import { useRecoilValue } from "recoil"
import { companyState } from "./loader"
import Tooltip from "components/atoms/tooltip"

interface NewTermFormProps {
  companyId: string
}

export const NewTermForm = ({ companyId }: NewTermFormProps) => {
  const companyData = useRecoilValue(companyState(companyId))
  const companyDurationType =
    companyData.employeeSalaryFrequency === "biweekly" ? "two-weeks" : "months"
  const invalidTerms = companyData.termOfferings?.filter(
    (termOffering) => termOffering.term.durationType !== companyDurationType,
  )
  const { errors, handleErrors, clearErrors } = useFormErrors()
  const { assignTermToCompany, createTerm } = useTermActions()
  const [duration, setDuration] = useState<number>(0)

  const handleSubmit = async () => {
    if (duration && companyDurationType) {
      try {
        clearErrors()
        const respTerm = await createTerm({
          duration,
          durationType: companyDurationType,
        })
        await assignTermToCompany({
          companyId,
          termId: respTerm.id,
        })
        setDuration(0)
      } catch (error) {
        handleErrors(error, new Set(["duration", "durationType"]))
      }
    }
  }

  return (
    <>
      <Tooltip
        cond={!!invalidTerms?.length}
        content="No es posible crear plazos nuevos en este momento dado que existen plazos inválidos activos."
      >
        <Input
          id="term-duration"
          label="Crear un nuevo plazo"
          type="number"
          error={errors.durationType || errors.duration}
          disabled={!!invalidTerms?.length}
          value={duration.toString()}
          placeholder="10"
          onChange={({ target }) => setDuration(Number(target.value))}
          trailingDropdownId="term-duration-type"
          trailingDropdownLabel="Duración"
          trailingDropdownOptions={Array.from(DURATION_TYPES.entries())
            .filter(([key]) => key === companyDurationType)
            .map(([key, value]) => ({
              value: key,
              label: value,
            }))}
        />
      </Tooltip>
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!duration || !companyDurationType || !!invalidTerms?.length}
      >
        Agregar
      </Button>
    </>
  )
}
