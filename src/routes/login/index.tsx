import { useState } from "react";
import { useRecoilValue } from "recoil";

import Input from "components/atoms/input";
import Link from "components/atoms/link";
import Button from "components/atoms/button";
import ButtonLink from "components/atoms/button-link";

import { withoutAuth } from "components/providers/auth/withoutAuth";
import { authActions } from "components/providers/auth/atoms";

import logo from "../../images/logo.png";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useRecoilValue(authActions);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMsg(undefined);
      await login(email, password);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
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
      <div className="relative flex flex-1 flex-col items-center justify-center pb-16 pt-12">
        <h1 className="sr-only">Ingresa a topcredit con tu cuenta</h1>
        <img
          className={`mx-auto ${
            errorMsg ? "mb-4" : "mb-12"
          } h-14 w-auto text-slate-900`}
          src={logo}
          alt="Topcredit Logo"
        />
        {errorMsg && (
          <div className="mb-4 text-center">
            <p className="text-red-500 font-medium text-xs">{errorMsg}</p>
          </div>
        )}
        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <div className="mb-6">
            <Input
              required
              id="email"
              type="email"
              label="Correo"
              error={!!errorMsg}
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              id="password"
              type="password"
              label="Contraseña"
              required
              error={!!errorMsg}
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading} fullWidth status="dark">
            Ingresar
          </Button>
          <p className="mt-8 text-center">
            <Link to="/password/reset">¿Olvidaste tu contraseña?</Link>
          </p>
        </form>
      </div>
      <footer className="relative shrink-0">
        <div className="space-y-4 text-sm text-gray-900 sm:flex sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0">
          <p className="text-center sm:text-left">¿No tiene una cuenta?</p>
          <ButtonLink to="/register">
            <span>
              Registrate <span aria-hidden="true">→</span>
            </span>
          </ButtonLink>
        </div>
      </footer>
    </>
  );
};

export default withoutAuth(Login);
