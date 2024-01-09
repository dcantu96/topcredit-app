import { isLoggedInState } from "components/providers/auth/atoms";
import { useRecoilValue } from "recoil";
import Landing from "../landing";

const Home = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  if (isLoggedIn) {
    return <div>Dashboard</div>;
  } else {
    return <Landing />;
  }
};

export default Home;
