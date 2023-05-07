import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { wishlistTrick } from "../hooks/useWishlistTrick";
import { saveTrick } from "../hooks/useSaveTrick";

const Home = () => {
  const [cookies, _] = useCookies(["access_token"]);
  const [tricks, setTricks] = useState([]);
  // database completedTricks/wishlistTricks
  const [completedTricks, setCompletedTricks] = useState([]);
  const [wishlistTricks, setWishlistTricks] = useState([]);
  // local checklist/wishlist
  const [localCheckedList, setLocalCheckedList] = useState([]);
  const [localWishlist, setLocalWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // populate checkedList with default values based on isTrickSaved
  useEffect(() => {
    const initialCheckedList = tricks.map((trick) => isTrickSaved(trick._id));
    setLocalCheckedList(initialCheckedList);

    const initialWishlist = tricks.map((trick) => isTrickWishlist(trick._id));
    setLocalWishlist(initialWishlist);
  }, [tricks]);

  const handleChecklistChange = (index) => {
    const updatedLocalCheckedList = [...localCheckedList];
    updatedLocalCheckedList[index] = !updatedLocalCheckedList[index];
    setLocalCheckedList(updatedLocalCheckedList);
  };

  const handleIconChange = (index) => {
    const updatedLocalWishlist = [...localWishlist];
    updatedLocalWishlist[index] = !updatedLocalWishlist[index];
    setLocalWishlist(updatedLocalWishlist);
  };

  const userID = useGetUserID();

  // fetches all tricks, users completed tricks and users wishlisted tricks
  useEffect(() => {
    // all tricks
    const fetchTricks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3001/tricks");
        setTricks(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    // completed tricks
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

    // wishlist tricks
    const fetchWishlistTricks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/tricks/wishlist/ids/${userID}`
        );
        setWishlistTricks(response.data.wishlistTricks);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTricks();

    // only fetches completed and wishlist for signed in users
    if (cookies.access_token) {
      fetchCompletedTricks();
      fetchWishlistTricks();
    }
  }, []);

  const isTrickSaved = (id) => completedTricks.includes(id);
  const isTrickWishlist = (id) => wishlistTricks.includes(id);

  return (
    <div>
      <ul className="pb-16">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex items-center justify-center my-2 mx-8">
              <h1 className="text-3xl text-center select-none">Tricklist</h1>
            </div>
            {tricks.map((trick, index) => (
              <li key={trick._id}>
                <div
                  className={`flex justify-between items-center mx-4 gap-1 ${
                    index % 4 === 3 ? "mb-4" : "mb-0"
                  }`}
                >
                  <div
                    onClick={() => {
                      saveTrick(userID, trick._id, isTrickSaved(trick._id));
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
                    className="cursor-pointer"
                    onClick={() => {
                      wishlistTrick(
                        userID,
                        trick._id,
                        isTrickWishlist(trick._id)
                      );
                      handleIconChange(index);
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
          </>
        )}
      </ul>
    </div>
  );
};

export default Home;
