import {ADD_EMOTION} from '../action-types';

export default ( state = {} ,action)=>{
    switch(action.type){
        case ADD_EMOTION:
            return action.data.data;
        default:
            return state;
    }
};