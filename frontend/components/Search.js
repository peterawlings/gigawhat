const Search = props => {
  console.log({ props });
  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Search;
