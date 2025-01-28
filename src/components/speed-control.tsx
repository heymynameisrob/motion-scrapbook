import { useAnimationSpeed } from "@/components/motion-provider";
import { ToggleGroup, ToggleGroupItem } from "@/primitives/toggle-group";

export function SpeedControl() {
  const { speed, setSpeed } = useAnimationSpeed();

  return (
    <ToggleGroup
      type="single"
      value={String(speed)}
      defaultValue="1"
      onValueChange={(value) => setSpeed(Number(value))}
    >
      <ToggleGroupItem size="sm" className="w-12" value="0.25">
        0.25x
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" className="w-12" value="0.5">
        0.5x
      </ToggleGroupItem>
      <ToggleGroupItem size="sm" className="w-12" value="1">
        1x
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
