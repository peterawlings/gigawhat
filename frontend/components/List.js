import React from "react";

const List = ({ list }) => {
  return (
    <div>
      {list.map(listing => (
        <div>{listing.venue}</div>
      ))}
    </div>
  );
};

export default List;
