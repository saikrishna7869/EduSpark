import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
const VideoDetail = () => {
  const { id } = useParams(); // Get video ID from the URL
  const [video, setVideo] = useState(null);
  const [rating, setRating] = useState(null); // Holds the selected rating
  const [submitted, setSubmitted] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/video/getvideo/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [id]);
  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  
  const handleSubmitRating = async () => {

    try {
      const temp = rating + (video.ratingcount * video.rating);
      const newRatingCount = video.ratingcount + 1;
      const newRating = temp / newRatingCount;
      const response = await axios.put(`http://localhost:5000/video/rating/${id}`, { newRating ,newRatingCount});
      console.log("Rating submitted:", response.data);
      setSubmitted(true);
    }
    catch (error) {


      console.error("Error submitting rating:", error);


    }
  
  };

  const takeQuiz=async ()=>{
    
        navigate(`/video/takequiz/${video._id}`);
    
  }






  if (!video) return <h2>Loading...</h2>;

  return (
    <>
     <Navbar/>
   
    <div style={{marginTop:"100px"}}>
      <h1>{video.title}</h1>
      <video controls width="600">
        <source src={video.videolink} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>Uploaded by: {video.user?.username}</p>
      <p>{video.description}</p>
      <p>Text:{video.text}</p>
      <div>
        <p>Rate this video:</p>
        <div id="rating">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="rating"
                value={num}
                onChange={handleRatingChange}
                checked={rating === num}
              />
              {num}
            </label>
          ))}
        </div>
        <button onClick={handleSubmitRating} disabled={rating === null}>
          Submit Rating
        </button>

        {submitted && <p>Thank you for your rating!</p>}
      </div>
      <div>
        <button onClick={takeQuiz}> Take Quiz/Test</button>
      </div>

    </div>
    </>
  );
};

export default VideoDetail;
