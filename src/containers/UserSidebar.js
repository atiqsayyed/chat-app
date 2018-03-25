import { connect } from 'react-redux'
import SidebarComponent from '../components/UserSidebar'
import {requestUserChat} from "../actions";

const mapDispatchToProps = dispatch => ({
    dispatch: (name, username) => {
        dispatch(requestUserChat(name, username))
    }
})

export const UserSidebar = connect(state => ({
    users: state.users
}), mapDispatchToProps)(SidebarComponent)