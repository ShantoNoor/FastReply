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
      replies.filter((reply) =>
        JSON.stringify(reply).toLowerCase().includes(filter.toLowerCase())
      )
    );
    console.log("setFilteredReplies");
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

  const reload = async () => {
    setLoading(true);
    const res = await fetchAndSet();
    setReplies(res ?? []);
    setLoading(false);
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
