import React, {Component} from "react";
import "./App.css";
import {Sidebar} from "./containers/Sidebar";
import {ChannelsSidebar} from "./containers/ChannelSidebar";
import {CreateChannel} from "./containers/CreateChannel";
import {MessagesList} from "./containers/MessagesList";
import {AddMessage} from "./containers/AddMessage";

class App extends Component {
    render() {
        return (
            <div id="container">
                <section id="side">
                    <Sidebar />
                </section>
                <section id="main">
                    <MessagesList />
                    <AddMessage />
                </section>
                <section id="side-2">
                    <CreateChannel username={''}/>
                    <ChannelsSidebar/>
                </section>
            </div>
        );
    }
}
export default App;
