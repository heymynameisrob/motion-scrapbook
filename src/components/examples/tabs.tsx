import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/primitives/tabs";

export function TabsClipPath() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeTabRect, setActiveTabRect] = React.useState<DOMRect | null>(
    null,
  );
  const triggerRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const defaultTrigger = triggerRefs.current.get(TABS[0].name);

    if (defaultTrigger && !activeTabRect) {
      setActiveTabRect(defaultTrigger.getBoundingClientRect());
    }

    if (container && activeTabRect) {
      const clipLeft =
        activeTabRect.left - container.getBoundingClientRect().left;
      const clipRight = clipLeft + activeTabRect.width;

      container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}% round 8px)`;
    }
  }, [activeTabRect]);

  const handleTabChange = (value: string) => {
    const element = triggerRefs.current.get(value);
    if (element) {
      setActiveTabRect(element.getBoundingClientRect());
    }
  };

  return (
    <Tabs
      defaultValue={TABS[0].name}
      orientation="horizontal"
      activationMode="automatic"
      onValueChange={handleTabChange}
    >
      <div className="relative flex flex-col items-center w-fit mx-auto">
        <TabsList className="relative flex justify-center gap-2">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              className="data-[state=active]:text-background"
              ref={(element) => {
                if (element) {
                  triggerRefs.current.set(tab.name, element);
                } else {
                  triggerRefs.current.delete(tab.name);
                }
              }}
              onClick={() => {
                const element = triggerRefs.current.get(tab.name);
                if (element) {
                  setActiveTabRect(element.getBoundingClientRect());
                }
              }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </TabsTrigger>
          ))}

          <div
            aria-hidden
            className="absolute z-10 w-full overflow-hidden transition-all duration-150 ease-out"
            ref={containerRef}
          >
            <div className="relative flex justify-center gap-2 bg-primary text-background">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.name}
                  value={tab.name}
                  className="data-[state=active]:text-background"
                  onClick={() => {
                    const element = triggerRefs.current.get(tab.name);
                    if (element) {
                      setActiveTabRect(element.getBoundingClientRect());
                    }
                  }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </TabsTrigger>
              ))}
            </div>
          </div>
        </TabsList>
      </div>

      {/* Tab content panels - add if needed */}
      {TABS.map((tab) => (
        <TabsContent key={tab.name} value={tab.name}>
          {/* Tab content here */}
        </TabsContent>
      ))}
    </Tabs>
  );
}

const TABS = [
  {
    name: "Big customers",
    icon: "🐋",
  },
  {
    name: "Renewals",
    icon: "♻️",
  },
  {
    name: "EMEA customers",
    icon: "🌍",
  },
  {
    name: "High risk",
    icon: "⚠️",
  },
];
