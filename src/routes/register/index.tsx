import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Switch } from "@headlessui/react"

import Input from "components/atoms/input"
import Button from "components/atoms/button"
import ButtonLink from "components/atoms/button-link"
import { withoutAuth } from "components/providers/auth/withoutAuth"
import { useApi } from "components/providers/api/useApi"
import { authActions } from "components/providers/auth/atoms"
import { useFormErrors } from "hooks/useFormErrors"

import logo from "../../assets/logo.png"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const Register = () => {
  const [email, setEmail] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [agreed, setAgreed] = useState(false)
  const { errors, handleErrors, clearErrors } = useFormErrors()
  const { login } = useRecoilValue(authActions)

  const api = useApi()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      clearErrors()
      await api.create("user", {
        email,
        firstName,
        lastName,
        phone,
        password,
        status: "new",
      })
      await login(email, password)
    } catch (error) {
      handleErrors(error, [
        "email",
        "firstName",
        "lastName",
        "phone",
        "password",
      ])
    }
  }

  return (
    <>
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
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
            Regístrate en Topcredit
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Necesitamos una información básica para comenzar este proceso
          </p>
        </div>
        <form
          action="#"
          method="POST"
          className="mx-auto mt-16 max-w-xl sm:mt-20"
          onSubmit={handleRegister}
        >
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            <div>
              <Input
                id="first-name"
                value={firstName}
                label="Nombres"
                error={errors.firstName}
                required
                onChange={({ target }) => setFirstName(target.value)}
              />
            </div>
            <div>
              <Input
                id="last-name"
                value={lastName}
                label="Apellidos"
                error={errors.lastName}
                required
                onChange={({ target }) => setLastName(target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                id="email"
                value={email}
                label="Email"
                error={errors.email}
                required
                onChange={({ target }) => setEmail(target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                id="password"
                label="Contraseña"
                type="password"
                required
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                id="confirm-password"
                label="Confirmar Contraseña"
                type="password"
                required
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                id="phone"
                value={phone}
                type="tel"
                prefix="MX"
                label="Teléfono"
                error={errors.phone}
                required
                onChange={({ target }) => setPhone(target.value)}
              />
            </div>
            <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center">
                <Switch
                  checked={agreed}
                  onChange={setAgreed}
                  className={classNames(
                    agreed ? "bg-indigo-600" : "bg-gray-200",
                    "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  )}
                >
                  <span className="sr-only">
                    Aceptar términos y condiciones
                  </span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      agreed ? "translate-x-3.5" : "translate-x-0",
                      "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out",
                    )}
                  />
                </Switch>
              </div>
              <Switch.Label className="text-sm leading-6 text-gray-600">
                Seleccionando esto estas de acuerdo con{" "}
                <a href="#" className="font-medium text-indigo-600">
                  políticas&nbsp;de&nbsp;privacidad
                </a>
                .
              </Switch.Label>
            </Switch.Group>
          </div>
          <div className="mt-10">
            <Button fullWidth type="submit">
              Enviar
            </Button>
          </div>
        </form>
      </div>
      <footer className="relative shrink-0">
        <div className="space-y-4 text-sm text-gray-900 sm:flex sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0">
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
