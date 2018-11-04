import React,{Component} from 'react';
import {connect} from 'react-redux';
import Webcam from 'react-webcam';
import axios from 'axios';
import { startAddEmotion } from "../actions/pureEmotion";
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
       this.props.startAddEmotion(imageSrc);
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
    
    };
   
    render() {
      const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
      
      };
      // let imgg = this.state.img != "" ? <img src={this.state.img}></img>:<span></span>;
      return (
        <div>
          <Webcam
            audio={false}
            // height={350}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            // width={350}
            videoConstraints={videoConstraints}
          />
          <button onClick={this.capture}>Capture photo</button>
          {/* {imgg} */}
        </div>
      );
    }
  }


const mapDispatchToProps = (dispatch) => ({

  startAddEmotion: (data)=> dispatch(startAddEmotion(data))

});

const mapStateToProps = (state) => {
  return {
    emotion: state.pureEmotion,
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(WebcamCapture);