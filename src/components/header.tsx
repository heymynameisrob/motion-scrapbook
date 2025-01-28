import { ScrambleText } from "@/components/scrambled-name";
import { Avatar } from "@/primitives/avatar";
import { Actions } from "@/components/social-links";

export function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <div role="heading" className="flex flex-col gap-2">
        <h1 className="text-3xl">Motion Scrapbook</h1>
        <div className="flex items-center gap-1">
          <Avatar />
          <ScrambleText />
          <div className="shrink-0 w-[4px] h-4 bg-primary animate-blink"></div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Actions />
      </div>
    </header>
  );
}
