import React, { Component } from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import Webcam from 'react-webcam';
import { startAddEmotion } from "./actions/pureEmotion";
import './MessageForm.css'

class MessageForm extends Component {
  static propTypes = {
    onMessageSend: PropTypes.func.isRequired,
  }
  componentWillReceiveProps (newProps) {
    console.log(newProps);
    console.log(this.props)
    if( newProps.emotion !== this.props.emotion ){
      if (newProps.emotion.length >0){
        this.props.onMessageSend(JSON.stringify(newProps.emotion[0].faceAttributes.emotion))
      }
      
    } /* do stuff */
  }

  componentDidMount = () => {
    this.input.focus()
  }
  
  handleFormSubmit = (event) => {
    event.preventDefault()
    this.props.onMessageSend(this.input.value)
    // let fly = this.props.emotion && this.props.emotion.length>0 ? this.props.emotion[0].faceAttributes.emotion.happiness: "no result yet";
    // this.props.onMessageSend("happy: "+fly)
    this.input.value = ""
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

  
    return (
      <div>
      <form className="MessageForm" onSubmit={this.handleFormSubmit}>
        <div className="input-container">
          <input
            type="text"
            className="form-control"
            ref={(node) => (this.input = node)}
            placeholder="Enter your message..."
          />
        </div>
        <div className="button-container">
          <button className="btn btn-primary" onClick={this.capture} type="submit">
            Send
          </button>
        </div>
      </form>
      <Webcam
      audio={false}
      // height={1080}
      ref={this.setRef}
      screenshotFormat="image/jpeg"
      // width={1920}
      videoConstraints={videoConstraints}
    /> 
    </div>
    )
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

export default connect(mapStateToProps,mapDispatchToProps)(MessageForm);
