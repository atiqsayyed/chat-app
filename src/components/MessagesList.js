import React from "react"
import PropTypes from "prop-types"
import Message from "./Message"

const MessagesList = (data) => (
    <div>
        <div className="name">{data.messages.channel}</div>
        <ol className={"chat"}>
            {data.messages.messages.map(message => (
                <Message
                    key={message.id}
                    {...message}
                />
            ))}
        </ol>
    </div>
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