import cloudinary from '../cloudinary/cloud.js';
import fs from "fs/promises";
import path from "path";
import Video from "../models/Video.js"
import QuizQue from '../models/QuizQue.js';
import { exec } from "child_process";
import Educator from '../models/Educator.js';
import {extractAudio,transcribeAudio,generateQuiz} from '../helpers/helpingfunctions.js'
import { fileURLToPath } from 'url';
import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config();


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

      await extractAudio(videoPath, audioPath);
      await transcribeAudio(videoPath, outputPath);
      const transcription = await fs.readFile(outputPath, "utf-8"); 

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
        
        summary:"tis id thensum,,m,asddmkmdnfoasmdnasjknfjknn,amnkjasksamkasmaskfas",
        questions:arr
        });
        await video.save();

      await fs.unlink(videoPath);
      await fs.unlink(audioPath);
      await fs.unlink(outputPath);
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