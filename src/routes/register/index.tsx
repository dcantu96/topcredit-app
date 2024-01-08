import { useState } from "react";

import Input from "components/atoms/input";
import Button from "components/atoms/button";
import ButtonLink from "components/atoms/button-link";
import { withoutAuth } from "components/providers/auth/withoutAuth";

import logo from "../../images/logo.png";
import { useApi } from "components/providers/api/useApi";
import { useRecoilValue } from "recoil";
import { authActions } from "components/providers/auth/atoms";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const api = useApi();
  const { login } = useRecoilValue(authActions);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("register", { email, password });
      await api.create("user", {
        email,
        password,
      });
      await login(email, password);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="relative flex flex-1 flex-col items-center justify-center pb-16 pt-12">
        <h1 className="sr-only">Registrate en Topcredit</h1>
        <img
          className="mx-auto mb-12 h-14 w-auto text-slate-900"
          src={logo}
          alt="Topcredit Logo"
        />
        <h1 className="text-lg text-center">Registrate en Topcredit</h1>
        <form className="w-full max-w-sm" onSubmit={handleRegister}>
          <div className="mb-6">
            <Input
              id="email"
              value={email}
              label="Correo"
              type="email"
              required
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              id="name"
              value={email}
              label="Nombre"
              required
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              id="lastName"
              value={email}
              label="Apellido"
              required
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              id="phone"
              value={email}
              label="Teléfono"
              required
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              id="password"
              label="Contraseña"
              type="password"
              required
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              id="confirm-password"
              label="Confirmar Contraseña"
              type="password"
              required
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
            />
          </div>
          <Button type="submit">Enviar</Button>
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
  );
};

export default withoutAuth(Register);
