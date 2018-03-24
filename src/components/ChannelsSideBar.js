import React from "react";
import PropTypes from "prop-types";

const ChannelsSidebar = (props) => {

  const onclick = (channelName) => {
    props.dispatch(channelName);
  }

  return (
    <aside id="sidebar" className="sidebar">
      <h2>Channels</h2>
      <ul>
        {props.channels.map(channel => (
          <li key={channel.id}>
            <a href='#' onClick={() => onclick(channel.name)}>{channel.name}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}


ChannelsSidebar.propTypes = {
  channels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired
}

export default ChannelsSidebar;