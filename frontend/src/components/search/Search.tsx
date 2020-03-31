import React, { useState } from "react";
import useSWR from "swr";
import List from "../list";
import fetcher from "../../utils/fetch";

const options = ["Hip Hop", "House", "Funk / Soul", "Disco"];

const Search = () => {
  const [state, updateState] = useState({
    checkboxes: options.reduce(
      (optionsAgg, option) => ({
        ...optionsAgg,
        [option]: {
          label: option,
          checked: false
        }
      }),
      {}
    )
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log({ state });
    updateState({
      ...state,
      checkboxes: {
        ...state.checkboxes,
        [e.target.value]: {
          label: e.target.value,
          checked: !state.checkboxes[e.target.value].checked
        }
      }
    });
  };

  const createCheckbox = (option: any) => (
    <label htmlFor={state.checkboxes[option].label}>
      {state.checkboxes[option].label}
      <input
        id={state.checkboxes[option].label}
        type="checkbox"
        value={state.checkboxes[option].label}
        checked={state.checkboxes[option].checked}
        onChange={handleChange}
      />
    </label>
  );

  const stringCleanup = (string: string) =>
    string.toLowerCase().replace(/\W/g, "");

  const sortParams = (checkboxes: any) => {
    const filters = Object.keys(checkboxes).filter(
      checkbox => state.checkboxes[checkbox].checked
    );
    const reduce = filters.reduce((acc, filter) => {
      return acc === ""
        ? `${acc}?genre=${stringCleanup(filter)}`
        : `${acc}&genre=${stringCleanup(filter)}`;
    }, "");
    return reduce;
  };

  const queryParams = sortParams(state.checkboxes).length
    ? sortParams(state.checkboxes)
    : "All";

  const { data, error } = useSWR(queryParams, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <>
      <div>Test</div>
      <form onSubmit={e => e.preventDefault()}>
        {options.map(option => createCheckbox(option))}
        <button type="submit">Search Near Me</button>
      </form>
      <List list={data} />
    </>
  );
};

export default Search;