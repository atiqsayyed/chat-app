import React from 'react'
import PropTypes from 'prop-types'

const CreateChannel = (props) => {
    const username = props.username;
    let input

    const createNewChannel = (event) =>{
        let channelName = input
        console.log("channel Name"+channelName)
        props.dispatch(username, channelName)
    }

    return (
        <section id="new-channel">
            <h6>Create Channel:</h6>
            <input
                onKeyPress={(e) => {
                    input = e.target.value
                }}
                type="text"
                ref={(node) => {
                    input = node
                }}
            />
            <button onClick={(e) => createNewChannel(e)}>JOIN</button>
        </section>
    )
}

CreateChannel.propTypes = {
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default CreateChannel