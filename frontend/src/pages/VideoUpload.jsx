import { useNavigate } from "react-router-dom";
import  { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";

const VideoCard = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [languages, setLanguages] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [loading,setLoading]=useState(false);
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async () => {
    console.log("button clickedd");
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("languages", languages);
    formData.append("description", description);
    formData.append("level", level);
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      console.log("response sending");
      const response = await axios.post("http://localhost:5000/video/videoupload", formData, {
        headers: {
           Authorization: `Bearer ${token}` ,
          "Content-Type": "multipart/form-data",
          
        },
      });
      
      if (response.status===200) {
        
        alert("Video uploaded successfully!");
        navigate("/home");
        setLoading(false);
      } else {
        alert("Upload failed!");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred while uploading.");
    }
  };

  

  return (
    <>
    <Navbar/>
    <div className="border p-4 rounded-md shadow-sm max-w-md" style={{marginTop:"200px",opacity:1}}>
      <input type="file" accept="video/*" onChange={handleVideoUpload} className="w-full p-2 border rounded mb-2" />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-2" />
      <input type="text" placeholder="Languages (comma separated)" value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full p-2 border rounded mb-2" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2" />
      <input type="text" placeholder="Level" value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2 border rounded mb-2" />
      
      {videoFile && (
        <video controls className="w-full rounded-md">
          <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <button onClick={handleSubmit} className="mt-2 p-2 bg-blue-500 text-white rounded">{loading?"Uploading Please Wait":"Upload Video"}</button>
      <h2 className="text-lg font-semibold mt-2">{title}</h2>
      <p className="text-sm text-gray-600">Languages: {languages}</p>
      <p className="text-sm text-gray-700 mt-1">{description}</p>
      <p className="text-sm font-medium mt-1">Level: {level}</p>
    </div>
      
    </>
  );
};

export default VideoCard;
