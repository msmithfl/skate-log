import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";

const Landed = () => {
  const [wishlistTricks, setWishlistTricks] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const [listState, setListState] = useState("trick");

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

  useEffect(() => {
    console.log(listState);
  }, [listState]);

  const handleMenuClick = (item) => {
    if (item === "trick") {
      setListState("trick");
    } else if (item === "stance") {
      setListState("stance");
    } else if (item === "diff") {
      setListState("diff");
    }
  };

  function Filter() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <div onClick={() => setOpen(!open)}>
          <i
            className={`hover:duration-300 hover:scale-110 ${
              open ? "duration-300 scale-110" : "duration-300 scale-100"
            } fa-solid fa-list text-xl px-1 rounded-md`}
          ></i>
          {open && (
            <div className="absolute -translate-x-14 border-2 px-3 py-1 border-black rounded-md bg-white">
              <div
                onClick={() => handleMenuClick("trick")}
                className="hover:duration-300 hover:scale-110 cursor-pointer"
              >
                Trick
              </div>
              <div
                onClick={() => handleMenuClick("stance")}
                className="hover:duration-300 hover:scale-110 cursor-pointer"
              >
                Stance
              </div>
              <div
                onClick={() => handleMenuClick("diff")}
                className="hover:duration-300 hover:scale-110 cursor-pointer"
              >
                Difficulty
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between my-2 mx-8">
        <h1 className="text-3xl text-center">Wishlist</h1>
        <Filter />
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

export default Landed;
