import { DataContext } from "@/components/DataProvider";
import { useContext } from "react";

const useData = () => {
  return useContext(DataContext);
};

export default useData;
