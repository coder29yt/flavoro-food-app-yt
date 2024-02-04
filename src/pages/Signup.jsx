import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await axios.post(`https://flavoro-clone-backend.onrender.com/api/signup`, {
      name,
      email,
      password,
    });
    const data = await res.data;
    if (res.status === 201) {
      toast.success(data.message);
      navigate("/login");
    } else if (res.status === 400 || res.status === 500) {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSignup}
        className="bg-white rounded-lg p-5 shadow-lg flex flex-col gap-3 w-[80vw] lg:w-[20vw] text-sm"
      >
        <input
          type="text"
          name="name"
          id="name"
          className="outline-none border rounded-md px-3 py-2 focus:border-green-300 text-gray-600"
          autoComplete="off"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          id="email"
          className="outline-none border rounded-md px-3 py-2 focus:border-green-300 text-gray-600"
          autoComplete="off"
          placeholder="johndoe@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Signup
        </button>
        <p className="text-xs text-gray-600 flex gap-2 -mt-1">
          <span>Or</span>
          <Link to="/login" className="hover:text-green-600">
            Login to your account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
