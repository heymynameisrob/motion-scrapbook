type SpinnerProps = {
  size?: number;
  className?: string;
};

export function Spinner({ size = 20, className }: SpinnerProps) {
  const bars = Array.from({ length: 12 });

  return (
    <div
      className={`${className}`}
      style={{ ["--spinner-size" as string]: `${size}px` }}
    >
      <div className="relative top-[50%] left-[50%] h-[var(--spinner-size)] w-[var(--spinner-size)]">
        {bars.map((_, i) => {
          const rotation = i * 30;
          const delay = `-${1.2 - i * 0.1}s`;

          return (
            <div
              key={i}
              className="absolute w-[24%] h-[8%] left-[-10%] top-[-3.9%] rounded-md bg-primary animate-spinner"
              style={{
                transform: `rotate(${rotation}deg) translate(146%)`,
                animationDelay: delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
