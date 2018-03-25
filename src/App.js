import React, {Component} from "react";
import "./App.css";
import {UserSidebar} from "./containers/UserSidebar";
import {ChannelsSidebar} from "./containers/ChannelSidebar";
import {CreateChannel} from "./containers/CreateChannel";
import {MessagesList} from "./containers/MessagesList";
import {AddMessage} from "./containers/AddMessage";

class App extends Component {
    render() {
        const username = this.props.username;
        return (
            <div id="container">
                <section id="side">
                    <UserSidebar username={username}/>
                </section>
                <div className={"menu"}>
                    <MessagesList />
                </div>
                <AddMessage username={username}/>
                <section id="side-2">
                    <CreateChannel/>
                    <ChannelsSidebar/>
                </section>
            </div>
        );
    }
}
export default App;
