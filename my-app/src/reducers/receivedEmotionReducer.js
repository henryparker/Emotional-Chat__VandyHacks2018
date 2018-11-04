import {RECEIVED_EMOTION} from '../action-types';

export default ( state = {} ,action)=>{
    switch(action.type){
        case RECEIVED_EMOTION:
            return action.data;
        default:
            return state;
    }
};