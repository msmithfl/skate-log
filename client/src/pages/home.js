import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

const Home = () => {
  const [tricks, setTricks] = useState([]);
  const [completedTricks, setCompletedTricks] = useState([]);

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
    fetchCompletedTricks();
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

  const strikeoutText = () => {
    console.log("FIRED");
  };

  return (
    <div>
      <h1 className="text-3xl text-center m-2">Tricklist</h1>
      <ul>
        {tricks.map((trick) => (
          <li key={trick._id}>
            <div className="flex justify-between items-center mx-8 gap-2">
              <input
                type="checkbox"
                onClick={(event) => {
                  saveTrick(event, trick._id);
                  strikeoutText();
                }}
                defaultChecked={isTrickSaved(trick._id)}
              />
              <h2 className="text-xl">{trick.name}</h2>
              <i className="fa-regular fa-heart"></i>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
