import * as React from "react";
import { Button } from "@/primitives/button";
import { Input } from "@/primitives/input";
import { AnimatePresence, motion } from "motion/react";
import { useKeyPressEvent } from "react-use";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/select";
import { Slider } from "@/primitives/slider";

const variants = {
  initial: (direction: -1 | 1) => {
    return { x: `${110 * direction}%`, opacity: 0 };
  },
  active: { x: "0%", opacity: 1 },
  exit: (direction: -1 | 1) => {
    return { x: `${-110 * direction}%`, opacity: 0 };
  },
};

export function MultiStep() {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [isStepValid, setIsStepValid] = React.useState<boolean>(false);
  const previousIndexRef = React.useRef(currentIndex);

  const content = React.useMemo(() => {
    switch (currentIndex) {
      case 0:
        return (
          <Question1
            index={currentIndex + 1}
            onQuestionValid={(valid) => setIsStepValid(valid)}
          />
        );
      case 1:
        return (
          <Question2
            index={currentIndex + 1}
            onQuestionValid={(valid) => setIsStepValid(valid)}
          />
        );
      case 2:
        return (
          <Question3
            index={currentIndex + 1}
            onQuestionValid={(valid) => setIsStepValid(valid)}
          />
        );

      case 3:
        return (
          <Step>
            <StepTitle>Thanks for submitting</StepTitle>
            <p className="text-sm text-secondary">We'll be in touch</p>
            <Button onClick={() => setCurrentIndex(0)}>Go back</Button>
          </Step>
        );
    }
  }, [currentIndex, setIsStepValid]);

  React.useEffect(() => {
    previousIndexRef.current = currentIndex;
  }, [currentIndex]);

  useKeyPressEvent("Enter", () => {
    if (!isStepValid) return;
    setCurrentIndex((prev) => prev + 1);
  });

  const direction = currentIndex < previousIndexRef.current ? -1 : 1;

  return (
    <div className="relative w-96 overflow-clip rounded-xl bg-background border focus">
      <div className="flex flex-col gap-5 p-5">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            variants={variants}
            initial="initial"
            animate="active"
            exit="exit"
            custom={direction}
          >
            {content}
          </motion.div>
        </AnimatePresence>
        {currentIndex < 3 && (
          <div className="flex flex-row items-center justify-between gap-4">
            <Button
              disabled={currentIndex === 0}
              onClick={() => {
                if (currentIndex === 0) {
                  return;
                }
                setCurrentIndex((prev) => prev - 1);
                setIsStepValid(false);
              }}
            >
              Back
            </Button>

            <Button
              disabled={!isStepValid}
              onClick={() => {
                setCurrentIndex((prev) => prev + 1);
                setIsStepValid(false);
              }}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepTitle({
  children,
  index,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <header role="heading" className="flex flex-col gap-2">
      {index && (
        <span className="uppercase tracking-wide text-xs text-muted font-mono">
          Question {index} of 3
        </span>
      )}
      <h2 className="text-lg font-medium">{children}</h2>
    </header>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

function Question1({
  index,
  onQuestionValid,
}: {
  index: number;
  onQuestionValid: (valid: boolean) => void;
}) {
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    onQuestionValid(value.length > 3);
  }, [onQuestionValid, value.length]);

  return (
    <Step>
      <StepTitle index={index}>What is your name</StepTitle>
      <Input
        type="text"
        placeholder="Enter your full name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Step>
  );
}

function Question2({
  index,
  onQuestionValid,
}: {
  index: number;
  onQuestionValid: (valid: boolean) => void;
}) {
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    onQuestionValid(value.length > 3);
  }, [onQuestionValid, value.length]);

  return (
    <Step>
      <StepTitle index={index}>Pick your speciality</StepTitle>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select a speciality" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="anesthesiology">Anesthesiology</SelectItem>
          <SelectItem value="cardiology">Cardiology</SelectItem>
          <SelectItem value="dermatology">Dermatology</SelectItem>
          <SelectItem value="emergency">Emergency Medicine</SelectItem>
          <SelectItem value="family">Family Medicine</SelectItem>
          <SelectItem value="internal">Internal Medicine</SelectItem>
          <SelectItem value="neurology">Neurology</SelectItem>
          <SelectItem value="obstetrics">Obstetrics & Gynecology</SelectItem>
          <SelectItem value="oncology">Oncology</SelectItem>
          <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
          <SelectItem value="orthopedics">Orthopedics</SelectItem>
          <SelectItem value="pediatrics">Pediatrics</SelectItem>
          <SelectItem value="psychiatry">Psychiatry</SelectItem>
          <SelectItem value="radiology">Radiology</SelectItem>
          <SelectItem value="surgery">Surgery</SelectItem>
        </SelectContent>
      </Select>
    </Step>
  );
}

function Question3({
  index,
  onQuestionValid,
}: {
  index: number;
  onQuestionValid: (valid: boolean) => void;
}) {
  const [value, setValue] = React.useState<number[]>([1]);

  React.useEffect(() => {
    onQuestionValid(true);
  }, [onQuestionValid, value]);

  return (
    <Step>
      <StepTitle index={index}>What is your FTE?</StepTitle>
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={value}
        onValueChange={setValue}
      />
      <p className="text-sm text-muted-foreground">
        {value[0] * 100}% Full Time Equivalent
      </p>
    </Step>
  );
}
