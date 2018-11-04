import {ADD_EMOTION} from '../action-types'
import axios from 'axios';

export const addEmotion = (data={})=>({
    type: ADD_EMOTION,
    data
})

export const startAddEmotion =(data)=>{
    return(dispatch,getState)=>{
        let uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect'
      
        
        let config = {
          headers: {'Content-Type': 'application/octet-stream',
                     'Ocp-Apim-Subscription-Key':'f86b477ee92e432096018c52d9d952f0' },
          params : {'returnFaceId' : 'true',
            'returnFaceLandmarks' : 'false',
            'returnFaceAttributes' : 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise' },
            
          }
          
          axios.post(uriBase,data,config).then((res)=>{
              console.log(res);
              dispatch(addEmotion(res));
            })
            
        
    };
};