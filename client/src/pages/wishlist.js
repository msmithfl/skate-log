import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";
import { wishlistTrick } from "../hooks/useWishlistTrick";
import { saveTrick } from "../hooks/useSaveTrick";

const Wishlist = () => {
  const [cookies, _] = useCookies(["access_token"]);
  // database
  const [completedTricks, setCompletedTricks] = useState([]);
  const [wishlistTricks, setWishlistTricks] = useState([]);
  // local
  const [localCheckedList, setLocalCheckedList] = useState([]);
  const [localWishlist, setLocalWishlist] = useState([]);

  useEffect(() => {
    const initialWishlist = wishlistTricks.map(() => true);
    setLocalWishlist(initialWishlist);

    const initialCheckedlist = wishlistTricks.map((trick) =>
      completedTricks.includes(trick._id)
    );
    setLocalCheckedList(initialCheckedlist);
  }, [wishlistTricks]);

  const handleIconChange = (index) => {
    const updatedLocalWishlist = [...localWishlist];
    updatedLocalWishlist[index] = !updatedLocalWishlist[index];
    setLocalWishlist(updatedLocalWishlist);
  };

  const handleChecklistChange = (index) => {
    const updatedLocalCheckedList = [...localCheckedList];
    updatedLocalCheckedList[index] = !updatedLocalCheckedList[index];
    setLocalCheckedList(updatedLocalCheckedList);
  };

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
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCompletedTricks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/tricks/completedTricks/ids/${userID}`
        );
        setCompletedTricks(response.data.completedTricks);
      } catch (err) {
        console.error(err);
      }
    };

    // only fetches completed and wishlist for signed in users
    if (cookies.access_token) {
      fetchWishlistTricks();
      fetchCompletedTricks();
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
        {wishlistTricks.map((trick, index) => (
          <li key={trick._id}>
            <div className="flex justify-between mx-4">
              <div
                onClick={() => {
                  saveTrick(userID, trick._id, localCheckedList[index]);
                  handleChecklistChange(index);
                }}
              >
                <h2
                  className={`${
                    localCheckedList[index]
                      ? "line-through text-gray-400/50"
                      : ""
                  } text-xl cursor-pointer select-none`}
                >
                  {trick.name}
                </h2>
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
