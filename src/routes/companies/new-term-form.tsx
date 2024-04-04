import { useState } from "react"

import { useFormErrors } from "hooks/useFormErrors"
import Button from "components/atoms/button"
import Input from "components/atoms/input"

import { useTermActions } from "./actions"
import { DURATION_TYPES } from "../../constants"
import { DurationType } from "src/schema.types"

interface NewTermFormProps {
  companyId: string
}

export const NewTermForm = ({ companyId }: NewTermFormProps) => {
  const { errors, handleErrors, clearErrors } = useFormErrors()
  const { assignTermToCompany, createTerm } = useTermActions()
  const [duration, setDuration] = useState<number>(0)
  const [durationType, setDurationType] = useState<DurationType | undefined>(
    undefined,
  )

  const handleSubmit = async () => {
    if (duration && durationType) {
      try {
        clearErrors()
        const respTerm = await createTerm({
          duration,
          durationType,
        })
        await assignTermToCompany({
          companyId,
          termId: respTerm.id,
        })
        setDuration(0)
        setDurationType(undefined)
      } catch (error) {
        handleErrors(error, new Set(["duration", "durationType"]))
      }
    }
  }

  return (
    <>
      <Input
        id="term-duration"
        label="Crear un nuevo plazo"
        type="number"
        error={errors.durationType || errors.duration}
        value={duration.toString()}
        placeholder="10"
        onChange={({ target }) => setDuration(Number(target.value))}
        trailingDropdownId="term-duration-type"
        trailingDropdownLabel="Duración"
        trailingDropdownOnChange={({ target }) =>
          setDurationType(target.value as DurationType)
        }
        trailingDropdownOptions={Array.from(DURATION_TYPES.entries()).map(
          ([key, value]) => ({
            value: key,
            label: value,
          }),
        )}
      />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!duration || !durationType}
      >
        Agregar
      </Button>
    </>
  )
}
