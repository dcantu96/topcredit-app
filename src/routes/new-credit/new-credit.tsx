import Steps from "components/molecules/steps/steps"
import ActiveStep from "./components/active-step"
import { useRecoilState } from "recoil"
import { activeStepSelectorState } from "./atoms"
import withAuthorizationRedirect from "components/hocs/with-authorization-redirect"
import withAuth from "components/hocs/with-auth/with-auth"
import DashboardHeader from "components/organisms/dashboard-header"

export type StepLabelOptions =
  | "Datos Generales"
  | "Pre Autorizado"
  | "Autorizado"

const steps = [
  {
    label: "Datos Generales",
    description: "Necesitamos algunos datos básicos para poder continuar.",
  },
  {
    label: "Pre Autorizado",
    description: "!Felicidades, fuiste pre aprobado!",
  },
  {
    label: "Autorizado",
    description: "¡Felicidades, te Autorizamos tu crédito!",
  },
]

const Screen = () => {
  const [activeStep, setActiveStep] = useRecoilState(activeStepSelectorState)
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
