import { useState, useEffect } from "react";
import axios from "axios";

export default function VideoComment({ videoId, userId }) {
  console.log(videoId);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/video/comments/${videoId._id}`)
      .then((response) => setComments(response.data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [videoId]);

  const addComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:5000/video/putcomment/${videoId._id}/${userId}`,
          { text: newComment }
        );
        if (response.status === 200) {
          setComments(response.data);
          setNewComment("");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };
  const postcomment=async (commentid,text)=>{
    try{
      const response=await axios.post(`http://localhost:5000/video/reply/${commentid}/${videoId._id}`,{text:text});
      if(response.status===200){

        setComments(response.data);
      }
  }
  catch(error){
    console.error("Error adding reply:", error);
    }
};

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={addComment} className="bg-blue-500 text-white p-2">
          Submit
        </button>
      </div>

      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment._id} className="p-2 border" style={{ border: "1px solid black", margin: "10px" }}>
            <p>
              <strong>{comment.user ? comment.user.username : "You"}</strong>
            </p>
            <p>{comment.text}</p>

            {/* Show reply if it exists */}
            {comment.reply.trim() !== "" ? (
              <div className="ml-4 mt-2 border-l-2 pl-2 text-gray-700">
                <p>
                  <strong>Reply:</strong> {comment.reply}
                </p>
              </div>
            ) : (
              // Reply input
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Reply to this comment..."
                  className="border p-1 w-full"
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [comment._id]: e.target.value })
                  }
                  disabled={videoId.user._id != userId}
                />
                <button className="mt-1 bg-blue-500 text-white p-1 rounded"
                  onClick={()=>postcomment(comment._id,replyText[comment._id])}
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
