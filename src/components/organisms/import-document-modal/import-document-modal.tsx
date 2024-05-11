import { useState } from "react"
import { useRecoilCallback, useRecoilValue } from "recoil"
import ImportDocumentButton from "components/molecules/import-document-button"
import Modal from "components/molecules/modal"
import { CSVRow, readFile } from "components/atoms/utils"
import Table from "../table"
import Button from "components/atoms/button"
import { apiSelector } from "components/providers/api/atoms"
import useToast from "components/providers/toaster/useToast"
import { XMarkIcon } from "@heroicons/react/24/solid"
import Tooltip from "components/atoms/tooltip"
import { dispersedCreditsImportSelector } from "./atoms"

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
  errors.clear
  const rowKey = headers.at(1)

  const validRows = csvRows.filter(
    (row) =>
      dispersedCredits.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (credit: any) =>
          credit.borrower.data.employeeNumber === row["# Nómina"],
      ) !== undefined,
  )

  const invalidRowsCount = csvRows.length - validRows.length

  const handleSave = useRecoilCallback(({ snapshot }) => async () => {
    const api = await snapshot.getPromise(apiSelector)
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

      console.log("csvRows", csvRows)
      console.log("validRows", validRows)
      for (const row of validRows) {
        try {
          const credit = dispersedCredits.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (credit: any) =>
              credit.borrower.data.employeeNumber === row["# Nómina"],
          )
          if (!credit) {
            throw Error(
              `No se encontró el crédito para el empleado ${row["# Nómina"]}`,
            )
          }
          await api.create("payments", {
            amount: row["Descuento"],
            number: row["Plazo"],
            paidAt: new Date().toISOString(),
            credit: {
              data: {
                id: credit.id,
                type: "credits",
              },
            },
          })
        } catch (error) {}
      }
      setIsSaving(false)
    } catch (error) {
      setIsSaving(false)
      console.error(error)
    }
  })

  console.log("Errors", errors)

  return (
    <>
      <ImportDocumentButton
        id="import-payments"
        onImport={async (file) => {
          readFile(file, {
            onLoad(csvRows, headers) {
              const newMap = errors
              for (const row of csvRows) {
                const employeeNumber = row["# Nómina"]
                const credit = dispersedCredits.find(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (credit: any) =>
                    credit.borrower.data.employeeNumber === employeeNumber,
                )
                if (!credit) {
                  if (newMap.has(employeeNumber)) {
                    newMap.set(employeeNumber, [
                      ...newMap.get(employeeNumber)!,
                      `No existe # Nómina: ${employeeNumber} en la base de datos`,
                    ])
                  } else {
                    newMap.set(employeeNumber, [
                      `No existe # Nómina: ${employeeNumber} en la base de datos`,
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
                    newMap.set(employeeNumber, [
                      `No se encontró la columna Descuento`,
                    ])
                  }
                }
                if (!row["Plazo"]) {
                  if (newMap.has(employeeNumber)) {
                    newMap.set(employeeNumber, [
                      ...newMap.get(employeeNumber)!,
                      `No se encontró la columna Plazo`,
                    ])
                  } else {
                    newMap.set(employeeNumber, [
                      `No se encontró la columna Plazo`,
                    ])
                  }
                }
              }
              setErrors(newMap)
              setIsModalOpen(true)
              setHeaders(headers)
              setCSVRows(csvRows)
            },
          })
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
            <Table>
              <Table.Header columns={headers.concat("Status")} />
              <Table.Body>
                {rowKey &&
                  csvRows.map((row) => (
                    <Table.Row key={row[rowKey]}>
                      {headers.map((header) => (
                        <Table.Cell key={header}>{row[header]}</Table.Cell>
                      ))}
                      <MaybeErrorCell
                        employeeNumber={row["# Nómina"]}
                        errorsMap={errors}
                      />
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
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
    <Table.Cell>
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
    </Table.Cell>
  )
}

export default ImportDocumentModal
