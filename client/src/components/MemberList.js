import React from "react";
import "./MemberList.css";

function MemberList({ owner, members, onEditMembers }) {
  return (
    <div className="members">
      <div className="members-header">
        <h3>Owner: {owner}</h3>
        <span className="leave">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </span>
      </div>
      <h4>Members:</h4>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
      <button onClick={onEditMembers}>Edit Members</button>
    </div>
  );
}

export default MemberList;
