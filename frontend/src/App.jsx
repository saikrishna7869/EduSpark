import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UploadVideo from "./pages/UploadVideo";
import { useAppStore } from "./store/index";
import { useState, useEffect } from "react";
import axios from "axios";
import VideoDetail from "./pages/VideoDetail";
import QuizDisplay from "./pages/QuizDisplay";

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true); 
 
  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("token");
      //console.log("Token in frontend:", token); // Debugging

      if (!token) {
       
        console.warn("No token found in localStorage");
        setUserInfo(undefined);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/getuserinfo", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        
        console.error("Error fetching user info:", error);
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [setUserInfo]); 

  if (loading) return <div>Loading.....</div>; 

  return (<>
  
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/uploadvideo" element={<UploadVideo />} />
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/video/takequiz/:id" element={<QuizDisplay/>} />

      </Routes>
    </Router>
    </>
  );
}

export default App;
