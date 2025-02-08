import { useState, useEffect } from "react";
import axios from "axios";
import { useAppStore } from "../store/index";
import Navbar from "./Navbar";
import VideoCard from "./VideoCard";
import ChatBot from "./ChatBot";

const Home = () => {
  const { userInfo } = useAppStore();
  const [user] = useState(userInfo || "");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/video/getvideos")
      .then((response) => {
       
        setVideos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <h2 style={{ color: "black", marginTop: "100px" }}>
        Welcome, {user?.username}
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
{/* 
        <button style={{borderRadius:"50%",height:"50px",width:"50px",position: "fixed",
    bottom: "20px",
    right: "20px"}}>Ai</button> */}
    <ChatBot/>
    </div>
  );
};

export default Home;
