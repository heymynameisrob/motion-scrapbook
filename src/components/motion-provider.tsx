import { createContext, useContext, useState } from "react";
import { MotionConfig } from "motion/react";

type SpeedContextType = {
  speed: number;
  setSpeed: (speed: number) => void;
};

const SpeedContext = createContext<SpeedContextType | undefined>(undefined);

export function useAnimationSpeed() {
  const context = useContext(SpeedContext);
  if (!context) {
    throw new Error("useAnimationSpeed must be used within MotionProvider");
  }
  return context;
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [speed, setSpeed] = useState(1); // Default speed multiplier

  return (
    <SpeedContext.Provider value={{ speed, setSpeed }}>
      <MotionConfig
        reducedMotion="user"
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.4 * (1 / speed),
        }}
      >
        {children}
      </MotionConfig>
    </SpeedContext.Provider>
  );
}
