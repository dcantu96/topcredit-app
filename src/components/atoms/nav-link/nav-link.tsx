import { Link as RouterLink, type To } from "react-router-dom";

interface LinkProps {
  to: To;
  children: React.ReactNode;
}

export const NavLink = ({ children, to }: LinkProps) => {
  return (
    <RouterLink to={to} className="text-sm font-medium leading-6 text-gray-900">
      {children}
    </RouterLink>
  );
};
