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
    console.log("login", { email, password });
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
