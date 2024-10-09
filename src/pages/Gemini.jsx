import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";
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
import { getGeminiChatCompletion } from "@/lib/gemini";

const models = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro-002",
];

const Gemini = () => {
  const [model, setModel] = useState(models[0]);
  const [answer, setAnswer] = useState(null);
  const [system, setSystem] = useState("");
  const [content, setContent] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [endCmd, setEndCmd] = useState("");

  useEffect(() => {
    browser.storage.local.get(["system", "gemini_model", "endCmd"]).then((res) => {
      setSystem(res.system ?? "You are a helpful assistant");
      setEndCmd(res.endCmd ?? "");
      setModel(res.gemini_model ?? models[0]);
    });
  }, []);

  const handleSubmit = async () => {
    setAnswer(null);

    browser.storage.local.set({ system, gemini_model: model, endCmd });

    if (content.trim() === "" || model.trim() === "") {
      toast.error("Content and Model is required!", { position: "top-center" });
      return;
    }

    setDisabled(true);

    toast.promise(
      getGeminiChatCompletion(content.trim() + endCmd, model, system.trim()),
      {
        loading: "Generating answer ...",
        success: (res) => {
          setAnswer({
            content: res.response.text() || "",
            model: res?.model ?? model,
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
      <div className="flex justify-center items-center gap-2 ">
        <Select value={model} onValueChange={(v) => setModel(v)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Model</SelectLabel>
              {models?.map((curModel) => (
                <SelectItem key={curModel} value={curModel}>
                  {curModel}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={endCmd} onValueChange={(v) => setEndCmd(v)}>
          <SelectTrigger className="w-[250px]">
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
        <Card className="text-lg mt-1">
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="whitespace-nowrap flex-1">{answer?.model}</div>
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

export default Gemini;
