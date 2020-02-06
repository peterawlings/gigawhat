const Search = ({ updateSearch }) => {
  // const [state, updateState] = useState({});

  // console.log({ props });
  // const handleSubmit = e => {
  //   e.preventDefault();
  // };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <label htmlFor="all">
        All
        <input id="all" type="checkbox" value="all" onChange={updateSearch} />
      </label>
      <label htmlFor="hiphop">
        HipHop
        <input
          id="hiphop"
          type="checkbox"
          value="hiphop"
          onChange={updateSearch}
        />
      </label>
      <label htmlFor="funkSoul">
        Funk/Soul
        <input
          id="funkSoul"
          type="checkbox"
          value="funkSoul"
          onChange={updateSearch}
        />
      </label>
      <label htmlFor="house">
        House
        <input
          id="house"
          type="checkbox"
          value="house"
          onChange={updateSearch}
        />
      </label>
      <label htmlFor="disco">
        Disco
        <input
          id="disco"
          type="checkbox"
          value="disco"
          onChange={updateSearch}
        />
      </label>
      <button type="submit">Search Near Me</button>
    </form>
  );
};

export default Search;
