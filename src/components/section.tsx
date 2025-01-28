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
      <section className="shrink-0 flex flex-col gap-4 xl:h-[75dvh]">
        <figure className="grid place-items-center w-full aspect-video bg-base-2 border rounded-2xl">
          {children}
        </figure>
        <figcaption className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-primary">{title}</p>
          <SpeedControl />
        </figcaption>
      </section>
    </MotionProvider>
  );
}
