// VideoCard.jsx

import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to a detail page using the video id
    navigate(`/video/${video._id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        width: "300px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        margin: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <video
        src={video.videolink}
        alt={video.title}
        style={{ width: "100%", height: "150px", display: "block" }}
      />
      <div style={{ padding: "10px" }}>
        <h3 style={{ margin: "0 0 5px", fontSize: "18px" }}>{video.title}</h3>
        <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
          {video.user.username}
        </p>
        <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
          rating:{video.rating}
        </p>
        
        
      </div>
    </div>
  );
};

export default VideoCard;
