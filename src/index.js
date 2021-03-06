import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import setUpSocket from './sockets';
import {sendMessageToServer,createChannel, manageChannelSwitch} from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware));

class UserPage extends  React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({
            username: event.target.value
        });
    }
    renderChatApp(e) {
        const username= this.state.username;
        if(username === ""){
            alert("Name Cannot be blank!");
        }else{
            const socket = setUpSocket(store.dispatch,username);
            sagaMiddleware.run(sendMessageToServer,{socket, username});
            sagaMiddleware.run(createChannel,{socket, username});
            sagaMiddleware.run(manageChannelSwitch,{socket, username});

            ReactDOM.render(
                <Provider store={store}>
                    <App username={username}/>
                </Provider>, document.getElementById('root')
            );
        }
    }
    render() {
        return (
            <div id={"login"}>
                <input type='text' placeholder={"Please enter your name to login"} value={this.state.username} onChange={this.handleChange} />
                <button onClick={(e) => this.renderChatApp(e)}>Login</button>
            </div>
        );
    }
};

ReactDOM.render(
    <UserPage />, document.getElementById('root')
);

registerServiceWorker();
