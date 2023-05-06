import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

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

  // populate checkedList with default values based on isTrickSaved
  useEffect(() => {
    const initialCheckedList = tricks.map((trick) => isTrickSaved(trick._id));
    setCheckedList(initialCheckedList);

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
        const response = await axios.get("http://localhost:3001/tricks");
        setTricks(response.data);
      } catch (err) {
        console.error(err);
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

  // saving/deleting a trick on checking/unchecking the checkbox
  const saveTrick = async (event, trickID) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      // add trick
      try {
        await axios.put("http://localhost:3001/tricks", {
          trickID,
          userID,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      // delete trick
      try {
        await axios.delete("http://localhost:3001/tricks", {
          data: { userID: userID, trickID: trickID },
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const wishlistTrick = async (trickID) => {
    if (!isTrickWishlist(trickID)) {
      try {
        await axios.put("http://localhost:3001/tricks/wishlist", {
          trickID,
          userID,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await axios.delete("http://localhost:3001/tricks/wishlist", {
          data: { userID: userID, trickID: trickID },
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isTrickSaved = (id) => completedTricks.includes(id);
  const isTrickWishlist = (id) => wishlistTricks.includes(id);

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
        <h1 className="text-3xl text-center">Tricklist</h1>
        <Filter />
      </div>
      <ul className=" pb-16">
        {tricks.map((trick, index) => (
          <li
            key={trick._id}
            // className={`${index % 4 === 3 ? "rounded-b-xl" : ""} ${
            //   index % 4 === 0 ? "rounded-t-xl" : ""
            // } bg-amber-50 mx-2`}
          >
            <div
              className={`flex justify-between items-center mx-4 gap-1 ${
                index % 4 === 3 ? "mb-4" : "mb-0"
              }`}
            >
              <input
                className=" accent-black"
                type="checkbox"
                onClick={(event) => {
                  saveTrick(event, trick._id);
                  handleCheckboxChange(index);
                }}
                defaultChecked={checkedList[index]}
              />
              <h2
                className={`${
                  checkedList[index] ? "line-through" : ""
                } text-md`}
              >
                {trick.name}
              </h2>
              <div
                onClick={() => {
                  wishlistTrick(trick._id);
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
      </ul>
    </div>
  );
};

export default Home;
