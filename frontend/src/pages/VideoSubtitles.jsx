import { useEffect, useState, useRef } from "react";
import axios from "axios";

const VideoSubtitles = ({ videoId, videoRef }) => {
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const subtitleContainerRef = useRef(null);

  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/video/subtitles/${videoId}/${selectedLanguage}`
        );
        if (response.status === 200) {
          setSubtitles(response.data);
          setCurrentSubtitleIndex(-1); // Reset current subtitle when language changes
        }
      } catch (error) {
        console.error("Error fetching subtitles:", error);
      }
    };

    fetchSubtitles();
  }, [videoId, selectedLanguage]);

  useEffect(() => {
    const updateSubtitle = () => {
      if (!videoRef.current) return;

      const currentTime = videoRef.current.currentTime;
      const newIndex = subtitles.findIndex(
        (s) => 
          currentTime >= parseFloat(s.start) && 
          currentTime < parseFloat(s.end) // Use < to avoid boundary overlaps
      );

      if (newIndex !== currentSubtitleIndex) {
        setCurrentSubtitleIndex(newIndex);

        // Auto-scroll to active subtitle
        if (newIndex !== -1 && subtitleContainerRef.current) {
          const activeElement = subtitleContainerRef.current.children[newIndex];
          activeElement?.scrollIntoView({
            behavior: "smooth",
            block: "nearest", // Better for small containers
          });
        }
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", updateSubtitle);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", updateSubtitle);
      }
    };
  }, [subtitles, videoRef, currentSubtitleIndex]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div>
        <label style={{ fontWeight: "bold" }}>Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="Telugu">Telugu</option>
        </select>
      </div>

      {/* Subtitles Container */}
      <div
        ref={subtitleContainerRef}
        style={{
          width: "400px",
          height: "80px", // Increased height for better visibility
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
          background: "#f9f9f9",
        }}
      >
        {subtitles.length === 0 ? (
          <p>Loading subtitles...</p>
        ) : (
          subtitles.map((subtitle, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                margin: "4px 0",
                fontWeight: currentSubtitleIndex === index ? "bold" : "normal",
                backgroundColor: currentSubtitleIndex === index ? "#ffff99" : "transparent",
                transition: "all 0.3s ease",
                borderRadius: "4px",
              }}
            >
              {subtitle.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoSubtitles;