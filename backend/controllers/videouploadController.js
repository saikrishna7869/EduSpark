import cloudinary from '../cloudinary/cloud.js';
import fs from "fs/promises";
import path from "path";
import Video from "../models/Video.js"
import QuizQue from '../models/QuizQue.js';
import { exec } from "child_process";
import Educator from '../models/Educator.js';
import {extractAudio,transcribeAudio,generateQuiz,generatesubtitle} from '../helpers/helpingfunctions.js'
import { fileURLToPath } from 'url';
import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config();
import Comment from '../models/comment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const videoupload = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded." });
      }
  
      const videoPath = req.file.path;
      const audioFilename = `audio-${Date.now()}.wav`;
      const audioPath = path.join('uploads', audioFilename);
      const outputPath = path.join(__dirname, "uploads/transcription.txt");
      const subtitlepath=path.join(__dirname,"uploads/transcription_timestamps.txt")
      await extractAudio(videoPath, audioPath);
      await transcribeAudio(videoPath, outputPath,subtitlepath);
      const transcription = await fs.readFile(outputPath, "utf-8"); 
      const subtitleArray = [];
    
    // Read file content
    const data = await fs.readFile(subtitlepath, "utf-8");
    
    // Regex to match timestamps and text
    const regex = /\[(\d+\.\d+) --> (\d+\.\d+)\] (.+)/g;

    let match;
    while ((match = regex.exec(data)) !== null) {
        const start = parseFloat(match[1]); // Convert to float
        const end = parseFloat(match[2]);   // Convert to float
        const text = match[3].trim();       // Remove leading/trailing spaces
    
        subtitleArray.push({ start, end, text });
    }
    
    // Debug: Check if subtitles are correctly extracted
    console.log(subtitleArray);
      // const videoUploadResult = await cloudinary.uploader.upload(videoPath, {
      //   resource_type: "video",
       
      // });
      //console.log("going next");
      // const audioUploadResult = await cloudinary.uploader.upload(audioPath, {
      //   resource_type: "raw",
      //   folder: "audio"
      // });
      //console.log("processed as of now");
     const ques=await generateQuiz(transcription);
     //console.log(ques);
      const arr=[];
     for(let i=0;i<ques.length;i++){
      const quizque=new QuizQue({
        ques:ques[i].question,
        A:ques[i].options[0],
        B:ques[i].options[1],
        C:ques[i].options[2],
        D:ques[i].options[3],
        ans:ques[i].answer,
        explanation:ques[i].explanation
        });
        await quizque.save();
        arr.push(quizque._id);
     }

     
      const { title, languages, description, level } = req.body;
    //console.log(videoUploadResult.secure_url);
    //console.log(audioUploadResult.secure_url);
     const video=new Video({
        title:title,
        user:req.userId,
        language:languages,
        description:description,
        level:level,
        topic:title,
        text:transcription,
        subtitles:subtitleArray,
        summary:"tis id thensum,,m,asddmkmdnfoasmdnasjknfjknn,amnkjasksamkasmaskfas",
        questions:arr
        });
        await video.save();

      // await fs.unlink(videoPath);
      // await fs.unlink(audioPath);
      // await fs.unlink(outputPath);
      res.status(200).json({
        message: "Upload successful",
        //videoUrl: videoUploadResult.secure_url,
       // audioUrl: audioUploadResult.secure_url
      });
  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Processing failed" });
    }
  };



export const getvideos= async (req,res)=>{

    const videos=await Video.find().populate('user');
    console.log(videos);
    if(videos){
    res.status(200).json(videos);
    }
    else{
      res.status(404).json({message:"No videos found"});
    }
}

export const getvideo= async (req,res)=>{
  const id=req.params.id;
  const video=await Video.findById(id).populate('user');
  if(video){
    res.status(200).json(video);
  }
  else{
    res.status(404).json({message:"No video found"});
  }
}

export const setrating=async (req,res)=>{
    const id=req.params.id;
    const rating=req.body.newRating;
    const video=await Video.findById(id);

    if(video){
      video.rating=rating;
      video.ratingcount=video.ratingcount+1;

      await video.save();
      res.status(200).json({
        message:"Rating updated",
      });
    }

};

export const quizques=async (req,res)=>{
  const id =req.params.id;
  console.log("entered....");
  const video =await Video.findById(id).populate('questions');
  console.log(video);
  if(video){
    console.log(video);

    res.status(200).json(video);
    }
  else{
    res.status(404).json({message:"No video found"});
  }
}

export const comments=async (req,res)=>{
    const id=req.params.id;
    const video=await Video.findById(id).populate({ path: "comments", populate: { path: "user" } });
    if(video){
        res.status(200).json(video.comments);
    }

};
export const addcomment=async (req,res)=>{
    const id=req.params.id1;
    const userid=req.params.id2;
    console.log(id);
    console.log(userid);
    const text=req.body.text;
    const comment=new Comment({
        text:text,
        user:userid
});
comment.save();
    const video=await Video.findById(id);
    console.log(video);
    video.comments.push(comment._id);
    await video.save();
    const video2=await Video.findById(id).populate({ path: "comments", populate: { path: "user" } });
    res.status(200).json(video2.comments);

};


export const updatereply=async (req,res)=>{
  const id=req.params.id;
  const videoid=req.params.id2;
  const reply=req.body.text;
  const comment=await Comment.findById(id);
  comment.reply=reply;
  await comment.save();
  const video=await Video.findById(videoid).populate({ path: "comments", populate: { path: "user" } });
  res.status(200).json(video.comments);

}

export const getsubtitles=async (req,res)=>{
  const id=req.params.id;
  const language=req.params.id2;
  const video=await Video.findById(id);
  if(video){
    console.log(video.subtitles);
    console.log(language);
    const arr=await generatesubtitle(video.subtitles,language);
    console.log("generated");
    res.status(200).json(arr);
}
else{
  res.status(404).json({message:"generating failed"});
}

}
