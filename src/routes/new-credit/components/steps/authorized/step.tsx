import { useRecoilValue } from "recoil"

import ButtonLink from "components/atoms/button-link"
import { userLatestAuthorizedCreditSelectorQuery } from "../../../atoms"
import { CheckBadgeIcon } from "@heroicons/react/24/solid"
import { MXNFormat } from "../../../../../constants"
import Lottie from "react-lottie"
import WalletMoney from "../../../../../assets/lotties/wallet-money.json"

const Step = () => {
  const credit = useRecoilValue(userLatestAuthorizedCreditSelectorQuery)
  return (
    <div className="p-4 max-w-screen-md">
      {credit?.status === "authorized" ? (
        <div className="px-4">
          <div className="text-center">
            <div className="-mt-10 -mb-10">
              <Lottie
                options={{
                  animationData: WalletMoney,
                  autoplay: true,
                  loop: true,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
                height={350}
                width={350}
              />
            </div>
            <h3 className="font-semibold mt-2 text-gray-900">
              ¡Felicidades! Te autorizamos un crédito por{" "}
              <span className="font-bold text-xl block">
                {credit?.loan ? MXNFormat.format(credit.loan) : 0}
                MXN
              </span>
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Estamos procesando tu dispersión. Este proceso puede tardar de 24
              a 72 horas. Te notificaremos por correo cuando tu crédito haya
              sido dispersado.
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
