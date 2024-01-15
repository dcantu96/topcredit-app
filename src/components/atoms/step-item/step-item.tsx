import { StepItemConnector } from "../step-item-connector";
import { itemPositionState } from "./utils";

interface StepItemProps {
  label: string;
  description: string;
  currentStep: number;
  stepsCount: number;
  position: number;
  handleStepClick?: () => void;
}

const StepItem = ({
  label,
  description,
  currentStep,
  position,
  stepsCount,
  handleStepClick,
}: StepItemProps) => {
  const isLastStep = position === stepsCount - 1;
  const state = itemPositionState(position, currentStep);
  const canHover = state === "next" || state === "completed";

  return (
    <li className={`relative ${isLastStep ? "" : "pb-10"}`}>
      {!isLastStep && <StepItemConnector isCompleted={state === "completed"} />}
      <a
        href="#"
        onClick={handleStepClick}
        className={`text-inherit decoration-inherit relative flex items-start ${
          canHover ? "group" : ""
        }`}
      >
        <span className="flex h-9 items-center">
          <span
            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
              state === "completed"
                ? "bg-indigo-600 group-hover:bg-indigo-800"
                : state === "current"
                  ? "border-2 border-indigo-600 bg-white"
                  : "border-2 border-gray-300 group-hover:border-gray-400 bg-white"
            }`}
          >
            {state === "completed" ? (
              <CheckIcon />
            ) : state === "current" ? (
              <span className="h-[0.625rem] w-[0.625rem] rounded-full bg-indigo-600" />
            ) : (
              <span className="hidden group-hover:block h-[0.625rem] w-[0.625rem] rounded-full bg-gray-300" />
            )}
          </span>
        </span>
        <span className="flex ml-4 min-w-0 flex-col">
          <span
            className={`
            text-sm font-medium
            ${
              state === "current"
                ? "text-indigo-600"
                : state === "next"
                  ? "text-gray-500"
                  : ""
            }
          `}
          >
            {label}
          </span>

          <span className="text-sm text-gray-500">{description}</span>
        </span>
      </a>
    </li>
  );
};

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    className="h-5 w-5 text-white"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export default StepItem;
