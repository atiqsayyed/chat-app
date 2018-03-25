import React from "react"
import PropTypes from "prop-types"

const UserSidebar = (props) => {

    const onclick = (name, username) => {
        props.dispatch(name, username)
    }

    return (
        <aside id="sidebar" className="sidebar">
            <h2>Users</h2>
            <ul>
                {props.users.map(user => (
                    <li key={user.id}>
                        <a href='#' onClick={() => onclick(user.name, props.username)}>{user.name}</a>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
UserSidebar.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    dispatch: PropTypes.func.isRequired
}

export default UserSidebar