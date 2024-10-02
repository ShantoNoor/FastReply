import * as React from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";

export function CopyButton({ value, variant = "ghost", className }) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <Button
      size="icon"
      variant={variant}
      className={
        "relative size-7 text-foreground hover:bg-accent [&_svg]:size-4"
      }
      onClick={() => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
        toast.success("Copied");
      }}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}
