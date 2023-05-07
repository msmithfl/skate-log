import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";
import { wishlistTrick } from "../hooks/useWishlistTrick";

const Wishlist = () => {
  const [cookies, _] = useCookies(["access_token"]);
  // database
  const [wishlistTricks, setWishlistTricks] = useState([]);
  // local
  const [localWishlist, setLocalWishlist] = useState([]);

  useEffect(() => {
    const initialWishlist = wishlistTricks.map(() => true);
    setLocalWishlist(initialWishlist);
  }, [wishlistTricks]);

  const handleIconChange = (index) => {
    const updatedLocalWishlist = [...localWishlist];
    updatedLocalWishlist[index] = !updatedLocalWishlist[index];
    setLocalWishlist(updatedLocalWishlist);
  };

  const userID = useGetUserID();

  useEffect(() => {
    console.log(localWishlist);
  }, [localWishlist]);

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

  const isTrickWishlist = (id) => wishlistTricks.includes(id);

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
        {wishlistTricks.map((trick, index) => (
          <li key={trick._id}>
            <div className="flex justify-between mx-4">
              <div>
                <h2 className="text-xl">{trick.name}</h2>
              </div>
              <div
                onClick={() => {
                  wishlistTrick(userID, trick._id, localWishlist[index]);
                  handleIconChange(index, trick._id);
                }}
              >
                <i
                  className={`fa-regular ${
                    localWishlist[index] ? "fas fa-star" : "far fa-star"
                  }`}
                ></i>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
