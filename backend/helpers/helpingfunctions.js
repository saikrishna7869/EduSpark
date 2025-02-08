import { exec } from "child_process";
import dotenv from 'dotenv';
dotenv.config();
import axios from "axios";


export const transcribeAudio=(audioPath, outputPath,subtitlepath)=>{
    return new Promise((resolve, reject) => {
      const command = `python C:\\Users\\saikr\\EduSpark\\open-ai\\whisper-script.py "${audioPath}" "${outputPath}"  --model medium `;
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
        Generate a quiz with atmost 6 and atleast 2 multiple-choice questions based on the following text:
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
  export const generatesubtitle = async (subtitles, language) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
  
    try {
      const prompt = `
        Convert the following subtitles: ${JSON.stringify(subtitles)} to **${language}**.
        Rules:
        1. Keep start and end timestamps EXACTLY as original
        2. ONLY translate the 'text' field
        3. Respond ONLY with valid JSON array in this EXACT format:
           [{"start": 0.0, "end": 2.0, "text": "..."}, ...]
        4. No markdown, no explanations, only plain JSON
        5. Ensure proper JSON escaping for quotes and special characters
        6. Maintain original array length and order
      `;
  
      const response = await axios.post(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json" } }
      );
  
      // Extract generated text
      const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Clean response - remove markdown, JSON wrappers, and trim whitespace
      const cleanedText = generatedText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^[^{[]*/, '')  // Remove non-JSON prefix
        .replace(/[^}\]]*$/, '') // Remove non-JJSON suffix
        .trim();
  
      if (!cleanedText) throw new Error('Empty response from API');
  
      // Parse and validate
      const parsed = JSON.parse(cleanedText);
      
      if (!Array.isArray(parsed)) throw new Error('Response is not an array');
      if (parsed.length !== subtitles.length) throw new Error('Array length mismatch');
      
      parsed.forEach((item, index) => {
        if (!item.start || !item.end || !item.text) {
          throw new Error(`Missing fields in item ${index}`);
        }
        if (item.start !== subtitles[index].start || item.end !== subtitles[index].end) {
          throw new Error('Timestamp mismatch at index ' + index);
        }
      });
  
      return parsed;
    } catch (error) {
      console.error('Translation Error:', {
        message: error.message,
        //responseText: generatedText?.slice(0, 200) + '...', // Log first 200 chars
        stack: error.stack
      });
      throw new Error(`Subtitle translation failed:`);
    }
  };