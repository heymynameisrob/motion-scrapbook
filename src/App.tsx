import { Form } from "@/components/examples/form";
import { MultiStep } from "@/components/examples/multi-step";
import { TabsClipPath } from "@/components/examples/tabs";
import { TrashAnimation } from "@/components/examples/trash-animation";
import { Header } from "@/components/header";
import { Section } from "@/components/section";
import { motion } from "motion/react";

export function App() {
  return (
    <main className=" px-6 py-12 max-w-7xl mx-auto xl:gap-24 xl:py-24">
      <div className="pointer-events-none fixed inset-0 flex z-0">
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(circle,hsla(0,0%,100%,.1)0%,hsla(0,0%,100%,0)100%)]" />
      </div>
      <div className="relative">
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
          variants={{
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
            hidden: {
              opacity: 0,
            },
          }}
        >
          <MotionDiv>
            <Header />
          </MotionDiv>
          <MotionDiv>
            <Section title="Form submit">
              <Form />
            </Section>
          </MotionDiv>
          <MotionDiv>
            <Section title="Multi-step">
              <MultiStep />
            </Section>
          </MotionDiv>
          <MotionDiv>
            <Section title="Tabs">
              <TabsClipPath />
            </Section>
          </MotionDiv>
          <MotionDiv>
            <Section title="Trash">
              <TrashAnimation />
            </Section>
          </MotionDiv>
        </motion.div>
      </div>
    </main>
  );
}

function MotionDiv({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
      }}
      transition={{
        type: "spring",
        duration: 0.4,
        bounce: 0,
        staggerChildren: 0.2,
      }}
    >
      {children}
    </motion.div>
  );
}
