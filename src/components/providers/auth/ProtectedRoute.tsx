import { useRecoilValue } from "recoil";
import { authState } from "./atoms";

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const maybeAuth = useRecoilValue(authState);

  if (!maybeAuth) {
    return <div>no auth</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
