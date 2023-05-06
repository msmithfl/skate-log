import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";

const Wishlist = () => {
  const [cookies, _] = useCookies(["access_token"]);
  const [wishlistTricks, setWishlistTricks] = useState([]);

  const userID = useGetUserID();

  // fetches all tricks, users completed tricks and users wishlisted tricks
  useEffect(() => {
    // wishlist tricks
    const fetchWishlistTricks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/tricks/wishlist/${userID}`
        );
        setWishlistTricks(response.data.wishlistTricks);
        //console.log(response.data.wishlistTricks);
      } catch (err) {
        console.error(err);
      }
    };

    // only fetches completed and wishlist for signed in users
    if (cookies.access_token) {
      fetchWishlistTricks();
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center my-2 mx-8">
        <h1 className="text-3xl text-center">Wishlist</h1>
      </div>
      {!cookies.access_token && (
        <div className="flex justify-center text-center">
          Login or Register to save a wishlist.
        </div>
      )}
      <ul className="pb-16">
        {wishlistTricks.map((trick) => (
          <li key={trick._id}>
            <div className="flex justify-between mx-4">
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

export default Wishlist;
