import axios from "axios";

export const saveTrick = async (userID, trickID, isTrickSaved) => {
  if (!isTrickSaved) {
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
