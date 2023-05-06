import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="fixed bottom-0 w-full bg-black text-white p-4">
      <div className="flex justify-around">
        <Link to="/landed">Landed</Link>
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
      </div>
    </div>
  );
}

export default Footer;
