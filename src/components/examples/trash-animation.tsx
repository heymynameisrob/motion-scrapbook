import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { TrashBack, TrashFront } from "@/components/examples/trash-assets";
import { cn } from "@/lib/utils";
import { Button } from "@/primitives/button";
import {
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowLeftIcon,
} from "@heroicons/react/16/solid";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { useAnimationSpeed } from "@/components/motion-provider";

const IMAGES = ["237", "123", "567", "23"];

type TrashStatus = "idle" | "ready" | "removed" | "hiding" | "resetting";

export function TrashAnimation() {
  const [status, setStatus] = React.useState<TrashStatus>("idle");
  const [imagesToRemove, setImagesToRemove] = React.useState<string[]>([]);

  const imagesToShow = React.useMemo(() => {
    return status === "ready"
      ? IMAGES.filter((img) => !imagesToRemove.includes(img))
      : IMAGES;
  }, [status, imagesToRemove]);

  /** Reset animation stage after removed */
  React.useEffect(() => {
    if (status === "removed") {
      setTimeout(() => setStatus("hiding"), 1000);
      setTimeout(() => {
        setImagesToRemove([]);
        setStatus("resetting");
      }, 1200);
      setTimeout(() => setStatus("idle"), 1700);
    }
  }, [status]);

  const handleToggleSelect = (imageId: string) => {
    setImagesToRemove((current) =>
      current.includes(imageId)
        ? current.filter((id) => id !== imageId)
        : [...current, imageId],
    );
  };

  const handleTrash = () => {
    if (status === "ready") {
      setStatus("removed");
    } else {
      setStatus("ready");
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: status === "hiding" ? 0 : 1 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
      className="relative flex h-[500px] flex-col items-center justify-center"
    >
      {status === "idle" && (
        <ImageGrid
          images={imagesToShow}
          selectedImages={imagesToRemove}
          onToggleSelect={handleToggleSelect}
        />
      )}

      <AnimatePresence>
        {imagesToRemove.length > 0 && status === "idle" && (
          <ActionButtons>
            <ActionButton onClick={() => setImagesToRemove([])}>
              <ArrowLeftIcon className="w-4 h-4 opacity-70" />
              <small>Back</small>
            </ActionButton>
            <ActionButton onClick={() => alert("Copied!")}>
              <DocumentDuplicateIcon className="w-4 h-4 opacity-70" />
              <small>Duplicate</small>
            </ActionButton>
            <ActionButton isDestructive={true} onClick={handleTrash}>
              <TrashIcon className="w-4 h-4 opacity-70" />
              <small>Delete</small>
            </ActionButton>
          </ActionButtons>
        )}
      </AnimatePresence>

      <TrashContainer
        status={status}
        imagesToRemove={imagesToRemove}
        onConfirmTrash={handleTrash}
      />
    </motion.div>
  );
}

type ImageGridProps = {
  images: string[];
  selectedImages: string[];
  onToggleSelect: (imageId: string) => void;
};

type ImageItemProps = {
  imageId: string;
  isSelected: boolean;
  onToggleSelect: (imageId: string) => void;
};

function SelectionIndicator() {
  const { speed } = useAnimationSpeed();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1.1, opacity: 1 }}
      exit={{
        scale: 0.9,
        opacity: 0,
        transition: { duration: 0.1 },
      }}
      transition={{
        type: "spring",
        duration: 0.25 * (1 / speed),
        bounce: 0,
      }}
    >
      <CheckCircleIcon className="w-4 h-4 text-accent" />
    </motion.div>
  );
}

function ImageItem({ imageId, isSelected, onToggleSelect }: ImageItemProps) {
  const { speed } = useAnimationSpeed();
  return (
    <motion.li
      exit={
        isSelected
          ? {}
          : {
              opacity: 0,
              filter: "blur(4px)",
              transition: { duration: 0.15 * (1 / speed) },
            }
      }
      className="relative flex h-[100px] w-[100px]"
    >
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0 } }}
        className={cn(
          "pointer-events-none absolute right-2 top-2 z-10",
          "flex h-4 w-4 items-center justify-center",
        )}
      >
        <AnimatePresence>
          {isSelected ? (
            <SelectionIndicator />
          ) : (
            <div className="w-4 h-4 border-2 border-white drop-shadow-md rounded-full" />
          )}
        </AnimatePresence>
      </motion.div>

      <button
        aria-label={isSelected ? "Deselect image" : "Select image"}
        onClick={() => onToggleSelect(imageId)}
        className="relative overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-base-1"
      >
        <motion.img
          layoutId={`image-${imageId}`}
          className="h-full w-full object-cover"
          alt="Collection item"
          src={`https://picsum.photos/id/${imageId}/100`}
          height={100}
          width={100}
          loading="lazy"
        />
      </button>
    </motion.li>
  );
}

export function ImageGrid({
  images,
  selectedImages,
  onToggleSelect,
}: ImageGridProps) {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-4"
      aria-label="Collection items"
    >
      <AnimatePresence>
        {images.map((imageId) => (
          <ImageItem
            key={imageId}
            imageId={imageId}
            isSelected={selectedImages.includes(imageId)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}

function ActionButton({
  children,
  onClick,
  isDestructive,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isDestructive?: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "w-16 h-12 flex flex-col gap-1",
        "[&_svg]:shrink-0",
        isDestructive &&
          "hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400",
      )}
    >
      {children}
    </Button>
  );
}

function ActionButtons({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, filter: "blur(4px)", opacity: 0 }}
      animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
      exit={{ y: 20, filter: "blur(4px)", opacity: 0 }}
      className="absolute bottom-8 flex gap-1 bg-base-1 border rounded-xl p-1 shadow-lg will-change-transform"
    >
      <div className="flex w-full justify-between gap-1">{children}</div>
    </motion.div>
  );
}

interface TrashContainerProps {
  status: TrashStatus;
  imagesToRemove: string[];
  onConfirmTrash: () => void;
}

export function TrashContainer({
  status,
  imagesToRemove,
  onConfirmTrash,
}: TrashContainerProps) {
  const { speed } = useAnimationSpeed();

  const trashButtonVariants = {
    initial: { transform: "scale(1.2)", opacity: 0, filter: "blur(4px)" },
    animate: { transform: "scale(1)", opacity: 1, filter: "blur(0px)" },
    transition: { duration: 0.2 * (1 / speed), bounce: 0, type: "spring" },
  };

  const imageVariants = {
    animate: (isRemoved: boolean) => ({
      transform: `translateY(${isRemoved ? 110 : 75}px)`,
      scale: isRemoved ? 0.7 : 1,
      filter: isRemoved ? "blur(4px)" : "blur(0px)",
      transition: isRemoved
        ? { duration: 0.2 * (1 / speed), type: "spring", bounce: 0 }
        : { delay: 0.15 },
    }),
  };

  return (
    <>
      {status === "ready" && (
        <motion.div
          initial={trashButtonVariants.initial}
          animate={trashButtonVariants.animate}
          transition={trashButtonVariants.transition}
          className="absolute bottom-10 flex flex-col gap-2"
        >
          <Button size="md" variant="destructive" onClick={onConfirmTrash}>
            Permanently delete {imagesToRemove.length} items
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {status === "ready" || status === "removed" ? (
          <div className="absolute top-1/2 z-10 h-[114px] w-24 -translate-y-1/2">
            <motion.div
              initial={{
                transform: "scale(1.2)",
                filter: "blur(4px)",
                opacity: 0,
              }}
              animate={{
                transform: "scale(1)",
                filter: "blur(0px)",
                opacity: 1,
              }}
              exit={{
                transform: "scale(1.2)",
                filter: "blur(4px)",
                opacity: 0,
              }}
            >
              <TrashBack />
            </motion.div>

            <motion.div
              animate="animate"
              variants={imageVariants}
              custom={status === "removed"}
              className="absolute flex w-full top-[-60px] flex-col-reverse items-center"
            >
              {imagesToRemove.map((image, index) => (
                <motion.li
                  key={image}
                  className="flex h-1 items-center gap-2"
                  style={{
                    rotate:
                      index % 2 === 0
                        ? 4 * (imagesToRemove.length - index + 1)
                        : -1 * (imagesToRemove.length - index + 1) * 4,
                  }}
                >
                  <motion.img
                    layoutId={`image-${image}`}
                    alt="Collection item"
                    className="rounded"
                    src={`https://picsum.photos/id/${image}/65`}
                    height={65}
                    width={65}
                  />
                </motion.li>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15, duration: 0 }}
              className="absolute bottom-[0] left-[3px] h-full w-[90px]"
            >
              <TrashFront />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
