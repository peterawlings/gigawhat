import React, { FunctionComponent } from "react";

interface ListProps {
  list: any;
}

const List: FunctionComponent<ListProps> = ({ list }) => {
  return (
    <div>
      <ul>
        {list.map((listing: any) => (
          <li>{`${listing.venue} + ${listing.artistName}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
