import withAuthorizationRedirect from "components/hocs/with-authorization-redirect"
import NavLink from "components/atoms/nav-link"
import ButtonLink from "components/atoms/button-link"

import logoSmall from "../../assets/logo_small.png"
import logo from "../../assets/logo.png"

const ConfirmationFailure = () => {
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Topcredit</span>
              <img
                className="h-8 w-auto"
                src={logoSmall}
                alt="topcredit-header-logo"
              />
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <NavLink to="/clients">Clientes</NavLink>
            <NavLink to="/benefits">Beneficios</NavLink>
            <NavLink to="/blog">Noticias</NavLink>
            <NavLink to="/legal">Legal</NavLink>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <NavLink to="/send-confirmation">
              Enviar confirmación de nuevo{" "}
              <span aria-hidden="true">&rarr;</span>
            </NavLink>
          </div>
        </nav>
      </header>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 flex flex-col justify-center">
          <img
            className="h-24 w-auto mx-auto mb-4"
            src={logo}
            alt="topcredit-header-logo"
          />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Hubo un error al confirmar tu cuenta
            </h1>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <ButtonLink to="/send-confirmation" size="md">
                Enviar confirmación de nuevo
              </ButtonLink>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default withAuthorizationRedirect(ConfirmationFailure)
