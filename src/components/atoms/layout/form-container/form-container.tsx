interface FormContainerProps {
  children: React.ReactNode
}

const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <div className="mx-auto container px-4 pt-4 max-w-screen-lg">
      {children}
    </div>
  )
}

export default FormContainer
