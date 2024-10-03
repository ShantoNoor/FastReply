import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addReply, fetchAndSet } from "@/lib/db";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Add = () => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (content.trim() === "" || tags.trim() === "") {
      toast.error("Content and Tags are required!", {
        position: "top-center",
      });
      return;
    }

    const document = {
      content: content.trim(),
      tags: tags.split(",").reduce((acc, cur) => {
        const tag = cur.trim();
        if (tag.length > 0) acc.push(tag);
        return acc;
      }, []),
    };

    toast.promise(addReply(document), {
      loading: "Adding reply to db ...",
      success: () => {
        setTimeout(async () => {
          await fetchAndSet();
          navigate("/");
        }, 100);
        return "Reply added successfully";
      },
      error: "Error: unable to add reply",
      position: "top-center",
    });
  };

  return (
    <div className="space-y-2">
      <Textarea
        className="mt-1"
        rows="16"
        placeholder="Write Content/Reply here ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Textarea
        rows="4"
        placeholder="Write Tags here ( Separated by , ) ..."
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        required
      />
      <Button className="w-full" onClick={handleSubmit}>
        <PlusCircle className="size-4 mr-1" />
        <span>Add</span>
      </Button>
    </div>
  );
};

export default Add;
