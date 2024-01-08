import { NavLink } from "react-router-dom";
import Logo from "../../../images/logo.png";

export const Header = () => {
  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur flex-none lg:border-b lg:z-50 lg:border-slate-900/10 bg-white supports-backdrop-blur:bg-white/95">
      <div className="max-w-7xl mx-auto">
        <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 mx-4 lg:mx-0">
          <div className="relative flex items-center">
            <NavLink to="/">
              <img
                src={Logo}
                alt="Top Credit Logo"
                className="w-40 mr-3 flex-none overflow-hidden"
              />
            </NavLink>
            <div className="ml-auto">
              <nav className="text-sm leading-6 font-semibold text-slate-700">
                <ul className="flex space-x-8">
                  <li>
                    <NavLink to="/credito" className="hover:text-sky-500">
                      Consigue tu crédito
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/credito"
                      className="ml-auto hover:text-sky-500"
                    >
                      Inicia sesión
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
