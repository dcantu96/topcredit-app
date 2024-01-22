import Steps from "components/molecules/steps/steps";
import ActiveStep from "./components/active-step";
import { useRecoilState } from "recoil";
import { activeStepSelectorState } from "./atoms";

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
];

const Screen = () => {
  const [activeStep, setActiveStep] = useRecoilState(activeStepSelectorState);
  return (
    <div className="grid grid-cols-[400px_1fr] h-screen grid-rows-[40px_1fr]">
      <div className="w-full col-span-2 bg-black"></div>
      <div className="flex items-center justify-center self-center">
        <Steps
          steps={steps}
          activeStep={activeStep}
          setActiveStep={(label) => setActiveStep(label)}
        />
      </div>
      <div className="overflow-y-auto">
        <ActiveStep activeStep={activeStep} />
      </div>
    </div>
  );
};

export default Screen;
