import axios from "axios";

export const wishlistTrick = async (userID, trickID, isTrickWishlisted) => {
  if (!isTrickWishlisted) {
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
