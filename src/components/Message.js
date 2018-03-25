import React from "react"
import PropTypes from "prop-types"

const Message = ({ message, author }) => (
    <li className={"self"}>
        <div className={"msg"}>
            <p><b>{author}</b></p>
            <p>{message}</p>
        </div>
    </li>
);

Message.propTypes = {
    message: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired
}

export default Message