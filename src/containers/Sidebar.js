import { connect } from 'react-redux'
import SidebarComponent from '../components/Sidebar'
import {requestUserChat} from "../actions";

const mapDispatchToProps = dispatch => ({
    dispatch: (name, username) => {
        dispatch(requestUserChat(name, username))
    }
})

export const Sidebar = connect(state => ({
    users: state.users.filter(user => user.name != null)
}), mapDispatchToProps)(SidebarComponent)