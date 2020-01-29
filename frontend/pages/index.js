import fetch from "isomorphic-unfetch";
import Search from "../components/Search";
import List from "../components/List";

const Index = ({ data }) => {
  return (
    <>
      <Search />
      <List list={data} />
    </>
  );
};

Index.getInitialProps = async () => {
  const res = await fetch("http://localhost:3004/data");
  const data = await res.json();
  return {
    data
  };
};

export default Index;
