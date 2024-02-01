import { useRecoilValue } from "recoil"
import { authState } from "./atoms"

export const withAuth = <P extends object>(Component: React.FC<P>) => {
  return (props: P) => {
    const maybeAuth = useRecoilValue(authState)

    if (!maybeAuth) {
      return <div>no auth</div>
    }

    const AuthenticatedComponent = Component as React.FC<P>

    return <AuthenticatedComponent {...props} />
  }
}
