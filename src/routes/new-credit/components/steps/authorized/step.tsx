import { useRecoilValue } from "recoil"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

import ButtonLink from "components/atoms/button-link"
import { userLatestAuthorizedCreditSelectorQuery } from "../../../atoms"

const Step = () => {
  const credit = useRecoilValue(userLatestAuthorizedCreditSelectorQuery)
  return (
    <div className="p-4 max-w-screen-md">
      <h1 className="text-gray-900 font-bold text-3xl">Autorización</h1>
      {credit?.status === "authorized" ? (
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Estamos procesando tu dispersión, por favor espera.
        </p>
      ) : credit?.status === "dispersed" ? (
        <div className="mt-2 rounded-md border-2 border-dashed border-indigo-600 p-2 inline-flex">
          <InformationCircleIcon className="h-6 w-6 text-indigo-600 mr-2" />
          Tu crédito ha sido dispersado.
          <ButtonLink to="/my-credits">Ver mi crédito</ButtonLink>
        </div>
      ) : null}
    </div>
  )
}

export default Step
