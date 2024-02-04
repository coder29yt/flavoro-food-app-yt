import axios from "axios";

export const getCart = async (user) => {
  const res = await axios.get(`https://flavoro-clone-backend.onrender.com/api/get-cart/${user._id}`);
  const data = await res.data;
  return data;
};
