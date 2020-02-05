const Search = props => {
  console.log({ props });
  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <label htmlfor="all">
        All
        <input id="all" type="checkbox" />
      </label>
      <label htmlfor="all">
        HipHop
        <input id="all" type="checkbox" />
      </label>
      <label htmlfor="all">
        Funk/Soul
        <input id="all" type="checkbox" />
      </label>
      <label htmlfor="all">
        House
        <input id="all" type="checkbox" />
      </label>
      <label htmlfor="all">
        Disco
        <input id="all" type="checkbox" />
      </label>
      <button type="submit">Search Near Me</button>
    </form>
  );
};

export default Search;
