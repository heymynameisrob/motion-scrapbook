import * as React from "react";
import { toast } from "sonner";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion } from "motion/react";
import {
  XCircleIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/16/solid";
import { GitBranch, GitMerge } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/popover";
import { Button } from "@/primitives/button";
import { Textarea } from "@/primitives/textarea";
import { Spinner } from "@/primitives/spinner";
import { cn } from "@/lib/utils";
import { useAnimationSpeed } from "@/components/motion-provider";

type View = "menu" | "approve" | "success";
type Context = {
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
} | null;

export const MutliStepPopoverContext = React.createContext<Context>(null);

function usePopover() {
  const context = React.useContext(MutliStepPopoverContext);
  if (context === null) {
    throw Error("Use the provider you jabroni");
  }
  return context;
}

export function MultiStepPopover() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [view, setView] = React.useState<View>("menu");
  const [ref, bounds] = useMeasure();
  const { speed } = useAnimationSpeed();

  const content = React.useMemo(() => {
    switch (view) {
      case "menu":
        return <MenuView />;
      case "approve":
        return <ApproveView />;
      case "success":
        return <SuccessView />;
    }
  }, [view]);

  React.useEffect(() => {
    if (view !== "success") return;
    const timeout = setTimeout(() => {
      setView("menu");
      setOpen(false);
      toast.success("Branch merged successfully");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [view, setView, setOpen]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="md"
          className="gap-2 data-[state=open]:bg-base-2 dark:data-[state=open]:bg-base-6"
        >
          <GitBranch className="w-4 h-4 opacity-70" />
          Review branch
          <ChevronDownIcon className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" onInteractOutside={() => setView("menu")}>
        <MutliStepPopoverContext.Provider value={{ setView, view }}>
          <motion.div
            animate={{
              height: bounds.height,
              transition: {
                duration: 0.3 * (1 / speed),
                ease: [0.25, 1, 0.5, 1],
              },
            }}
          >
            <div ref={ref}>
              <AnimatePresence initial={false} mode="popLayout" custom={view}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={view}
                  transition={{
                    duration: 0.3 * (1 / speed),
                    ease: [0.26, 0.08, 0.25, 1],
                  }}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </MutliStepPopoverContext.Provider>
      </PopoverContent>
    </Popover>
  );
}

function MenuView() {
  const { setView } = usePopover();

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-3 p-3 border-b">
        <p className="font-medium text-sm">#1104</p>
        <div className="flex items-center gap-1">
          <small className="font-mono text-xs text-red-800 bg-red-500/20 px-1.5 rounded dark:text-red-400">
            -140
          </small>
          <small className="font-mono text-xs text-green-800 bg-green-500/20 px-1.5 rounded dark:text-green-400">
            +38
          </small>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-1">
        <MenuButton onClick={() => setView("approve")}>
          <CheckCircleIcon className="w-4 h-4 opacity-70" />
          Approve changes
        </MenuButton>
        <MenuButton onClick={() => setView("menu")}>
          <ChatBubbleLeftIcon className="w-4 h-4 opacity-70" />
          Add a comment
        </MenuButton>
        <MenuButton
          onClick={() => setView("menu")}
          className="hover:text-red-700 dark:hover:text-red-400"
        >
          <XCircleIcon className="w-4 h-4 opacity-70" />
          Reject changes
        </MenuButton>
      </div>
    </div>
  );
}

function ApproveView() {
  const { setView } = usePopover();

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        setView("success");
      }
    },
    [setView],
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-3 p-3 border-b">
        <p className="font-medium text-sm">Approve changes</p>
        <div className="flex items-center gap-1">
          <small className="font-mono text-xs text-red-800 bg-red-500/20 px-1.5 rounded dark:text-red-400">
            -140
          </small>
          <small className="font-mono text-xs text-green-800 bg-green-500/20 px-1.5 rounded dark:text-green-400">
            +38
          </small>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <Textarea
          placeholder="Leave a comment"
          className="resize-none"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="primary"
          onClick={() => setView("success")}
          className="bg-purple-600 text-white gap-2"
        >
          <GitMerge className="w-4 h-4 opacity-70" />
          Merge and close
        </Button>
      </div>
    </div>
  );
}

function SuccessView() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 p-3 py-5">
      <Spinner className="w-6 h-6" />
      <div className="flex flex-col justify-center items-center gap-1">
        <h2 className="text-lg font-medium text-primary">Merging branch...</h2>
        <p className="text-sm text-center">bleep blorp, bleep</p>
      </div>
    </div>
  );
}

function MenuButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      data-vaul-no-drag=""
      className={cn(
        "flex h-9 w-full items-center select-none gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-transform focus active:scale-95",
        "hover:bg-black/10 dark:hover:bg-white/10 dark:hover:shadow-[inset_0px_1px_0px_hsla(0_,0%_,100%_,.02)_,inset_0px_0px_0px_1px_hsla(0_,0%_,100%_,.02)_,0px_1px_2px_rgba(0_,0_,0_,.12)_,0px_2px_4px_rgba(0_,0_,0_,.08)_,0px_0px_0px_0.5px_rgba(0_,0_,0_,.24)]",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
