import {RECEIVED_EMOTION} from '../action-types'

export const receivedEmotion = (data={})=>({
    type: RECEIVED_EMOTION,
    data
})