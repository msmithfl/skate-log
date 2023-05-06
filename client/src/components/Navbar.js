import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    // reset cookie
    setCookies("access_token", "");
    // clear local storage of userID
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  return (
    <div className="flex justify-between items-center gap-3 px-6 py-4 bg-black text-white">
      <Link to="/">
        <div className="flex items-center select-none">
          <p>Skate Log</p>
        </div>
      </Link>
      {!cookies.access_token ? (
        <div className="select-none">
          <Link to="/auth">Login/Register</Link>
        </div>
      ) : (
        <div className="select-none">
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
