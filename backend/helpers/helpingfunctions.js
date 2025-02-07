import { exec } from "child_process";
import dotenv from 'dotenv';
dotenv.config();
import axios from "axios";


export const transcribeAudio=(audioPath, outputPath)=>{
    return new Promise((resolve, reject) => {
      const command = `python C:\\Users\\saikr\\HackProject\\open-ai\\whisper-script.py "${audioPath}" "${outputPath}" --model medium `;
      console.log("Executing:", command);
  
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("Transcription Error:", stderr);
          reject(error);
        } else {
          console.log("Transcription Successful:", stdout);
          resolve();
        }
      });
    });
  }
export const extractAudio=(videoUrl, audioPath)=>{
    return new Promise((resolve, reject) => {
      exec(
        `"C:\\ffmpeg\\ffmpeg-7.1-essentials_build\\bin\\ffmpeg.exe" -i "${videoUrl}" -vn -acodec pcm_s16le "${audioPath}"`,
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });
  };


export const generateQuiz = async (storyText) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const API_URL =
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
    
    


    try {
      const prompt = `
        Generate a quiz with atmost 6 and atlest 2 multiple-choice questions based on the following text:
        "${storyText}"
        Each question should have 4 answer choices (A, B, C, D).
        Provide the correct answer along with a brief explanation.
  
        Respond ONLY with a valid JSON array in this exact format:
        [
          { 
            "question": "What is the moral of the story?", 
            "options": ["Overconfidence leads to failure", "Speed is most important", "Never race against a hare", "Being slow is bad"], 
            "answer": "Overconfidence leads to failure",
            "explanation": "The story teaches that being overconfident, like the hare, can lead to failure, while consistency, like the tortoise, leads to success."
          },
          ...
          (total 10 questions)
        ]
      `;
  
      const response = await axios.post(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json" } }
      );
  
     
      const candidate = response.data?.candidates?.[0];
      if (!candidate || !candidate.content || !candidate.content.parts) {
        throw new Error("Invalid AI response format");
      }
  
      
      const generatedText = candidate.content.parts[0]?.text?.trim() || "";
      console.log(generatedText)
      const cleanedText = generatedText.replace(/json|/g, "").trim();
  
    
      let quizData;
      try {
        quizData = JSON.parse(cleanedText);
      } catch (jsonError) {
        throw new Error("AI response is not valid JSON");
      }

      // if (!Array.isArray(quizData) || quizData.length !== 10) {
      //   throw new Error("AI did not generate exactly 10 questions.");
      // }
  
      //console.log(" Generated Quiz Data:", JSON.stringify(quizData, null, 2));
      //console.log(quizData);
      return quizData;
    } catch (error) {
      console.error(" Error generating quiz:", error.message);
      return null;
    }
  };