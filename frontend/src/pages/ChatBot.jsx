// import { useState } from "react";
// import { IconButton, Box, TextField, Button, Typography } from "@mui/material";
// import ChatIcon from "@mui/icons-material/Chat";
// import axios from "axios";

// const ChatBot = () => {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   //const [response, setResponse] = useState("");
//   const [messages, setMessages] = useState([]); // Store user and AI messages

//   const handleSend = async () => {
//     if (!query) return;
//     const temp=query;
//     setQuery("");
//     // Add the user's query to the messages
//     setMessages((prevMessages) => [...prevMessages, { text: temp, type: "user" }]);

//     try {
//       // Send request to backend
//       const res = await axios.post("http://localhost:5000/api/chat", { temp });

//       console.log("Backend response:", res.data);

//       // Add AI response to the messages
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: res.data.reply, type: "ai" },
//       ]);

//       // Clear the query field after sending
     
//     } catch (error) {
//       console.error("Error:", error);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: "Failed to get a response.", type: "ai" },
//       ]);
//     }
//   };

//   return (
//     <>
//       <IconButton
//         onClick={() => setOpen(!open)}
//         sx={{
//           position: "fixed",
//           bottom: 20,
//           right: 20,
//           background: "#1976d2",
//           color: "#fff",
//           "&:hover": { background: "#1565c0" },
//         }}
//       >
//         <ChatIcon />
//       </IconButton>

//       {open && (
//         <Box
//           sx={{
//             position: "fixed",
//             bottom: 70,
//             right: 20,
//             width: 300,
//             maxHeight: "400px",
//             background: "#fff",
//             padding: 2,
//             boxShadow: 3,
//             borderRadius: 2,
//             overflow: "hidden",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <Box
//             sx={{
//               flexGrow: 1,
//               overflowY: "auto",
//               paddingBottom: "10px",
//               maxHeight: "300px", // Set max height for scrollable area
//             }}
//           >
//             {messages.map((message, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: "flex",
//                   flexDirection: message.type === "user" ? "row-reverse" : "row",
//                   alignItems: "center",
//                   marginBottom: 1,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     backgroundColor: message.type === "user" ? "#1976d2" : "#f5f5f5",
//                     color: message.type === "user" ? "#fff" : "#000",
//                     padding: 1.5,
//                     borderRadius: 2,
//                     maxWidth: "75%",
//                     wordWrap: "break-word",
//                   }}
//                 >
//                   <Typography>{message.text}</Typography>
//                 </Box>
//               </Box>
//             ))}
//           </Box>

//           <TextField
//             fullWidth
//             label="Ask AI..."
//             variant="outlined"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             sx={{ marginBottom: 1 }}
//           />
//           <Button fullWidth variant="contained" onClick={handleSend}>
//             Send
//           </Button>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ChatBot;
