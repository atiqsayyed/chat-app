const WebSocket = require('ws')
const Immutable = require('immutable')

const webSocketServer = new WebSocket.Server({ port: 8989 })
let usersChannelMap = Immutable.Map([])
let channelsUserMap = Immutable.Map([
    ['general', {users: Immutable.List(), messages: Immutable.List([{ message: 'start chatting', author: '' }])}]
]);
let personalChats = Immutable.Map([Immutable.Set(), Immutable.List()])
let socketUserMap = Immutable.Map([])

const ADD_MESSAGE = 'ADD_MESSAGE'
const ADD_USER = 'ADD_USER'
const USERS_LIST = 'USERS_LIST'
const CHANNELS_LIST = 'CHANNELS_LIST'
const CREATE_CHANNEL = 'CREATE_CHANNEL'
const JOIN_CHANNEL = 'JOIN_CHANNEL'
const VIEW_CHANNEL = 'VIEW_CHANNEL'
const VIEW_CHAT = 'VIEW_CHAT'
const JOIN_PERSONAL_CHAT = 'JOIN_PERSONAL_CHAT'

webSocketServer.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log("*** data received"+message)
        const data = JSON.parse(message);
        switch (data.type) {
            case ADD_USER:
                addUser(data, ws);
                break;
            case ADD_MESSAGE:
                addMessageToChat(data, ws);
                break;
            case USERS_LIST:
                shareUsers(data, ws);
                break;
            case CHANNELS_LIST:
                shareChannels(data, ws);
                break;
            case CREATE_CHANNEL:
                createChannel(data, ws);
                break;
            case JOIN_CHANNEL:
                joinChannel(data, ws);
                break;
            case VIEW_CHANNEL:
                showChannelHistory(data, ws);
                break;
            case JOIN_PERSONAL_CHAT:
                console.log("****8 Request user chat")
                joinPersonalChat(data, ws);
                break;
            default:
                break
        }
    });

    function removeUser(ws) {
        let index=0;
        let user = socketUserMap.get(ws);
        usersChannelMap = usersChannelMap.delete(user);
        sendToAllConnectedUsers({
            type: USERS_LIST,
            users: Array.from(usersChannelMap.keys()).map(user => ({ id: index++ , name: user}))
        }, ws);
    }

    ws.on('close', () => {
        removeUser(ws);
    });
    ws.on('error',() => {
        removeUser(ws);
    })
});

const sendToAllConnectedUsers = (data, ws) => {
    webSocketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify(data))
        }
    })
};

const sendToUser = (data, ws) => {
    if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify(data))
};

const addUser = (data, ws) => {
    let currentChannels = usersChannelMap.get(data.name, {channels: Immutable.List()}).channels;
    let allUserChannels = currentChannels.push(data.name);
    console.log("*** Adding user"+data.name)
    if (data.name !== null) {
        usersChannelMap = usersChannelMap.set(data.name, {socket: ws, channels: allUserChannels})
        socketUserMap = socketUserMap.set(ws, data.name)
    }
    let index = 0;
    sendToAllConnectedUsers({
        type: USERS_LIST,
        users: Array.from(usersChannelMap.keys()).map(user => ({ id: index++ , name: user}))
    }, '');

    sendToUser({
        type: CHANNELS_LIST,
        channels: Array.from(channelsUserMap.keys())
    }, '')

};

const createChannel = (data, ws) => {
    let ch = channelsUserMap.get(data.name, {users: Immutable.List(data.author),
        messages: Immutable.List([])});
    channelsUserMap = channelsUserMap.set(data.name, ch);
    let id = 0;
    sendToAllConnectedUsers({
        type: CHANNELS_LIST,
        channels: Array.from(channelsUserMap.keys()).map(ch => ({name: ch, id: id++}))
    }, ws);
};

const joinChannel = (data, ws) => {
    let channel = channelsUserMap.get(data.channel)
    channelsUserMap = channelsUserMap.set(data.channel, {users: channel.users.push(data.author), messages: channel.messages})
    let user = usersChannelMap.get(data.author)
    let socketAndChannels = { socket: user.socket, channels: user.channels.push(data.channel)}
    usersChannelMap = usersChannelMap.set(data.author, socketAndChannels)
    showChannelHistory(data, ws)
};

function addMessageToPersonal(data) {
    let initialMsg = Immutable.List([{ message: 'start chatting', author: '' }])
    let key = Immutable.Set([data.author, data.channel])
    let value = personalChats.get(key, initialMsg)
    personalChats = personalChats.set(key, value.push({message: data.message, author: data.author}))
    if (data.channel !== data.author) {
        let socket = usersChannelMap.get(data.channel).socket
        data.channel = data.author
        sendToUser(data, socket)
    }
}

function addMessageToChannel(data, ws) {
    let currentUsersAndMessages = channelsUserMap.get(data.channel)
    let usersAndMessages = currentUsersAndMessages === undefined ?
        {
            users: Immutable.List(data.author), messages:
            Immutable.List([{message: data.message, author: data.author}])
        } :
        {
            users: currentUsersAndMessages.users,
            messages: currentUsersAndMessages.messages.push({message: data.message, author: data.author})
        }
    channelsUserMap = channelsUserMap.set(data.channel, usersAndMessages)
    sendToAllConnectedUsers(data, ws)
}

const addMessageToChat = (data, ws) => {
    if (data.channelType === 'PRIVATE_CHANNEL') {
        addMessageToPersonal(data);
    } else {
        addMessageToChannel(data, ws);
    }
}

const shareUsers = (data, ws) => {
    sendToUser({type: USERS_LIST, users: Array.from(usersChannelMap.keys())}, ws)
}

const shareChannels = (data, ws) => {
    let id = 0
    sendToUser({type: CHANNELS_LIST, channels: Array.from(channelsUserMap.keys()).map(ch => ({name: ch, id: id++})) }, ws)
}

const showChannelHistory = (data, ws) => {
    sendToUser({type: VIEW_CHANNEL, messages: Array.from(channelsUserMap.get(data.channel).messages), name: data.channel}, ws)
}

const joinPersonalChat = (data, ws) => {
    let initialMsg = Immutable.List([{ message: 'start chatting', author: '' }])
    let key = Immutable.Set([data.name, data.username])
    let value = personalChats.get(key, initialMsg)

    sendToUser({
        type: VIEW_CHAT,
        name: data.name,
        username: data.username,
        messages: Array.from(value)
    }, ws)
}