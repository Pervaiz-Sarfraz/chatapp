import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/chat");
  };

  return (
    <>
      {/* <h2>Login</h2> */}
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Login </p>
        <label>
          <input className="input" type="email" placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
          <span>Email</span>
        </label>

        <label>
          <input className="input" type="password" placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
          <span>Password</span>
        </label>
        <button className="submit">Submit</button>
        <p className="signin"> Do not have an acount ? <Link to='/register'>Register</Link> </p>
      </form>
    </>
  );
};

export default Login;
