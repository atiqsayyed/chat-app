import {connect} from 'react-redux';
import CreateChannelComponent from '../components/CreateChannel';
import {createChannel} from '../actions';

const mapDispatchToProps = dispatch => ({
  dispatch: (author, channel) => {
    dispatch(createChannel(author, channel))
  }
})

export const CreateChannel = connect(() => ({}), mapDispatchToProps)(CreateChannelComponent)
