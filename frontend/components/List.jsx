import React from "react";

const List = ({ list }) => {
  return (
    <div>
      <ul>
        {list.map(listing => (
          <li>{`${listing.venue} + ${listing.artistName}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
