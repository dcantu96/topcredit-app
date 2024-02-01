import Authorized from "../steps/authorized"
import GeneralData from "../steps/general-data"
import PreAuthorized from "../steps/pre-authorized"

/**
 * These are the screens displayed to the "Employee" when he is setting up a new credit
 */
const ActiveStep = ({ activeStep }: { activeStep: string }) => {
  switch (activeStep) {
    case "Datos Generales":
      return <GeneralData />
    case "Pre Autorizado":
      return <PreAuthorized />
    case "Autorizado":
      return <Authorized />
    default:
      return <div>Paso no identificado {activeStep}</div>
  }
}

export default ActiveStep
