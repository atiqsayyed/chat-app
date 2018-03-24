import * as types from '../constants/ActionTypes';

import {addUser, messageReceived, populateUserList, populateChannelsList, joinChannel} from "../actions/index";

const setUpSocket = (dispatch, username) =>{
    const socket = new WebSocket('ws://localhost:8989');

    socket.onopen = () =>{
        socket.send(JSON.stringify({
            type: types.ADD_USER,
            name: username
        }));
        socket.send(JSON.stringify({
            type: types.CHANNELS_LIST,
            name: username
        }));
    };

    socket.onmessage = (event) =>{
        const data = JSON.parse(event.data);
        switch (data.type){
            case types.ADD_MESSAGE:
                dispatch(messageReceived(data.message,data.author));
                break;
            case types.ADD_USER:
                dispatch(addUser(data.name));
                break;
            case types.USERS_LIST:
                dispatch(populateUserList(data.users));
                break;
            case types.CHANNELS_LIST:
                dispatch(populateChannelsList(data.channels))
                break
            case types.JOIN_CHANNEL:{
                console.log("*** IN sockeet dispatch *** "+JSON.stringify(data))
                dispatch(joinChannel((data.author, data.name)))
                break
            }
            default:
                break;
        }
    };
    return socket;
};

export default setUpSocket;