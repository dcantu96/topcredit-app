import Input from "components/atoms/input";
import FileField from "components/atoms/file-field";
import { useState } from "react";
import Button from "components/atoms/button";

const Step = () => {
  const [payroll, setPayroll] = useState("");

  return (
    <form className="p-4">
      <h1 className="text-gray-900 font-bold text-3xl">Datos Generales</h1>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        This information will be displayed publicly so be careful what you
        share.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <Input
            id="payroll"
            label="Numero de Nómina"
            value={payroll}
            onChange={(e) => setPayroll(e.target.value)}
          />
        </div>
        <div className="col-span-full">
          <Input
            id="bank-account-number"
            label="CLABE Interbancaria"
            placeholder="16 digitos"
            value={payroll}
            onChange={(e) => setPayroll(e.target.value)}
          />
        </div>
        <div className="col-span-full">
          <FileField
            id="official-identification"
            label="Identificación oficial"
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files);
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files);
              }
            }}
          />
        </div>
        <div className="col-span-full">
          <FileField
            id="cover"
            label="Caratula"
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files);
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files);
              }
            }}
          />
        </div>
        <div className="col-span-full">
          <FileField
            id="payroll-receipt"
            label="Recibo de Nomina"
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files);
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files);
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
  );
};

export default Step;
