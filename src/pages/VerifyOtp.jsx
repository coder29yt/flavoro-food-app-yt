import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("https://flavoro-clone-backend.onrender.com/api/verify-otp", {
        otp,
        newPassword: password,
      });
      const data = await res.data;
      if (data.success) {
        toast.success(res.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleVerifyOtp}
        className="bg-white rounded-lg p-5 shadow-lg flex flex-col gap-3 w-[80vw] lg:w-[20vw] text-sm"
      >
        <input
          type="tel"
          name="otp"
          id="otp"
          className="outline-none border rounded-md px-3 py-2 focus:border-green-300 text-gray-600"
          autoComplete="off"
          placeholder="1234"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          name="password"
          id="password"
          className="outline-none border rounded-md px-3 py-2 focus:border-green-300 text-gray-600"
          autoComplete="off"
          placeholder="********"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="outline-none border rounded-md px-3 py-2 text-white bg-green-500 hover:bg-green-300"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
