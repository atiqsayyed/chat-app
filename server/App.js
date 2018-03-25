const WebSocket = require('ws')
const Option = require('scala-like-option')
const Immutable = require('immutable')

const wss = new WebSocket.Server({ port: 8989 })

// Map[user, {Option(socket), channels}]
let users = Immutable.Map([])

const beginningOfChannel = (name) => ({ message: 'beginning of '+ name + ' :', author: '' })
const privateChatBeginning = Immutable.List([{ message: 'beginning of private chat :', author: '' }])

// Map[channel, {users, messages}]
let channels = Immutable.Map([
    ['general', {users: Immutable.List(), messages: Immutable.List([beginningOfChannel('general')])}],
    ['react', {users: Immutable.List(), messages: Immutable.List([beginningOfChannel('react')])}]
])

let privateChats = Immutable.Map([Immutable.Set(), Immutable.List()])
//[{ message: 'beginning of private chat :'}]

//Map[socket, user]
let sockets = Immutable.Map([])

const ADD_MESSAGE = 'ADD_MESSAGE'
const ADD_USER = 'ADD_USER'
const USERS_LIST = 'USERS_LIST'
const CHANNELS_LIST = 'CHANNELS_LIST'
const CREATE_CHANNEL = 'CREATE_CHANNEL'
const JOIN_CHANNEL = 'JOIN_CHANNEL'
const VIEW_CHANNEL = 'VIEW_CHANNEL'
const VIEW_CHAT = 'VIEW_CHAT'
const REQUEST_USER_CHAT = 'REQUEST_USER_CHAT'

const broadcast = (data, ws) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify(data))
        }
    })
}

const unicast = (data, ws) => {
    if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify(data))
}

const addUser = (data, ws) => {
    let existingChannels = users.get(data.name, {channels: Immutable.List()}).channels
    let subscribedChannels = existingChannels.push(data.name)
    let opt = Option.Option(ws)
    if (data.name !== null) {
        users = users.set(data.name, {socket: opt, channels: subscribedChannels})
        sockets = sockets.set(ws, data.name)
    }
    let index = 0
    broadcast({
        type: USERS_LIST,
        users: Array.from(users.keys()).map(user => ({ id: index++ , name: user}))
    }, '')

    unicast({
        type: CHANNELS_LIST,
        channels: Array.from(channels.keys())
    }, ws)

}

function addMessageToPrivateChat(data) {
    let key = Immutable.Set([data.author, data.channel])
    let value = privateChats.get(key, privateChatBeginning)
    privateChats = privateChats.set(key, value.push({message: data.message, author: data.author}))
    users.get(data.channel).socket.map(s => {
        if (data.channel !== data.author) {
            data.channel = data.author
            unicast(data, s)
        }
    })
}

function addMessageToPublicChannel(data, ws) {
    let currentUsersAndMessages = channels.get(data.channel)
    let usersAndMessages = currentUsersAndMessages === undefined ?
        {
            users: Immutable.List(data.author), messages:
            Immutable.List([beginningOfChannel(data.channel), {message: data.message, author: data.author}])
        } :
        {
            users: currentUsersAndMessages.users,
            messages: currentUsersAndMessages.messages.push({message: data.message, author: data.author})
        }
    channels = channels.set(data.channel, usersAndMessages)
    broadcast(data, ws)
}

const addMessage = (data, ws) => {
    if (data.channelType === 'PRIVATE_CHANNEL') {
        addMessageToPrivateChat(data);
    } else {
        addMessageToPublicChannel(data, ws);
    }
}

const sendUsers = (data, ws) => {
    unicast({type: USERS_LIST, users: Array.from(users.keys())}, ws)
}

const sendChannels = (data, ws) => {
    let id = 0
    unicast({type: CHANNELS_LIST, channels: Array.from(channels.keys()).map(ch => ({name: ch, id: id++})) }, ws)
}

const viewChannel = (data, ws) => {
    unicast({type: VIEW_CHANNEL, messages: Array.from(channels.get(data.channel).messages), name: data.channel}, ws)
}


const viewChat = (data, ws) => {
    let key = Immutable.Set([data.name, data.username])
    let value = privateChats.get(key, privateChatBeginning)

    unicast({
        type: VIEW_CHAT,
        name: data.name,
        username: data.username,
        messages: Array.from(value)
    }, ws)
    console.log("**** viewChat")
}

const createChannel = (data, ws) => {
    let ch = channels.get(data.name, {users: Immutable.List(data.author),
        messages: Immutable.List([beginningOfChannel(data.name)])})
    channels = channels.set(data.name, ch)
    let id = 0
    broadcast({
        type: CHANNELS_LIST,
        channels: Array.from(channels.keys()).map(ch => ({name: ch, id: id++}))
    }, '')
}

const joinChannel = (data, ws) => {
    let channel = channels.get(data.channel)
    channels = channels.set(data.channel, {users: channel.users.push(data.author), messages: channel.messages})
    let user = users.get(data.author)
    let socketAndChannels = { socket: user.socket, channels: user.channels.push(data.channel)}
    users = users.set(data.author, socketAndChannels)
    viewChannel(data, ws)
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message)
        switch (data.type) {
            case ADD_USER:
                addUser(data, ws);
                break
            case ADD_MESSAGE:
                addMessage(data, ws);
                break
            case USERS_LIST:
                sendUsers(data, ws)
                break
            case CHANNELS_LIST:
                sendChannels(data, ws)
                break
            case CREATE_CHANNEL:
                createChannel(data, ws)
                break
            case JOIN_CHANNEL:
                joinChannel(data, ws)
                break
            case VIEW_CHANNEL:
                viewChannel(data, ws)
                break
            case REQUEST_USER_CHAT:
                console.log("****8 Request user chat")
                viewChat(data, ws)
                break
            default:
                break
        }
    })

    function removeUser(ws) {
        let user = sockets.get(ws)
        sockets = sockets.remove(ws)
        let socketAndChannels = users.get(user)
        if (socketAndChannels !== undefined) {
            let channels = socketAndChannels.channels
            users = users.set(user, {socket: Option.None(), channels: channels})
        }
    }

    ws.on('close', () => {
        removeUser(ws)
    })


    ws.on('error',() => {
        removeUser(ws)
    })
})