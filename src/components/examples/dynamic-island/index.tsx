import * as React from "react";
import { AnimatePresence, motion, MotionProps } from "motion/react";
import { Button } from "@/primitives/button";
import { DynamicIslandTimer } from "@/components/examples/dynamic-island/timer";

type View = "idle" | "timer";
type AnimationVariant = {
  scale: number;
  y: number;
  bounce: number;
};

type FloatingContentProps = {
  children: React.ReactNode;
  view: View;
};

type AnimationConfig = {
  layoutTransition: Omit<MotionProps["transition"], "type"> & {
    type: "spring";
  };
  contentTransition: Omit<MotionProps["transition"], "type"> & {
    type: "spring";
  };
  initial: MotionProps["initial"];
  animate: MotionProps["animate"] & {
    transition: MotionProps["transition"];
  };
};

// Components
export function DynamicIsland() {
  const [view, setView] = React.useState<View>("idle");

  /** Values are guess-work. Tried to match it from eye. */
  /** The smaller the element the more bounce it needs. */
  /** The bounce value is for what we're transitioning to so if the view is 'idle' the transition is for moving to 'timer' which should be the smaller value */
  const animationConfig = React.useMemo<AnimationConfig>(
    () => ({
      layoutTransition: {
        type: "spring",
        bounce: view === "idle" ? 0.3 : 0.4,
      },
      contentTransition: {
        type: "spring",
        bounce: view === "idle" ? 0.3 : 0.4,
      },
      initial: {
        transform: "scale(0.9)",
        opacity: 0,
        filter: "blur(6px)",
        originX: 0.4,
        originY: 0.4,
      },
      animate: {
        transform: "scale(1)",
        opacity: 1,
        filter: "blur(0px)",
        originX: 0.4,
        originY: 0.4,
        transition: {
          delay: 0.04,
        },
      },
    }),
    [view],
  );

  const content = React.useMemo(() => {
    switch (view) {
      case "timer":
        return <DynamicIslandTimer />;
      case "idle":
        return (
          <div className="flex items-center justify-end w-[120px] px-2 py-2">
            <div className="flex items-center justify-center h-3 w-3 rounded-full bg-white/20 dark:bg-white/5">
              <div className="w-1 h-1 rounded-full bg-white/10" />
            </div>
          </div>
        );
    }
  }, [view]);

  return (
    <div className="h-[200px]">
      <div className="relative flex h-full w-full flex-col justify-between">
        <motion.div
          layout
          transition={animationConfig.layoutTransition}
          style={{ borderRadius: 32 }}
          className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black border border-white/5 shadow-2xl"
        >
          <motion.div
            transition={animationConfig.contentTransition}
            initial={animationConfig.initial}
            animate={animationConfig.animate}
            key={view}
          >
            {content}
          </motion.div>
        </motion.div>
        <ExitingFloatingContent view={view}>{content}</ExitingFloatingContent>
        <ViewControls onViewChange={(view) => setView(view)} />
      </div>
    </div>
  );
}

/** Duplicated the content and wrap in different motion component. This helps do a proper cross-fade */
/** Using variant keyframes, we show each one when entering/exiting respectively */
function ExitingFloatingContent({ children, view }: FloatingContentProps) {
  const exitVariant = {
    exit: (transition: AnimationVariant) => ({
      ...transition,
      opacity: [1, 0],
      filter: "blur(6px)",
    }),
  };

  const custom = {
    "timer-idle": {
      transform: "scale(0.6) translateY(-6px)",
      bounce: 0.3,
    },
  };

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center">
      <AnimatePresence mode="popLayout" custom={custom}>
        <motion.div
          initial={{ opacity: 0 }}
          exit="exit"
          variants={exitVariant}
          key={view}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

type ViewControlsProps = {
  onViewChange: (view: View) => void;
};

function ViewControls({ onViewChange }: ViewControlsProps) {
  return (
    <div className="flex w-full justify-center gap-4">
      {(["idle", "timer"] as View[]).map((view) => (
        <Button
          className="capitalize"
          onClick={() => onViewChange(view)}
          key={view}
        >
          {view}
        </Button>
      ))}
    </div>
  );
}
