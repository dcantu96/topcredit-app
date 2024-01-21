import { StepItem } from "components/atoms/step-item";

export interface StepsProps {
  steps: {
    label: string;
    description: string;
  }[];
  /**
   * The label of the active step
   */
  activeStep: string;
  setActiveStep: (label: string) => void;
}

const Steps = ({ steps, activeStep, setActiveStep }: StepsProps) => {
  const currentStepIndex = steps.findIndex((step) => step.label === activeStep);
  return (
    <div className="flex justify-center px-4 py-12 md:px-6 lg:px-8">
      <div className="min-w-0">
        <nav aria-label="Progress">
          <ol role="list" className="overflow-hidden list-none m-0 p-0">
            {steps.map((step, index) => (
              <StepItem
                key={index}
                label={step.label}
                description={step.description}
                currentStep={currentStepIndex}
                position={index}
                stepsCount={steps.length}
                handleStepClick={() => setActiveStep(step.label)}
              />
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Steps;
