import React,{Component} from 'react';
import Webcam from 'react-webcam'
const fs = require('fs');
// var fs = require('fs');

class WebcamCapture extends Component {
    constructor(props){
      super(props);
      this.state={
        img : ""
      }
    }
    setRef = webcam => {
      this.webcam = webcam;
    };
    
    capture = () => {
      let imageSrc = this.webcam.getScreenshot();
      // imageSrc = new Buffer(imageSrc, "base64")
      console.log(imageSrc);
      this.setState({img : imageSrc})
    };
   
    render() {
      const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
      
      };
      let imgg = this.state.img != "" ? <img src={this.state.img}></img>:<span></span>;
      return (
        <div>
          <Webcam
            audio={false}
            height={350}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={350}
            videoConstraints={videoConstraints}
          />
          <button onClick={this.capture}>Capture photo</button>
          {imgg}
        </div>
      );
    }
  }

export default WebcamCapture