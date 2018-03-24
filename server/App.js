const WebSocket = require('ws')
const Immutable = require('immutable')

const websocketServer = new WebSocket.Server({port:8989});

const users = [];
const CREATE_CHANNEL = 'CREATE_CHANNEL'

let channels = Immutable.Map([
    ['general', {users: Immutable.List(), messages: Immutable.List([beginningOfChannel('general')])}],
    ['react', {users: Immutable.List(), messages: Immutable.List([beginningOfChannel('react')])}]
])

const sendMessageToAllUsers = (data, ws) =>{
    websocketServer.clients.forEach((client)=>{
        if(client.readyState === WebSocket.OPEN && client !== ws){
            client.send(JSON.stringify(data))
        }
    });
};

const addUser = (data, ws) => {
    index = users.length;
    users.push({name:data.name, id:index+1});
    ws.send(JSON.stringify({
        type: 'USERS_LIST',
        users
    }));
    sendMessageToAllUsers({
        type: 'USERS_LIST',
        users
    }, ws);
};

const createChannel = (data, ws) => {
    let ch = channels.get(data.name, {users: Immutable.List(data.author),
        messages: Immutable.List([beginningOfChannel(data.name)])})
    channels = channels.set(data.name, ch)
    let id = 0
    broadcast({
        type: CHANNELS_LIST,
        channels: Array.from(channels.keys()).map(ch => ({name: ch, id: id++}))
    }, '');
}


websocketServer.on('connection', (ws) =>{
    let index;
    ws.on('message',(message)=>{
        const data = JSON.parse(message);
        switch (data.type){
            case 'ADD_USER':{
                addUser();
                break;
            }
            case 'ADD_MESSAGE': sendMessageToAllUsers({
                type:'ADD_MESSAGE',
                message: data.message,
                author:data.author
            }, ws);
                break;
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

