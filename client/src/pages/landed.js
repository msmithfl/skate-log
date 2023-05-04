import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

const Landed = () => {
  const [completedTricks, setCompletedTricks] = useState([]);

  const userID = useGetUserID();

  // getting the user's completed tricks
  useEffect(() => {
    const fetchCompletedTricks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/tricks/completedTricks/${userID}`
        );
        setCompletedTricks(response.data.completedTricks);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompletedTricks();
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-center m-2">My Progress</h1>
      <ul>
        {completedTricks.map((trick) => (
          <li key={trick._id}>
            <div className="flex justify-center">
              <h2 className="text-xl">{trick.name}</h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Landed;
