import { useCallback, useState } from "react"
import { useRecoilCallback, useRecoilValue } from "recoil"
import ImportDocumentButton from "components/molecules/import-document-button"
import Modal from "components/molecules/modal"
import { CSVRow, readFile } from "components/atoms/utils"
import Button from "components/atoms/button"
import { apiSelector } from "components/providers/api/atoms"
import useToast from "components/providers/toaster/useToast"
import { XMarkIcon } from "@heroicons/react/24/solid"
import Tooltip from "components/atoms/tooltip"
import { dispersedCreditsImportSelector } from "./atoms"
import { companiesSelectorQuery } from "hooks/useCompanies/atoms"
import List from "../list"

const ImportDocumentModal = () => {
  const toast = useToast()
  const dispersedCredits = useRecoilValue(dispersedCreditsImportSelector)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [headers, setHeaders] = useState<string[]>([])
  const [csvRows, setCSVRows] = useState<CSVRow[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Map<string, string[]>>(
    new Map<string, string[]>(),
  )
  const rowKey = headers.at(1)

  const validRows = csvRows.filter(
    (row) =>
      dispersedCredits.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (credit: any) =>
          credit.borrower.data.employeeNumber === row["Empleado"],
      ) !== undefined,
  )

  const invalidRowsCount = csvRows.length - validRows.length

  const nextPaymentNumber = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (credit: any) => {
      const sortedPayments = credit.payments.data.toSorted(
        (a: { number: number }, b: { number: number }) => a.number - b.number,
      )
      return ((sortedPayments.at(-1)?.number as number) ?? 0) + 1
    },
    [],
  )

  const handleSave = useRecoilCallback(({ snapshot }) => async () => {
    const api = await snapshot.getPromise(apiSelector)
    const companies = await snapshot.getPromise(companiesSelectorQuery)
    const companyList = Array.from(companies.values())
    setIsSaving(true)
    try {
      if (!dispersedCredits || !dispersedCredits.length) {
        toast.error({
          title: "Error",
          message: "No se encontraron usuarios",
        })
        setIsSaving(false)
        setIsModalOpen(false)
        return
      }

      for (const row of validRows) {
        try {
          const company = companyList.find(
            (company) => company.name === row["Cliente"],
          )
          if (!company) {
            throw Error(`No se encontró la empresa ${headers[0]}`)
          }
          const credit = dispersedCredits.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (credit: any) =>
              credit.borrower.data.employeeNumber === row["Empleado"],
          )
          if (!credit) {
            throw Error(
              `No se encontró el crédito para el empleado ${row["Empleado"]}`,
            )
          }
          await api.create("payments", {
            amount: row["Descuento"],
            number: nextPaymentNumber(credit),
            paidAt: new Date().toISOString(),
            credit: {
              data: {
                id: credit.id,
                type: "credits",
              },
            },
          })
        } catch {}
      }
      setIsSaving(false)
    } catch (error) {
      setIsSaving(false)
      console.error(error)
    }
  })

  const onLoad = (loadedRows: CSVRow[], loadedHeaders: string[]) => {
    const newMap = errors
    for (const row of loadedRows) {
      const employeeNumber = row["Empleado"]
      const credit = dispersedCredits.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (credit: any) => credit.borrower.data.employeeNumber === employeeNumber,
      )
      if (!credit) {
        if (newMap.has(employeeNumber)) {
          newMap.set(employeeNumber, [
            ...newMap.get(employeeNumber)!,
            `No existe # Empleado: ${employeeNumber} en la base de datos`,
          ])
        } else {
          newMap.set(employeeNumber, [
            `No existe # Empleado: ${employeeNumber} en la base de datos`,
          ])
        }
      }
      if (!row["Descuento"]) {
        if (newMap.has(employeeNumber)) {
          newMap.set(employeeNumber, [
            ...newMap.get(employeeNumber)!,
            `No se encontró la columna Descuento`,
          ])
        } else {
          newMap.set(employeeNumber, [`No se encontró la columna Descuento`])
        }
      }
      if (!row["Mes"]) {
        if (newMap.has(employeeNumber)) {
          newMap.set(employeeNumber, [
            ...newMap.get(employeeNumber)!,
            `No se encontró la columna mes`,
          ])
        } else {
          newMap.set(employeeNumber, [`No se encontró la columna mes`])
        }
      }
    }
    setErrors(newMap)
    setIsModalOpen(true)
    setHeaders(loadedHeaders)
    setCSVRows(loadedRows)
    console.log(loadedRows)
  }

  return (
    <>
      <ImportDocumentButton
        id="import-payments"
        onImport={async (file) => {
          readFile(file, { onLoad })
        }}
      />
      {isModalOpen && (
        <Modal>
          <Modal.Header
            onClose={() => setIsModalOpen(false)}
            title={`Importar (${validRows.length}) pagos. ${invalidRowsCount > 0 ? `(${invalidRowsCount} Inválidos)` : ""}`}
          >
            <Button
              size="sm"
              onClick={async () => {
                await handleSave()
                if (errors.size === 0) {
                  setIsModalOpen(false)
                }
              }}
              disabled={validRows.length === 0 || isSaving}
            >
              Guardar
            </Button>
          </Modal.Header>
          <Modal.Body>
            <List>
              <List.Header columns={headers.concat("Status")} />
              <List.Body>
                {rowKey &&
                  csvRows.map((row) => (
                    <List.Row
                      key={`${row["Empleado"]}-${row["Año"]}-${row["Mes"]}-${row["Quincena"]}`}
                    >
                      {headers.map((header) => (
                        <List.Cell key={header}>{row[header]}</List.Cell>
                      ))}
                      <MaybeErrorCell
                        employeeNumber={row["Empleado"]}
                        errorsMap={errors}
                      />
                    </List.Row>
                  ))}
              </List.Body>
            </List>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

const MaybeErrorCell = ({
  employeeNumber,
  errorsMap,
}: {
  employeeNumber: string
  errorsMap: Map<string, string[]>
}) => {
  const errors = errorsMap.get(employeeNumber)
  return (
    <List.Cell>
      {errors ? (
        <Tooltip
          content={
            <ul>
              {errors.map((error, index) => (
                <li style={{ width: "100px" }} key={index}>
                  {error}
                </li>
              ))}
            </ul>
          }
        >
          <XMarkIcon className="w-5 h-5 text-red-500" />
        </Tooltip>
      ) : null}
    </List.Cell>
  )
}

export default ImportDocumentModal
