import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";

const Landed = () => {
  const [wishlistTricks, setWishlistTricks] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);

  const userID = useGetUserID();

  // getting the user's wishlist tricks
  useEffect(() => {
    const fetchWishlistTricks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/tricks/wishlist/${userID}`
        );
        setWishlistTricks(response.data.wishlistTricks);
      } catch (err) {
        console.error(err);
      }
    };
    if (cookies.access_token) fetchWishlistTricks();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between my-2 mx-8">
        <h1 className="text-3xl text-center">Wishlist</h1>
        <i className="fa-solid fa-list text-xl"></i>
      </div>
      {!cookies.access_token && (
        <div className="flex justify-center">
          Login or Register to save a wishlist.
        </div>
      )}
      <ul className="pb-16">
        {wishlistTricks.map((trick) => (
          <li key={trick._id}>
            <div className="flex justify-between mx-10">
              <div>
                <h2 className="text-xl">{trick.name}</h2>
              </div>
              <div>
                <i className="fa-regular fas fa-star"></i>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Landed;
