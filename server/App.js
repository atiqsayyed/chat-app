
const WebSocket = require('ws')
const Immutable = require('immutable')

const websocketServer = new WebSocket.Server({port:8989});

const users = [];
const CREATE_CHANNEL = 'CREATE_CHANNEL'
const VIEW_CHANNEL = 'VIEW_CHANNEL'

let channels = Immutable.Map([
    ['general', {users: Immutable.List(), messages: Immutable.List(["Hello"])}]
])

const userChannelsMap = Immutable.Map([])
const channelUsersMap = Immutable.Map([])
const userSocketMap = Immutable.Map([])

const sendMessageToAllUsers = (data, ws) =>{
    websocketServer.clients.forEach((client)=>{
        if(client.readyState === WebSocket.OPEN && client !== ws){
            client.send(JSON.stringify(data))
        }
    });
};

const sendMessageToConnectedSocket = (data, ws) => {
    if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify(data))
}

const createChannel = (data, ws) => {
    console.log("******: "+JSON.stringify(data))
    let ch = channels.get(data.name, {users: Immutable.List(data.author),
        messages: Immutable.List()})
    channels = channels.set(data.name, ch)
    console.log("Channel created: "+JSON.stringify(data))
    let id = 0;
    sendMessageToAllUsers({
        type: 'CHANNELS_LIST',
        channels: Array.from(channels.keys()).map(ch => ({name: ch, id: id++}))
    }, '');
}
const viewChannel = (data, ws) => {
    sendMessageToConnectedSocket({type: VIEW_CHANNEL, messages: Array.from(channels.get(data.channel).messages), name: data.channel}, ws)
}

const joinChannel = (data,ws) => {
    let subscribedChannels = userChannelsMap.get(data.author)
    userChannelsMap.set(users,subscribedChannels.push(data.channel))
    let subscribedUsers = channelUsersMap.get(data.channel)
    subscribedChannels.set(data.channel, subscribedUsers.push(data.author))
    console.log("**** channel joined"+JSON.stringify(data))
    // viewChannel(data, ws)
}


websocketServer.on('connection', (ws) =>{
    let index;
    ws.on('message',(message)=>{
        const data = JSON.parse(message);
        switch (data.type){
            case 'ADD_USER':{
                console.log("******* "+JSON.stringify(data));
                index = users.length;
                users.push({name:data.name, id:index+1});
                userSocketMap.set(data.name, ws);
                ws.send(JSON.stringify({
                    type: 'USERS_LIST',
                    users
                }));
                sendMessageToAllUsers({
                    type: 'USERS_LIST',
                    users
                }, ws);
                break;
            }
            case 'ADD_MESSAGE': {
                sendMessageToAllUsers({
                    type:'ADD_MESSAGE',
                    message: data.message,
                    author:data.author
                }, ws);
                break;
            }
            case CREATE_CHANNEL :{
              createChannel(data,ws);
              break;
            }
            case 'JOIN_CHANNEL':{
                joinChannel(data, ws)
            }
            default:
                break;
        }
    });

    ws.on('close', ()=>{
        users.splice(index,1);
        sendMessageToAllUsers({
            type:'USERS_LIST',
            users
        });
    });
});

