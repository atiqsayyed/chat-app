import { connect } from 'react-redux'
import ChannelsSidebarComponent from '../components/ChannelsSideBar'
import { requestChannelMessages } from "../actions";


const mapDispatchToProps = dispatch => ({
    dispatch: (channel) => {
        dispatch(requestChannelMessages(channel))
    }
})

export const ChannelsSidebar = connect(state => ({
    channels: state.channels
}), mapDispatchToProps)(ChannelsSidebarComponent)