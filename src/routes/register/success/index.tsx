import ButtonLink from "components/atoms/button-link"
import { withoutAuth } from "components/providers/auth/withoutAuth"

import logo from "../../../assets/logo.png"

const Register = () => {
  return (
    <>
      <div className="isolate bg-white px-6 py-24 sm:pt-32 pb-12 lg:px-8">
        <h1 className="sr-only">Regístrate en Topcredit</h1>
        <img
          className="mx-auto mb-12 h-14 w-auto text-slate-900"
          src={logo}
          alt="Topcredit Logo"
        />
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Gracias por registrarte en Topcredit
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Te hemos enviado un correo electrónico para que confirmes tu cuenta.
          </p>
        </div>
      </div>
      <footer className="relative shrink-0">
        <div className="space-y-4 text-sm text-gray-900 flex flex-col w-36 sm:w-auto mx-auto sm:flex-row sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0">
          <p className="text-center sm:text-left">¿Ya tienes cuenta?</p>
          <ButtonLink to="/login">
            <span>
              Inicia sesión <span aria-hidden="true">→</span>
            </span>
          </ButtonLink>
        </div>
      </footer>
    </>
  )
}

export default withoutAuth(Register)
