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

export {sendMessageToServer,createChannel};