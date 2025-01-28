import { Form } from "@/components/examples/form";
import { Section } from "@/components/section";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/primitives/button";
import { MoonIcon } from "@heroicons/react/16/solid";
import { SunIcon } from "@heroicons/react/16/solid";

export function App() {
  const { setTheme, theme } = useTheme();
  return (
    <main className="flex flex-col gap-8 px-6 py-12 max-w-7xl mx-auto h-screen overflow-y-scroll xl:p-12">
      <div className="absolute top-0 left-0 w-full z-10 flex items-center justify-end p-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <SunIcon className="w-4 h-4 text-primary" />
          ) : (
            <MoonIcon className="w-4 h-4 text-primary" />
          )}
        </Button>
      </div>
      <Section
        title="Toggle theme"
        deps={["motion", "radix-ui", "react-hook-form", "tailwindcss"]}
      >
        <Form />
      </Section>
      <Section
        title="Toggle theme"
        deps={["motion", "radix-ui", "react-hook-form", "tailwindcss"]}
      >
        <Form />
      </Section>
    </main>
  );
}
