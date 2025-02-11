import Steps from "components/molecules/steps/steps"
import ActiveStep from "./components/active-step"
import { useRecoilState, useRecoilValue } from "recoil"
import { activeStepSelectorState, isStepAccessible } from "./atoms"
import withAuthorizationRedirect from "components/hocs/with-authorization-redirect"
import withAuth from "components/hocs/with-auth/with-auth"
import DashboardHeader from "components/organisms/dashboard-header"

export type StepLabelOptions =
  | "Datos Generales"
  | "Pre Autorizado"
  | "Autorizado"

const Screen = () => {
  const datosGeneralesAccesible = useRecoilValue(
    isStepAccessible("Datos Generales"),
  )
  const preAutorizadoAccesible = useRecoilValue(
    isStepAccessible("Pre Autorizado"),
  )
  const autorizadoAccesible = useRecoilValue(isStepAccessible("Autorizado"))
  const [activeStep, setActiveStep] = useRecoilState(activeStepSelectorState)

  const steps = [
    {
      label: "Datos Generales",
      description: "Necesitamos algunos datos básicos para poder continuar.",
      accessible: datosGeneralesAccesible,
    },
    {
      label: "Pre Autorizado",
      description: "!Felicidades, fuiste pre aprobado!",
      accessible: preAutorizadoAccesible,
    },
    {
      label: "Autorizado",
      description: "¡Felicidades, te Autorizamos tu crédito!",
      accessible: autorizadoAccesible,
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="w-full col-span-2">
        <DashboardHeader />
      </div>
      <div className="flex items-center justify-center self-center fixed h-screen -mt-16 w-16 md:w-[400px]">
        <Steps
          steps={steps}
          activeStep={activeStep}
          setActiveStep={(label) => setActiveStep(label as StepLabelOptions)}
        />
      </div>
      <div className="overflow-y-auto pl-16 md:pl-[400px] mt-16">
        <ActiveStep activeStep={activeStep} />
      </div>
    </div>
  )
}

export default withAuth(withAuthorizationRedirect(Screen))
