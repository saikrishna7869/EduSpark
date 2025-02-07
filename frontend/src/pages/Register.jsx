import  { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEducator,resetEducaotor]=useState(false)
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let res="";
      if(isEducator)
        res=await axios.post("http://localhost:5000/api/auth/registerEducator", { username,email,password});
      else
      res=await axios.post("http://localhost:5000/api/auth/register", { username, email, password });

      if(res.status===201)
      navigate("/"); 
      else{
        navigate("/register")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input
          type="radio"
          id="educator"
          name="role"
          value="educator"
          checked={isEducator}
          onChange={() => resetEducaotor(!isEducator)}
        />
        <label htmlFor="educator">As an Educator</label>
        <button type="submit">Register as {isEducator?"Educator":"Student"}</button>
      </form>
    </div>
  );
};

export default Register;
