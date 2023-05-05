import React from "react";
import { useCookies } from "react-cookie";

const Wishlist = () => {
  const [cookies, _] = useCookies(["access_token"]);

  return (
    <div>
      <h1 className="text-3xl text-center m-2">Wishlist</h1>
      {!cookies.access_token && (
        <div className="flex justify-center">
          Login or Register to save a wishlist.
        </div>
      )}
    </div>
  );
};

export default Wishlist;
