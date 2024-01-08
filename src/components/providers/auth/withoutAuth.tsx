import { useRecoilValue } from "recoil";
import { authState } from "./atoms";
import { Navigate } from "react-router-dom";

export const withoutAuth = <P extends object>(Component: React.FC<P>) => {
  return (props: P) => {
    const maybeAuth = useRecoilValue(authState);
    console.log("maybeAuth", maybeAuth);
    const UnauthenticatedComponent = Component as React.FC<P>;

    if (!maybeAuth) {
      return <UnauthenticatedComponent {...props} />;
    }

    return <Navigate to="/" />;
  };
};
