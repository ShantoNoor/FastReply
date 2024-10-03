import { fetchAndSet } from "@/lib/db";
import { createContext, useEffect, useState } from "react";
import browser from "webextension-polyfill";

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [filteredReplies, setFilteredReplies] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setFilteredReplies(
      replies.reduce((acc, cur) => {
        filter
          .toLowerCase()
          .split(" ")
          .forEach((curFilter) => {
            if (
              !acc.includes(cur) &&
              JSON.stringify(cur).toLowerCase().includes(curFilter)
            ) {
              acc.push(cur);
            }
          });
        return acc;
      }, [])
    );
  }, [replies, setFilteredReplies, filter]);

  const getRepliesFromStorage = async () => {
    setLoading(true);
    try {
      const result = await browser.storage.local.get(["replies"]);
      setReplies(result.replies ?? []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const reload = async (noLoading = false) => {
    if (!noLoading) setLoading(true);
    const res = await fetchAndSet();
    setReplies(res ?? []);
    if (!noLoading) setLoading(false);
  };

  return (
    <DataContext.Provider
      value={{
        filteredReplies,
        getRepliesFromStorage,
        loading,
        reload,
        filter,
        setFilter,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
