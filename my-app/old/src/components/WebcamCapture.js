import React,{Component} from 'react';
import {connect} from 'react-redux';
import Webcam from 'react-webcam';
import TwilioChat from 'twilio-chat'
import $ from 'jquery'
import axios from 'axios';
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { startAddEmotion } from "../actions/pureEmotion";
const fs = require('fs');

// var fs = require('fs');

class WebcamCapture extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      username: null,
      channel: null,
      img : "",
    }
  }

  componentDidMount = () => {
    this.getToken()
      .then(this.createChatClient)
      .then(this.joinGeneralChannel)
      .then(this.configureChannelEvents)
      .catch((error) => {
        this.addMessage({ body: `Error: ${error.message}` })
      })
  }

  getToken = () => {
    return new Promise((resolve, reject) => {
      this.addMessage({ body: 'Connecting...' })

      $.getJSON('/token', (token) => {
        this.setState({ username: token.identity })
        resolve(token)
      }).fail(() => {
        reject(Error('Failed to connect.'))
      })
    })
  }

  createChatClient = (token) => {
    return new Promise((resolve, reject) => {
      resolve(new TwilioChat(token.jwt))
    })
  }

  joinGeneralChannel = (chatClient) => {
    return new Promise((resolve, reject) => {
      chatClient.getSubscribedChannels().then(() => {
        chatClient.getChannelByUniqueName('general').then((channel) => {
          this.addMessage({ body: 'Joining general channel...' })
          this.setState({ channel })

          channel.join().then(() => {
            this.addMessage({ body: `Joined general channel as ${this.state.username}` })
            window.addEventListener('beforeunload', () => channel.leave())
          }).catch(() => reject(Error('Could not join general channel.')))

          resolve(channel)
        }).catch(() => this.createGeneralChannel(chatClient))
      }).catch(() => reject(Error('Could not get channel list.')))
    })
  }

  createGeneralChannel = (chatClient) => {
    return new Promise((resolve, reject) => {
      this.addMessage({ body: 'Creating general channel...' })
      chatClient
        .createChannel({ uniqueName: 'general', friendlyName: 'General Chat' })
        .then(() => this.joinGeneralChannel(chatClient))
        .catch(() => reject(Error('Could not create general channel.')))
    })
  }

  addMessage = (message) => {
    const messageData = { ...message, me: message.author === this.state.username }
    this.setState({
      messages: [...this.state.messages, messageData],
    })
  }

  handleNewMessage = (text) => {
    if (this.state.channel) {
      this.state.channel.sendMessage(text)
    }
  }

  configureChannelEvents = (channel) => {
    channel.on('messageAdded', ({ author, body }) => {
      this.addMessage({ author, body })
    })

    channel.on('memberJoined', (member) => {
      this.addMessage({ body: `${member.identity} has joined the channel.` })
    })

    channel.on('memberLeft', (member) => {
      this.addMessage({ body: `${member.identity} has left the channel.` })
    })
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
          <MessageList messages={this.state.messages} />
          <MessageForm onMessageSend={()=>{this.capture();this.handleNewMessage()}} />
          {/* <button onClick={this.capture}>Capture photo</button> */}
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