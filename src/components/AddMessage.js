import React from 'react'
import PropTypes from 'prop-types'

const AddMessage = (props) => {
    const username = props.username;
    let input

    return (
        <section id="new-message">
            <input className={"textarea"}
                placeholder="Enter your message here"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        props.dispatch(input.value, username, props.channel, props.channelType)
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

AddMessage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    channel: PropTypes.string.isRequired,
    channelType: PropTypes.string.isRequired,
}

export default AddMessage