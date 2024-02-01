export const itemPositionState = (
  position: number,
  currentStep: number,
): "current" | "completed" | "next" => {
  if (position === currentStep) {
    return "current"
  } else if (position < currentStep) {
    return "completed"
  } else {
    return "next"
  }
}
