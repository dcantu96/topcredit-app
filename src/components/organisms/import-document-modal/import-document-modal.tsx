import { useCallback, useState } from "react"
import {
  useRecoilCallback,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from "recoil"
import ImportDocumentButton from "components/molecules/import-document-button"
import Modal from "components/molecules/modal"
import { CSVRow, readFile } from "components/atoms/utils"
import Button from "components/atoms/button"
import { apiSelector } from "components/providers/api/atoms"
import useToast from "components/providers/toaster/useToast"
import { dispersedCreditsImportSelector } from "./atoms"
import List from "../list"
import { companySelectorQuery } from "../../../routes/companies/loader"
import { MXNFormat } from "../../../constants"
import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/es"
dayjs.extend(LocalizedFormat)

const ImportDocumentModal = ({ companyId }: { companyId: string }) => {
  const company = useRecoilValue(companySelectorQuery(companyId))
  const toast = useToast()
  const dispersedCredits = useRecoilValue(
    dispersedCreditsImportSelector(companyId),
  )
  const refresh = useRecoilRefresher_UNSTABLE(
    dispersedCreditsImportSelector(companyId),
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [headers, setHeaders] = useState<string[]>([])
  const [csvRows, setCSVRows] = useState<CSVRow[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({})
  const rowKey = headers.at(1)

  const invalidRowsCount = Object.keys(errors).length

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

      for (const row of csvRows) {
        const employeeNumber = row["Empleado"]
        const paymentNumber = Number(row["#"])

        const credit = dispersedCredits.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (credit: any) =>
            credit.borrower.data.employeeNumber === employeeNumber,
        )
        if (!credit) {
          throw Error(
            `No se encontró el crédito para el empleado ${employeeNumber}`,
          )
        }

        const payment = credit.payments.data.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (payment: any) => payment.number === paymentNumber,
        )
        if (!payment) {
          throw Error(
            `No se encontró el pago #${paymentNumber} para el crédito ${credit.id}`,
          )
        }

        await api.update("payments", {
          id: payment.id,
          amount: row["Descuento"],
          paidAt: new Date().toISOString(),
        })
      }
      setIsSaving(false)
    } catch (error) {
      setIsSaving(false)
      throw error
    }
  })

  const onLoad = (loadedRows: CSVRow[], loadedHeaders: string[]) => {
    const newErrorObject = errors
    for (const row of loadedRows) {
      const employeeNumber = row["Empleado"]
      const credit = dispersedCredits.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (credit: any) => credit.borrower.data.employeeNumber === employeeNumber,
      )

      const payments = credit?.payments.data
      if (!row["#"]) {
        newErrorObject[employeeNumber] = [
          ...(newErrorObject[employeeNumber] ?? []),
          `No se encontró la columna '#'`,
        ]
      }
      const paymentNumber = Number(row["#"])
      if (!payments || payments.length === 0) {
        newErrorObject[employeeNumber] = [
          ...(newErrorObject[employeeNumber] ?? []),
          `No se encontraron pagos para el empleado`,
        ]
      } else if (
        !payments.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (payment: any) => payment.number === paymentNumber,
        )
      ) {
        newErrorObject[employeeNumber] = [
          ...(newErrorObject[employeeNumber] ?? []),
          `No se encontró el pago #${paymentNumber} para el empleado`,
        ]
      } else if (
        !!payments.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (payment: any) => payment.number === paymentNumber,
        )?.paidAt
      ) {
        newErrorObject[employeeNumber] = [
          ...(newErrorObject[employeeNumber] ?? []),
          `El pago #${paymentNumber} ya fue realizado`,
        ]
      }
      if (!credit) {
        newErrorObject[employeeNumber] = [
          ...(newErrorObject[employeeNumber] ?? []),
          `No se encontró el crédito para el empleado`,
        ]
      }
      if (!row["Descuento"]) {
        newErrorObject[employeeNumber] = [
          ...(newErrorObject[employeeNumber] ?? []),
          `No se encontró la columna Descuento`,
        ]
      }
    }

    setErrors(newErrorObject)
    setIsModalOpen(true)
    setHeaders(loadedHeaders)
    setCSVRows(loadedRows)
  }

  const employeeName = useCallback(
    (employeeNumber: string) => {
      const credit = dispersedCredits.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (credit: any) => credit.borrower.data.employeeNumber === employeeNumber,
      )
      if (!credit) return ""
      return `${credit.borrower.data.firstName} ${credit.borrower.data.lastName}`
    },
    [dispersedCredits],
  )

  const expectedAmount = useCallback(
    (employeeNumber: string) => {
      const credit = dispersedCredits.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (credit: any) => credit.borrower.data.employeeNumber === employeeNumber,
      )
      if (!credit) return 0
      return credit.amortization
    },
    [dispersedCredits],
  )

  const loanTerm = useCallback(
    (employeeNumber: string) => {
      const credit = dispersedCredits.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (credit: any) => credit.borrower.data.employeeNumber === employeeNumber,
      )
      if (!credit) return 0
      return credit.termOffering.data.term.data.duration
    },
    [dispersedCredits],
  )

  const expectedPaymentDate = useCallback(
    (employeeNumber: string, paymentNumber: number) => {
      const credit = dispersedCredits.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (credit: any) => credit.borrower.data.employeeNumber === employeeNumber,
      )
      if (!credit) return ""
      const payment = credit.payments.data.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payment: any) => payment.number === paymentNumber,
      )
      if (!payment) return ""
      return dayjs(payment.expectedAt).locale("es").format("LL")
    },
    [dispersedCredits],
  )

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
            onClose={() => {
              refresh()
              setErrors({})
              setIsModalOpen(false)
            }}
            title={`Importar pagos para ${company.name}`}
          >
            <Button
              size="sm"
              onClick={async () => {
                await handleSave()
                if (Object.keys(errors).length === 0) {
                  window.location.reload()
                }
              }}
              disabled={invalidRowsCount > 0 || isSaving}
            >
              Confirmar
            </Button>
          </Modal.Header>
          <Modal.Body>
            {invalidRowsCount > 0 ? (
              <div className="p-3">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <strong className="font-bold">Error:</strong>
                  <ul>
                    {Object.entries(errors).map(([key, value]) => (
                      <li key={key}>
                        Empleado <b>{key}</b>: {value?.join(", ")}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <List>
                <List.Header
                  columns={[
                    "Empleado",
                    "Nómina",
                    "Descuento",
                    "# Descuento",
                    "Fecha Estimada",
                  ]}
                />
                <List.Body>
                  {rowKey &&
                    csvRows.map((row, i) => (
                      <List.Row key={`${row["Empleado"]}-${i}`}>
                        <List.Cell key="name">
                          {employeeName(row["Empleado"])}
                        </List.Cell>
                        <List.Cell key="empNumber">{row["Empleado"]}</List.Cell>
                        <List.Cell key="expectedAmount">
                          {Number(expectedAmount(row["Empleado"])) !==
                          Number(row["Descuento"]) ? (
                            <span className="text-red-500 font-bold">
                              {MXNFormat.format(Number(row["Descuento"]))}
                            </span>
                          ) : (
                            MXNFormat.format(Number(row["Descuento"]))
                          )}
                        </List.Cell>
                        <List.Cell key="expectedPayment">
                          {row["#"]} de {loanTerm(row["Empleado"])}
                        </List.Cell>
                        <List.Cell key="expectedPaymentDate">
                          {expectedPaymentDate(
                            row["Empleado"],
                            Number(row["#"]),
                          )}
                        </List.Cell>
                      </List.Row>
                    ))}
                </List.Body>
              </List>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export default ImportDocumentModal
