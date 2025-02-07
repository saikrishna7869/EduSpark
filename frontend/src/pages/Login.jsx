import  { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/index";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEducator,resetEducaotor]=useState(false)
  const navigate=useNavigate()
  const { setUserInfo } = useAppStore();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let res=""
      if(isEducator)
        res = await axios.post("http://localhost:5000/api/auth/loginEducator", { email,password });
        else
      res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      if(res.status===200){
        localStorage.setItem("token", res.data.token); 
        console.log(res.data.user);
      setUserInfo(res.data.user);
      navigate("/home");
      }
      else if(res.status===400){
      
        console.log("nvkjknsndkjsdkjfjds");
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err.response.data.message);
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

        <button type="submit">Login as  {isEducator?"Educator":"Student"}</button>
      </form>
     
      <p>Dont have an account? <Link to="/register">Register</Link></p>
      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
};

export default Login;
