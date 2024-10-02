import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CopyButton } from "./ui/copy-button";
import { Button } from "./ui/button";
import { Info, Pencil, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatDate from "@/lib/formatDate";

const Reply = ({ reply }) => {
  return (
    <Card className="text-lg mt-1">
      <CardHeader className="px-4 pt-4 pb-1">
        <CardTitle className="flex items-center justify-between gap-2">
          <ScrollArea className="whitespace-nowrap flex-1">
            {reply.tags.map((tag, idx) => (
              <Badge
                key={tag + idx}
                className="text-sm mr-2"
                variant="secondary"
              >
                {"#" + tag}
              </Badge>
            ))}
            <ScrollBar className="-z-10" orientation="horizontal" />
          </ScrollArea>
          <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formatDate(reply.$updatedAt)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              size="icon"
              variant="ghost"
              className={
                "ml-1 relative size-7 text-foreground hover:bg-accent [&_svg]:size-4"
              }
            >
              <Pencil />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={
                "relative size-7 text-foreground hover:bg-accent [&_svg]:size-4"
              }
            >
              <Trash />
            </Button>
            <CopyButton value={reply.content} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <p className="whitespace-pre-line">{reply.content}</p>
      </CardContent>
    </Card>
  );
};

export default Reply;
