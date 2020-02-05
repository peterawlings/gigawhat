import React from "react";

const List = ({ list }) => {
  return (
    <div>
      <ul>
        {list.map(listing => (
          <li>{listing.venue}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
