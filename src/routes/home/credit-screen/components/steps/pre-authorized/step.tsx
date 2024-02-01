import FileField from "components/atoms/file-field"
import Button from "components/atoms/button"
import FileViewer from "components/atoms/file-viewer"

const Step = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form className="p-4 max-w-screen-md" onSubmit={handleSubmit}>
      <h1 className="text-gray-900 font-bold text-3xl">Pre Autorización</h1>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Necesitamos algunos documentos para poder procesar tu solicitud.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
        <div className="col-span-full">
          <FileField
            id="payment-receipt"
            label="Recibo de Nómina"
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files)
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files)
              }
            }}
          />
        </div>
        <div className="col-span-1">
          <FileField
            id="contract"
            label="Contrato"
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files)
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files)
              }
            }}
          />
        </div>
        <div className="col-span-1">
          <FileViewer
            label="Contrato"
            fileName="contrato.pdf"
            fileDate="Sat Feb 25"
            fileSize="1.9MB"
          />
        </div>
        <div className="col-span-1">
          <FileField
            id="authorization-letter"
            label="Carta de Autorización"
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files)
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files)
              }
            }}
          />
        </div>
        <div className="col-span-1">
          <FileViewer
            label="Carta de Autorización"
            fileName="carta_aut.pdf"
            fileDate="Sat Feb 25"
            fileSize="1.9MB"
          />
        </div>
        <div className="col-span-full">
          <FileField
            id="hr-letter"
            label="Carta RH"
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files)
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files)
              }
            }}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button status="secondary" type="button">
          Cancelar
        </Button>
        <Button size="md" type="submit">
          Enviar
        </Button>
      </div>
    </form>
  )
}

export default Step
