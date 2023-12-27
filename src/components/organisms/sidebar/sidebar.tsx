import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <aside className="hidden lg:block fixed z-20 inset-0 top-[5.3rem] left-[max(0px,calc(50%-40rem))] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">
      <nav className="lg:text-sm lg:leading-6 relative py-4">
        <ul>
          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-semibold text-sky-500"
              to="/docs/installation"
            >
              <div className="mr-4 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 7c1.093 0 2.117.27 3 .743V17a6.345 6.345 0 0 0-3-.743c-1.093 0-2.617.27-3.5.743V7.743C5.883 7.27 7.407 7 8.5 7Z"
                    className="fill-sky-200 group-hover:fill-sky-500"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.5 7c1.093 0 2.617.27 3.5.743V17c-.883-.473-2.407-.743-3.5-.743s-2.117.27-3 .743V7.743a6.344 6.344 0 0 1 3-.743Z"
                    className="fill-sky-400 group-hover:fill-sky-500"
                  ></path>
                </svg>
              </div>
              Clientes
            </NavLink>
          </li>
          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-semibold text-sky-500"
              to="/docs/installation"
            >
              <div className="mr-4 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 7c1.093 0 2.117.27 3 .743V17a6.345 6.345 0 0 0-3-.743c-1.093 0-2.617.27-3.5.743V7.743C5.883 7.27 7.407 7 8.5 7Z"
                    className="fill-sky-200 group-hover:fill-sky-500 "
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.5 7c1.093 0 2.617.27 3.5.743V17c-.883-.473-2.407-.743-3.5-.743s-2.117.27-3 .743V7.743a6.344 6.344 0 0 1 3-.743Z"
                    className="fill-sky-400 group-hover:fill-sky-500"
                  ></path>
                </svg>
              </div>
              Instalaciones
            </NavLink>
          </li>
          <li>
            <NavLink
              className="group flex items-center lg:text-sm lg:leading-6 mb-4 font-semibold text-sky-500"
              to="/docs/installation"
            >
              <div className="mr-4 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 group-hover:shadow-sky-200">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 7c1.093 0 2.117.27 3 .743V17a6.345 6.345 0 0 0-3-.743c-1.093 0-2.617.27-3.5.743V7.743C5.883 7.27 7.407 7 8.5 7Z"
                    className="fill-sky-200 group-hover:fill-sky-500 "
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.5 7c1.093 0 2.617.27 3.5.743V17c-.883-.473-2.407-.743-3.5-.743s-2.117.27-3 .743V7.743a6.344 6.344 0 0 1 3-.743Z"
                    className="fill-sky-400 group-hover:fill-sky-500"
                  ></path>
                </svg>
              </div>
              Créditos
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
