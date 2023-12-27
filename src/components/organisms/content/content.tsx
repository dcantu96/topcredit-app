import Table from "../table";

interface IContent {
  children?: React.ReactNode;
}

export const Content = ({ children }: IContent) => {
  return (
    <div className="lg:pl-[17rem]">
      <div className="p-4">
        {children}
        <Table>
          <Table.Header
            columns={[
              "Nombre",
              "Dominio",
              "Taza",
              "Plazos",
              "Admin",
              "Acciones",
            ]}
          />
          <tbody className="bg-white">
            <tr>
              <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                Soriana
              </td>
              <td className="border-b border-slate-100 p-4 text-slate-500">
                @soriana.com
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                16%
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                16 meses, 3 quincenas...
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                Jorge Ruíz
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500 flex gap-2">
                <button className="pointer-events-auto rounded-md bg-indigo-600 px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">
                  V
                </button>
                <button className="pointer-events-auto rounded-md bg-indigo-600 px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">
                  E
                </button>
              </td>
            </tr>
            <tr>
              <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                Soriana
              </td>
              <td className="border-b border-slate-100 p-4 text-slate-500">
                @soriana.com
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                16%
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                16 meses, 3 quincenas...
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                Jorge Ruíz
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500 flex gap-2">
                <button className="pointer-events-auto rounded-md bg-indigo-600 px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">
                  V
                </button>
                <button className="pointer-events-auto rounded-md bg-indigo-600 px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">
                  E
                </button>
              </td>
            </tr>
            <tr>
              <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                Soriana
              </td>
              <td className="border-b border-slate-100 p-4 text-slate-500">
                @soriana.com
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                16%
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                16 meses, 3 quincenas...
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                Jorge Ruíz
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500 flex gap-2">
                <button className="pointer-events-auto rounded-md bg-indigo-600 px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">
                  V
                </button>
                <button className="pointer-events-auto rounded-md bg-indigo-600 px-2 py-1 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">
                  E
                </button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};
