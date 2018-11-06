import React,{Component} from 'react';
import {connect} from 'react-redux';
import Webcam from 'react-webcam';
import TwilioChat from 'twilio-chat'
import $ from 'jquery'
import axios from 'axios';
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { startAddEmotion } from "./actions/pureEmotion";
import  {receivedEmotion}  from './actions/receivedEmotion';
import _ from 'lodash';
import {Bar, Radar, Polar} from 'react-chartjs-2';

// var fs = require('fs');

class App extends Component {
  
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
          }).catch((e) => {reject(Error('Could not join general channel.')); console.log("e",e)})

          resolve(channel)
        }).catch(() => this.createGeneralChannel(chatClient))
      }).catch(() => reject(Error('Could not get channel list.')))
    })
  }

  createGeneralChannel = (chatClient) => {
    return new Promise((resolve, reject) => {
      this.addMessage({ body: 'Creating general channel...' });
      chatClient
        .createChannel({ uniqueName:'general' , friendlyName: 'General Chat' })
        .then(() => this.joinGeneralChannel(chatClient))
        .catch((e) => console.log(e))
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
  isJson = (str) =>{
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
  configureChannelEvents = (channel) => {
    channel.on('messageAdded', ({ author, body }) => {
      this.addMessage({ author, body })
      if(this.isJson(body)){
        let newObject = JSON.parse(body);
        this.props.receivedEmotion(newObject)

      }
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
      console.log("props",this.props);
      let emotionBarData = !_.isEmpty(this.props.receivedEmotionState) ?  {
        labels: ["anger","contempt","disgust","fear","happiness","neutral","sadness","surprise"],
        datasets: [{
            label:'percent',
            data: [this.props.receivedEmotionState.anger,this.props.receivedEmotionState.contempt,
              this.props.receivedEmotionState.disgust,this.props.receivedEmotionState.fear,
              this.props.receivedEmotionState.happiness,this.props.receivedEmotionState.neutral,
              this.props.receivedEmotionState.sadness,this.props.receivedEmotionState.surprise],
            backgroundColor: 'rgb(255,99,71)'
        }] } : {};

    let emotionBarChart = !_.isEmpty(emotionBarData) ?<div><h3>Emotions</h3> <Bar data={emotionBarData} options={{
       responsive:true,
       maintainAspectRatio:true,
       legend:{
         labels:{fontSize:50}
         
       },
        scales: {
            yAxes: [{
                ticks: {
                  fontSize: 40,
                    beginAtZero:true
                    
                }
            }],
            xAxes:[{ticks:{fontSize:35}}]
        }
    }}></Bar><br/></div> : <h1></h1>;
      // const videoConstraints = {
      //   width: 1280,
      //   height: 720,
      //   facingMode: "user"
      
      // };
      // let imgg = this.state.img != "" ? <img src={this.state.img}></img>:<span></span>;
      return (
        <div>
        <div className="div-messege">
        
          {/* <Webcam
            audio={false}
            // height={350}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            // width={350}
            videoConstraints={videoConstraints}
          /> */}
          <span className="border border-success">
          <MessageList messages={this.state.messages} />
          {/* <MessageForm onMessageSend={function(){
            this.handleNewMessage;
            this.capture
          }} /> */}
          <MessageForm onMessageSend={this.handleNewMessage} />
          {/* <button onClick={this.capture}>Capture photo</button> */}
          {/* {imgg} */}
          </span>
        </div>
        <div className="div-chart">
          {emotionBarChart}
        </div>
        </div>
      );
    }
  }


const mapDispatchToProps = (dispatch) => ({

  startAddEmotion: (data)=> dispatch(startAddEmotion(data)),
  receivedEmotion: (data)=>dispatch(receivedEmotion(data))
});

const mapStateToProps = (state) => {
  console.log("state",state);
  return {
    emotion: state.pureEmotion,
    receivedEmotionState: state.receivedEmotion
    
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(App);