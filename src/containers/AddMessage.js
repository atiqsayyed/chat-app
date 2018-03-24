import { connect } from 'react-redux'
import AddMessageComponent from '../components/AddMessage'
import { addMessage } from '../actions'

const mapDispatchToProps = dispatch => ({
    dispatch: (message, author, channel, channelType) => {
        dispatch(addMessage(message, author, channel, channelType))
    }
})

export const AddMessage = connect((state) => ({channel: state.messages.channel, channelType: state.messages.channelType}),
    mapDispatchToProps)(AddMessageComponent)
