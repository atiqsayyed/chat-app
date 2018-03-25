import { takeEvery } from 'redux-saga/effects';
import * as types from '../constants/ActionTypes';

const sendMessageToServer = function* sendMessageToServer(params){
    yield takeEvery(types.ADD_MESSAGE, (action)=>{
        action.author = params.username
        params.socket.send(JSON.stringify(action));
    });
};

const createChannel = function* createChannel(params) {
    yield takeEvery(types.CREATE_CHANNEL, (action) => {
        action.author = params.username;
        params.socket.send(JSON.stringify(action));
    });
}

const manageChannelSwitch= function* manageChannelSwith(params) {
    yield takeEvery(types.JOIN_PERSONAL_CHAT, (action) => {
        action.author = params.username
        params.socket.send(JSON.stringify({
            type: types.JOIN_PERSONAL_CHAT,
            name: action.name,
            username: action.username
        }))
    })
    yield takeEvery(types.REQUEST_CHANNEL_MESSAGES, (action) => {
        action.author = params.username
        console.log("In ManageChannelSwitch"+params.username)
        params.socket.send(JSON.stringify({
            type: types.VIEW_CHANNEL,
            name: action.name,
            channel: action.name
        }))
    });
}

export {sendMessageToServer,createChannel,manageChannelSwitch};