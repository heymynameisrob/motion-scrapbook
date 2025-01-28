import { useScramble } from "use-scramble";

export function ScrambleText() {
  const { ref } = useScramble({
    text: "@heymynameisrob",
    speed: 0.8,
    tick: 1,
    step: 1,
    scramble: 4,
    seed: 1,
  });

  return (
    <h1
      ref={ref}
      className="text-base font-mono uppercase tracking-wide text-secondary"
    />
  );
}
