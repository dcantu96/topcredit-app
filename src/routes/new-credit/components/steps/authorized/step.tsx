import { useRecoilValue } from "recoil"

import ButtonLink from "components/atoms/button-link"
import { userLatestAuthorizedCreditSelectorQuery } from "../../../atoms"
import { ArrowPathIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import { MXNFormat } from "../../../../../constants"

const Step = () => {
  const credit = useRecoilValue(userLatestAuthorizedCreditSelectorQuery)
  return (
    <div className="p-4 max-w-screen-md">
      <h1 className="text-gray-900 font-bold text-3xl">Autorización</h1>
      {credit?.status === "authorized" ? (
        <div className="px-4 py-12">
          <div className="text-center">
            <ArrowPathIcon className="h-12 w-12 text-gray-300 mx-auto" />
            <h3 className="font-semibold text-sm mt-2 text-gray-900">
              Estamos procesando tu dispersión
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Tu crédito por{" "}
              <b>
                {credit?.loan ? MXNFormat.format(credit.loan) : 0}
                MXN
              </b>{" "}
              ha sido autorizado. Este proceso puede tardar de 24 a 72 horas. Te
              notificaremos por correo cuando tu crédito haya sido dispersado.
            </p>
          </div>
        </div>
      ) : credit?.status === "dispersed" ? (
        <div className="px-4 py-12">
          <div className="text-center">
            <CheckBadgeIcon className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="font-semibold text-sm mt-2 text-gray-900">
              ¡Ya te enviamos tu dinero!
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600 mb-2">
              Te enviamos{" "}
              <b>
                {credit?.loan ? MXNFormat.format(credit.loan) : 0}
                MXN
              </b>{" "}
              a la CLABE que nos proporcionaste.
            </p>
            <ButtonLink to="/my-credits">Ver mi crédito</ButtonLink>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Step
