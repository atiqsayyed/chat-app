import React from 'react';
import PropTypes from 'prop-types';

const CreateChannel = (props) => {
  const username = props.username;
  let input

  return (
    <section id="new-channel">
      <h6>Create new channel:</h6>
      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            props.dispatch(username, input.value)
            input.value = ''
          }
        }}
        type="text"
        ref={(node) => {
          input = node
        }}
      />
    </section>
  )
}

CreateChannel.propTypes = {
  username: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default CreateChannel