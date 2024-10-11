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
import { deleteReply, fetchAndSet } from "@/lib/db";
import { toast } from "sonner";
import useData from "@/hooks/useData";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Reply = ({ reply }) => {
  const { reload } = useData();
  const navigate = useNavigate();

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
              onClick={() => {
                navigate(`/update/${reply.$id}`);
              }}
            >
              <Pencil />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={
                    "relative size-7 text-foreground hover:bg-accent [&_svg]:size-4"
                  }
                >
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    it from database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      toast.promise(deleteReply(reply.$id), {
                        loading: "Deleting reply from db ...",
                        success: (res) => {
                          setTimeout(async () => {
                            await reload(true);
                          }, 100);
                          return "Reply deleted successfully";
                        },
                        error: "Error: unable to delete reply",
                      });
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

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
