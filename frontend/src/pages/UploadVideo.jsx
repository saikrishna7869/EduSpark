import Navbar from "./Navbar"
import VideoUpload from "./VideoUpload"


const UploadVideo = () => {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"500px",maxWidth:"500px"}}>
      <Navbar/>
      <VideoUpload/>
    </div>
  )
}

export default UploadVideo
