import useSWR from "swr";
import Search from "../components/Search";
import List from "../components/List";
import fetcher from "../utils/fetch";
import { useState } from "react";

const Index = () => {
  const [state, updateState] = useState({});

  const handleChange = e => {
    const url = `?genre=${e.target.value}`;
    updateState({
      [e.target.value]: url
    });
    console.log({ url });

    // return updateSearch(state);
  };

  console.log(state);
  const { data, error } = useSWR(state.house, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <>
      <Search updateSearch={handleChange} />
      <List list={data} />
    </>
  );
};

export default Index;
