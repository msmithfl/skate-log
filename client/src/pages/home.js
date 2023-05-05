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
  const [isSolid, setIsSolid] = useState(false);

  // populate checkedList with default values based on isTrickSaved
  useEffect(() => {
    const initialCheckedList = tricks.map((trick) => isTrickSaved(trick._id));
    setCheckedList(initialCheckedList);
    //console.log(initialCheckedList);

    const initialWishlist = tricks.map((trick) => isTrickWishlist(trick._id));
    setWishlist(initialWishlist);
    console.log(initialWishlist);
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

  useEffect(() => {
    const fetchTricks = async () => {
      try {
        const response = await axios.get("http://localhost:3001/tricks");
        setTricks(response.data);
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
    if (cookies.access_token) {
      fetchCompletedTricks();
      fetchWishlistTricks();
    }
  }, []);

  const saveTrick = async (event, trickID) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      try {
        await axios.put("http://localhost:3001/tricks", {
          trickID,
          userID,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
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
    if (!isSolid) {
      try {
        await axios.put("http://localhost:3001/tricks/wishlist", {
          trickID,
          userID,
        });
        console.log(trickID);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isTrickSaved = (id) => completedTricks.includes(id);
  const isTrickWishlist = (id) => wishlistTricks.includes(id);

  const toggleHeart = () => {
    setIsSolid(!isSolid);
    console.log(isSolid);
  };

  return (
    <div>
      <h1 className="text-3xl text-center m-2">Tricklist</h1>
      <ul className=" pb-16">
        {tricks.map((trick, index) => (
          <li key={trick._id}>
            <div
              className={`flex justify-between items-center mx-8 gap-2 ${
                index % 4 === 3 ? "mb-4" : "mb-0"
              }`}
            >
              <input
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
                } text-xl`}
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
