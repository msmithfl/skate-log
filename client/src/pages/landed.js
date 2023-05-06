import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";

const Landed = () => {
  const [completedTricks, setCompletedTricks] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const [listState, setListState] = useState("trick");

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
    console.log(listState);
    if (cookies.access_token) fetchCompletedTricks();
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
            }  fa-solid fa-list text-xl px-1 rounded-md`}
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
        <h1 className="text-3xl text-center">My Progress</h1>
        <Filter />
      </div>
      {!cookies.access_token && (
        <div className="flex justify-center text-center">
          Login or Register to track your progress.
        </div>
      )}
      <ul className="pb-16">
        {listState === "trick" &&
          completedTricks.map((trick) => (
            <li key={trick._id}>
              <div className="flex justify-center">
                <h2 className="text-xl">{trick.name}</h2>
              </div>
            </li>
          ))}
        {listState === "stance" &&
          completedTricks
            .filter((trick) => trick.stance === "regular")
            .map((trick) => (
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
