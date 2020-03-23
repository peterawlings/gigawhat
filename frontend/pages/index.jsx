import React, { useState } from "react";
import useSWR from "swr";
import List from "../components/List";
import Search from "../components/Search";
import fetcher from "../utils/fetch";

const Index = () => {
  const [state, updateState] = useState("funk");

  const handleChange = e => {
    updateState(e.target.value);
  };

  const { data, error } = useSWR(state, fetcher);
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
