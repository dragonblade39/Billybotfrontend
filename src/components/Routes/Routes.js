import Home from "../Home/Home";
import Login from "../Login/Login";
import Profile from "../Profile/Profile";
import Signup from "../Signup/Signup";

export const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/signup",
    component: Signup,
  },
  {
    path: "/home",
    component: Home,
  },

  {
    path: "/profile",
    component: Profile,
  },
];
