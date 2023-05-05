import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

const Home = () => {
  const [tricks, setTricks] = useState([]);
  const [completedTricks, setCompletedTricks] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const [checkedList, setCheckedList] = useState([]);
  const [isSolid, setIsSolid] = useState(false);

  // populate checkedList with default values based on isTrickSaved
  useEffect(() => {
    const initialCheckedList = tricks.map((trick) => isTrickSaved(trick._id));
    setCheckedList(initialCheckedList);
  }, [tricks]);

  const handleCheckboxChange = (index) => {
    const updatedCheckedList = [...checkedList];
    updatedCheckedList[index] = !updatedCheckedList[index];
    setCheckedList(updatedCheckedList);
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

    fetchTricks();
    if (cookies.access_token) fetchCompletedTricks();
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

  const isTrickSaved = (id) => completedTricks.includes(id);

  const toggleHeart = () => {
    setIsSolid(!isSolid);
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
              <div onClick={toggleHeart}>
                <i
                  className={`fa-regular ${
                    isSolid ? "fas fa-star" : "far fa-star"
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
