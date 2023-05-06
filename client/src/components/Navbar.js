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
    <div className="flex justify-between items-center gap-3 px-4 py-2 bg-black text-white">
      <Link to="/">
        <div className="flex items-center">
          <img
            src="https://cutewallpaper.org/24/log-png/log-my-singing-monsters-wiki-fandom.png"
            alt="skate-log-logo"
            className="w-10"
          />
          <p>Skate Log</p>
        </div>
      </Link>
      {!cookies.access_token ? (
        <Link to="/auth">Login/Register</Link>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
};

export default Navbar;
