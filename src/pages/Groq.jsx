import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";
import { getGroqChatCompletion, getModels } from "@/lib/groq";
import { MessageSquareShare } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import browser from "webextension-polyfill";
import { endCmds } from "@/lib/data";

const Groq = () => {
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [system, setSystem] = useState("");
  const [content, setContent] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [endCmd, setEndCmd] = useState("");

  useEffect(() => {
    getModels().then((allModels) => {
      setModels(allModels.data);
      browser.storage.local.get(["groq_model"]).then((res) => {
        setModel(res.groq_model ?? allModels.data[0].id);
      });
    });

    browser.storage.local.get(["system", "endCmd"]).then((res) => {
      setSystem(res.system ?? "You are a helpful assistant");
      setEndCmd(res.endCmd ?? "");
    });
  }, []);

  const handleSubmit = async () => {
    setAnswer(null);

    browser.storage.local.set({ system, groq_model: model, endCmd });

    if (content.trim() === "" || model.trim() === "") {
      toast.error("Content and Model is required!", { position: "top-center" });
      return;
    }

    setDisabled(true);

    toast.promise(
      getGroqChatCompletion(content.trim() + endCmd, model, system.trim()),
      {
        loading: "Generating answer ...",
        success: (res) => {
          setAnswer({
            content: res.choices[0]?.message?.content || "",
            model: res.model,
          });
          setDisabled(false);
          return "Generated answer successfully";
        },
        error: () => {
          setDisabled(false);
          return "Error: unable to generate answer";
        },
        position: "top-center",
      }
    );
  };

  return (
    <div className="space-y-2">
      <Textarea
        className="mt-1"
        placeholder="System Prompt ..."
        value={system}
        onChange={(e) => setSystem(e.target.value)}
        required
      />
      <Textarea
        placeholder="User Prompt ..."
        value={content}
        rows="5"
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="flex flex-col gap-2 ">
        <Select value={model} onValueChange={(v) => setModel(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Model</SelectLabel>
              {models?.map((curModel) => (
                <SelectItem
                  key={curModel.id}
                  value={curModel.id}
                >{`${curModel.id} (${curModel.owned_by})`}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={endCmd} onValueChange={(v) => setEndCmd(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Ending" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Ending</SelectLabel>
              {endCmds?.map((curCmd) => (
                <SelectItem key={curCmd.id} value={curCmd.value}>{`${
                  curCmd.value === " " ? "None" : curCmd.value
                }`}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={handleSubmit} disabled={disabled}>
          <MessageSquareShare className="size-4 mr-1" />
          <span>Generate</span>
        </Button>
      </div>
      {answer && (
        <Card className="text-lg mt-1" key={answer.model}>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="whitespace-nowrap flex-1">{answer.model}</div>
              <CopyButton value={answer.content} />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <p className="whitespace-pre-line">{answer.content}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Groq;
