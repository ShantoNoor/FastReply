import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useData from "@/hooks/useData";
import { fetchAndSet, updateReply } from "@/lib/db";
import { ListCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Update = () => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { filteredReplies: replies } = useData();

  useEffect(() => {
    const reply = replies.find((reply) => reply.$id === id);
    if (!reply) {
      navigate("/replies");
      return;
    }
    setContent(reply.content);
    setTags(reply.tags.join(", "));
  }, []);

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

    toast.promise(updateReply(id, document), {
      loading: "Updating reply to db ...",
      success: () => {
        setTimeout(async () => {
          await fetchAndSet();
          navigate("/replies");
        }, 100);
        return "Reply updated successfully";
      },
      error: "Error: unable to update reply",
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
        <ListCheck className="size-4 mr-1" />
        <span>Update</span>
      </Button>
    </div>
  );
};

export default Update;
