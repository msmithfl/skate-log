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
  const [checkedList, setCheckedList] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // for filtering
  const [listState, setListState] = useState("trick");
  const regularTricks = tricks.filter((trick) => trick.stance === "regular");

  const [isLoading, setIsLoading] = useState(false);

  // populate checkedList with default values based on isTrickSaved
  useEffect(() => {
    const initialCheckedList = tricks.map((trick) => isTrickSaved(trick._id));
    setCheckedList(initialCheckedList);
    console.log(initialCheckedList);

    const initialWishlist = tricks.map((trick) => isTrickWishlist(trick._id));
    setWishlist(initialWishlist);
  }, [tricks]);

  const handleCheckboxChange = (index) => {
    const updatedCheckedList = [...checkedList];
    updatedCheckedList[index] = !updatedCheckedList[index];
    setCheckedList(updatedCheckedList);
  };

  const handleIconChange = (index) => {
    const updatedWishlist = [...wishlist];
    updatedWishlist[index] = !updatedWishlist[index];
    setWishlist(updatedWishlist);
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
        //console.log(response.data.wishlistTricks);
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

  const handleMenuClick = (item) => {
    if (item === "trick") {
      setListState("trick");
    } else if (item === "stance") {
      setListState("stance");
    } else if (item === "diff") {
      setListState("diff");
    }
  };

  function FilterMenu() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <div onClick={() => setOpen(!open)}>
          <i
            className={`hover:duration-300 hover:scale-110 ${
              open ? "duration-300 scale-110" : "duration-300 scale-100"
            }  fa-solid fa-list text-xl px-1 rounded-md cursor-pointer`}
          ></i>
          {open && (
            <div className="absolute -translate-x-14 border-2 px-3 py-1 border-black rounded-md bg-white">
              <div
                onClick={() => handleMenuClick("trick")}
                className={`${
                  listState === "trick" && " font-bold"
                } hover:duration-300 hover:scale-110 cursor-pointer`}
              >
                Trick
              </div>
              <div
                onClick={() => handleMenuClick("stance")}
                className={`${
                  listState === "stance" && " font-bold"
                } hover:duration-300 hover:scale-110 cursor-pointer`}
              >
                Stance
              </div>
              <div
                onClick={() => handleMenuClick("diff")}
                className={`${
                  listState === "diff" && " font-bold"
                } hover:duration-300 hover:scale-110 cursor-pointer`}
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
      <ul className="pb-16">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex items-center justify-between my-2 mx-8">
              <h1 className="text-3xl text-center select-none">Tricklist</h1>
              <FilterMenu />
            </div>
            {listState === "trick" &&
              tricks.map((trick, index) => (
                <li key={trick._id}>
                  <div
                    className={`flex justify-between items-center mx-4 gap-1 ${
                      index % 4 === 3 ? "mb-4" : "mb-0"
                    }`}
                  >
                    <div
                      onClick={() => {
                        saveTrick(userID, trick._id, isTrickSaved(trick._id));
                        handleCheckboxChange(index);
                      }}
                    >
                      <h2
                        className={`${
                          checkedList[index] ? "line-through" : ""
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
                          wishlist[index] ? "fas fa-star" : "far fa-star"
                        }`}
                      ></i>
                    </div>
                  </div>
                </li>
              ))}
            {listState === "stance" && (
              <>
                {regularTricks.map((trick, index) => (
                  <li key={trick._id}>
                    <div className="flex justify-center">
                      <h2
                        className={`${
                          checkedList[index] ? "line-through" : ""
                        } text-xl cursor-pointer select-none`}
                      >
                        {trick.name}
                      </h2>
                    </div>
                  </li>
                ))}
              </>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default Home;
