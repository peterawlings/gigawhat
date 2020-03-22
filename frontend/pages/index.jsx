import React, { useState } from "react";
import useSWR from "swr";
import List from "../components/List";
import Search from "../components/Search";
import fetcher from "../utils/fetch";

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
  const { data, error } = useSWR("data?genre/", fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <>
      <div>Test</div>
      <Search updateSearch={handleChange} />
      <List list={data} />
    </>
  );
};

export default Index;
