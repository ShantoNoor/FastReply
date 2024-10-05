import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";
import { getGroqChatCompletion } from "@/lib/groq";
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

const endCmds = [
  { id: 1, value: "\nrewrite this in bangla. keep it short." },
  { id: 2, value: "\nrewrite this formally. keep it short." },
];

const Groq = () => {
  // const [model, setModel] = useState("llama-3.2-90b-text-preview");
  const [models, setModels] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [system, setSystem] = useState([]);
  const [content, setContent] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [endCmd, setEndCmd] = useState(endCmds[0].value);

  useEffect(() => {
    setModels(getJSON());
    browser.storage.local
      .get(["system"])
      .then((res) => setSystem(res.system ?? "You are a helpful assistant"));
  }, []);

  const handleSubmit = async () => {
    setAnswer((prev) => []);

    if (content.trim() === "") {
      toast.error("Content is required!", { position: "top-center" });
      return;
    }

    browser.storage.local.set({ system });

    setDisabled(true);

    models.forEach((curModel) => {
      toast.promise(
        getGroqChatCompletion(
          content.trim() + endCmd,
          curModel.id,
          system.trim()
        ),
        {
          loading: "Generating answer ...",
          success: (res) => {
            setAnswer((prev) => [
              ...prev,
              {
                content: res.choices[0]?.message?.content || "",
                model: res.model,
              },
            ]);
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
    });
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
      <div className="flex justify-center items-center gap-2 ">
        {/* <Select value={model} onValueChange={(v) => setModel(v)}>
          <SelectTrigger className="w-[250px]">
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
        </Select> */}
        <Select value={endCmd} onValueChange={(v) => setEndCmd(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Ending" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Ending</SelectLabel>
              <SelectItem value={" "}>{`None`}</SelectItem>
              {endCmds?.map((curCmd) => (
                <SelectItem
                  key={curCmd.id}
                  value={curCmd.value}
                >{`${curCmd.value}`}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={handleSubmit} disabled={disabled}>
          <MessageSquareShare className="size-4 mr-1" />
          <span>Generate</span>
        </Button>
      </div>
      {answer?.length !== 0 &&
        answer.map((curAnswer) => (
          <Card className="text-lg mt-1" key={curAnswer.model}>
            <CardHeader className="px-4 pt-4 pb-1">
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="whitespace-nowrap flex-1">
                  {curAnswer.model}
                </div>
                <CopyButton value={curAnswer.content} />
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className="whitespace-pre-line">{curAnswer.content}</p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default Groq;

function getJSON() {
  return JSON.parse(`[
    {
      "id": "llama-3.2-90b-text-preview",
      "object": "model",
      "created": 1727285716,
      "owned_by": "Meta",
      "active": true,
      "context_window": 8192,
      "public_apps": null
    },
    {
      "id": "llama3-70b-8192",
      "object": "model",
      "created": 1693721698,
      "owned_by": "Meta",
      "active": true,
      "context_window": 8192,
      "public_apps": null
    },
    {
      "id": "llama-3.1-70b-versatile",
      "object": "model",
      "created": 1693721698,
      "owned_by": "Meta",
      "active": true,
      "context_window": 131072,
      "public_apps": null
    },
    {
      "id": "gemma2-9b-it",
      "object": "model",
      "created": 1693721698,
      "owned_by": "Google",
      "active": true,
      "context_window": 8192,
      "public_apps": null
    }
  ]`);
}
