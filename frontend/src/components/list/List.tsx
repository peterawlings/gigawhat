import React, { FunctionComponent } from "react";

interface gigData {
  id: number;
  genre: Array<string>;
  artistName: string;
  address: {
    street: string;
    suburb: string;
    postCode: number;
  };
  price: number;
  venue: string;
}

interface gigListProps {
  list: Array<gigData>;
}

const List: FunctionComponent<gigListProps> = ({ list }) => {
  return (
    <div>
      <ul data-testid="gigList-ul">
        {list.map((listing: any) => (
          <li key={listing.id}>{`${listing.venue} + ${listing.artistName}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
