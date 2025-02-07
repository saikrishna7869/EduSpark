import {Link} from 'react-router-dom';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppStore } from "../store/index";

const Navbar = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    console.log(userInfo)
    const handleLogout = async () => {
        const res=await axios.post("http://localhost:5000/api/auth/logout");
         if(res.status===200){
           setUserInfo(null);
        
           navigate("/");
         }
     
        
       };
       const handleuploadVideo=()=>{
        navigate("/home/uploadvideo");
       };

  return (
    <nav style={{height:"100px",display:"flex",
        position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100%", 
      backgroundColor: "lightpink",
      justifyContent:"space-between",
      alignItems:"center",
      marginBottom:"100px"
    }}>
        <h1 style={{marginRight:"60%"}}>EduSpark...</h1>
        <Link to="/home" style={{marginRight:"8%"}}>home</Link>
        {!userInfo.isStudent?<button onClick={handleuploadVideo} style={{height:"40px",width:"80px"}}>Upload Video</button>:" "}
        <button onClick={handleLogout} style={{height:"40px",width:"80px"}} >Logout</button>      
    </nav>
  )
}

export default Navbar
