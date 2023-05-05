import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  return (
    <div>
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // define cookie named access token, only need access to function that sets cookie
  const [_, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      // setting response from api to our cookie
      setCookies("access_token", response.data.token);
      // storing userID inside local storage for quick access
      window.localStorage.setItem("userID", response.data.userID);

      // my fix to error catching an unregistered login attempt
      if (!response.data.userID) {
        alert("User does not exist! Please Check Credentials or Register.");
        setCookies("access_token", "");
        //window.localStorage.removeItem("userID");
        return;
      }

      // navigate to homepage after successful login
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
    />
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event) => {
    // will prevent page from refreshing when submitting the form
    event.preventDefault();

    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });

      alert("Registration Completed! Now login.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Form
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        label="Register"
        onSubmit={onSubmit}
      />
    </div>
  );
};

const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  label,
  onSubmit,
}) => {
  return (
    <div className="flex flex-col m-2 p-2 pt-1 bg-slate-300 rounded">
      <form onSubmit={onSubmit}>
        <h2 className="text-xl text-center">{label}</h2>
        <div className="flex flex-col">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="flex flex-col mt-1">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className="mt-3 w-full bg-slate-100" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Auth;
