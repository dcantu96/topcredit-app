const StepItemConnector = ({ isCompleted }: { isCompleted: boolean }) => {
  return (
    <div
      className={`absolute left-4 top-4 -ml-[1px] mt-[0.125rem] h-full w-[0.125rem] ${
        isCompleted ? "bg-indigo-600" : "bg-gray-300"
      }`}
      aria-hidden={isCompleted ? "false" : "true"}
    />
  )
}

export default StepItemConnector
