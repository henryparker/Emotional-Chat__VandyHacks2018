import React,{Component} from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
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
      let imageSrc = dataURItoBlob(this.webcam.getScreenshot());
      // imageSrc = new Buffer(imageSrc, "base64")
      console.log(imageSrc);
      this.setState({img : imageSrc})
      let subscriptionKey = "f86b477ee92e432096018c52d9d952f0"
      let uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect'
      let params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };
    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);
  
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
  
      return new Blob([ia], {type:mimeString});
  }
    let config = {
      headers: {'Content-Type': 'application/octet-stream',
                 'Ocp-Apim-Subscription-Key':'f86b477ee92e432096018c52d9d952f0' },
      params : {'returnFaceId' : 'true',
        'returnFaceLandmarks' : 'false',
        'returnFaceAttributes' : 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise' },
        
      }
      
    
      axios.post(uriBase,imageSrc,config).then((res)=>console.log(res))
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