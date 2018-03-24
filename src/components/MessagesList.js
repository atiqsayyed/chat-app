import React from "react"
import PropTypes from "prop-types"
import Message from "./Message"

const MessagesList = (data) => (
    <section id="messages-list">
        <h2>{data.channel}</h2>
        <ul>
            {data.messages.messages.map(message => (
                <Message
                    key={message.id}
                    {...message}
                />
            ))}
        </ul>
    </section>
)

MessagesList.propTypes = {
    channel: PropTypes.string.isRequired,
    messages: PropTypes.shape({
        messages: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                message: PropTypes.string.isRequired,
                author: PropTypes.string.isRequired,
                channel: PropTypes.string.isRequired
            }).isRequired
        ).isRequired
    })
}

export default MessagesList