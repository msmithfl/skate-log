import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";
import { URL } from "../App";

const Landed = () => {
  const [cookies, _] = useCookies(["access_token"]);
  const [completedTricks, setCompletedTricks] = useState([]);

  const userID = useGetUserID();

  // getting the user's completed  tricks
  useEffect(() => {
    const fetchCompletedTricks = async () => {
      try {
        const response = await axios.get(
          `${URL}/tricks/completedTricks/${userID}`
        );
        setCompletedTricks(response.data.completedTricks);
      } catch (err) {
        console.error(err);
      }
    };
    if (cookies.access_token) fetchCompletedTricks();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center my-2 mx-8">
        <h1 className="text-3xl text-center">My Progress</h1>
      </div>
      {!cookies.access_token && (
        <div className="flex justify-center text-center">
          Login or Register to track your progress.
        </div>
      )}
      <ul className="pb-16">
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
