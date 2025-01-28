import { MotionProvider } from "@/components/motion-provider";
import { SpeedControl } from "@/components/speed-control";

export function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <MotionProvider>
      <div className="flex flex-col gap-1 p-1 bg-base-1 border shadow rounded-[20px]">
        <section className="shrink-0 flex flex-col border overflow-clip rounded-2xl">
          <figure className="relative grid place-items-center w-full aspect-video border-b bg-background after:pointer-events-none after:absolute after:inset-0 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/5">
            {children}
          </figure>
          <figcaption className="flex items-center justify-between gap-4 bg-base-3 p-4">
            <p className="text-sm font-medium text-primary">{title}</p>
            <SpeedControl />
          </figcaption>
        </section>
      </div>
    </MotionProvider>
  );
}
