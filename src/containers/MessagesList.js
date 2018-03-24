import { connect } from 'react-redux'
import MessagesListComponent from '../components/MessagesList'

export const MessagesList = connect(state => ({
    channel: state.channel,
    messages: state.messages
}), {})(MessagesListComponent)