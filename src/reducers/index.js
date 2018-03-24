import { combineReducers } from "redux"
import messages from "./messages"
import users from "./users"
import channels from "./channels"

const chat = combineReducers({
    users,
    messages,
    channels
});

export default chat