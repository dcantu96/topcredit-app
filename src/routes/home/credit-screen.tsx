import Steps from "components/molecules/steps/steps";
import { useState } from "react";

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

const GeneralData = () => {
  return <div>Datos Generales</div>;
};

const PreAuthorized = () => {
  return <div>Pre Autorizado</div>;
};

const Authorized = () => {
  return <div>Autorizado</div>;
};

const ActiveStep = ({ activeStep }: { activeStep: string }) => {
  switch (activeStep) {
    case "Datos Generales":
      return <GeneralData />;
    case "Pre Autorizado":
      return <PreAuthorized />;
    case "Autorizado":
      return <Authorized />;
    default:
      return <div>Paso no identificado {activeStep}</div>;
  }
};

const CreditScreen = () => {
  const [activeStep, setActiveStep] = useState("Datos Generales");
  return (
    <div className="flex flex-row min-h-fit">
      <div className="items-center justify-center self-center">
        <Steps
          steps={steps}
          activeStep={activeStep}
          setActiveStep={(label) => setActiveStep(label)}
        />
      </div>
      <ActiveStep activeStep={activeStep} />
    </div>
  );
};

export default CreditScreen;
