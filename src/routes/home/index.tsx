import { isLoggedInState } from "components/providers/auth/atoms";
import { useRecoilValue } from "recoil";
import Landing from "../landing";

/**
 * This component is in charge of rendering a screen depending on the user's authentication status.
 *
 * If the user is authenticated
 *  - and the user has a role,
 *    then he will be redirected to the admin dashboard component.
 *  - and the user does not have any particular role,
 *    then he will be redirected to the wizard component.
 *
 * Else, the user will be redirected to the landing component.
 */
const Home = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  console.log("home screen");
  if (isLoggedIn) {
    return <div>Home</div>;
  } else {
    return <Landing />;
  }
};

export default Home;
