import Reply from "@/components/Reply";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import useData from "@/hooks/useData";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"

const Root = () => {
  const { getRepliesFromStorage, filteredReplies, loading, filter, setFilter } = useData();

  useEffect(() => {
    getRepliesFromStorage();
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <div className="sticky top-0 z-10 border-t-[1px] border-t-background"></div>
      <Input className="sticky top-[1px] z-10 bg-accent shadow" type="search" placeholder="Search here ..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ScrollArea>
        {filteredReplies.map((reply) => (
          <Reply key={reply.$id} reply={reply} />
        ))}
      </ScrollArea>
    </>
  );
};

export default Root;
