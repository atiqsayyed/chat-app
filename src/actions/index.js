import * as types from '../constants/ActionTypes';

let nextMessageId=0
let nextUserId=0
let nextChannelId =0

export const addMessage = (message, author, channel, channelType) => ({
    type: types.ADD_MESSAGE,
    id: nextMessageId + 1,
    message,
    author,
    channel,
    channelType
});

export const addUser = name => ({
    type: types.ADD_USER,
    id: nextUserId++,
    name
});

export const messageReceived = (message, author, channel) => ({
    type: types.MESSAGE_RECEIVED,
    id: nextMessageId++,
    message,
    author,
    channel
});

export const populateUserList = users =>({
    type: types.USERS_LIST,
    users
});

export const createChannel = (author, name) => ({
    type: types.CREATE_CHANNEL,
    id: nextChannelId + 1,
    name,
    author
});

export const requestChannelMessages = (channelName) => ({
    type: types.REQUEST_CHANNEL_MESSAGES,
    name: channelName
})

export const populateChannelsList = channels => ({
    type: types.CHANNELS_LIST,
    channels: channels
})

export const joinChannel = (author, name) => ({
    type: types.JOIN_CHANNEL,
    name,
    author
})

export const viewChannel = (channelName, messages) => ({
    type: types.VIEW_CHANNEL,
    channel: channelName,
    messages: messages
})

export const requestUserChat = (name, username) => ({
    type: types.REQUEST_USER_CHAT,
    name: name,
    username: username,
})
