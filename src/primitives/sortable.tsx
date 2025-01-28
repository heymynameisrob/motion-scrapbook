import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type ObjWithId = { id: string | number; [key: string]: any };
type ItemType<T> = T extends (infer U)[]
  ? U extends ObjWithId
    ? U
    : U extends string | number
      ? U
      : never
  : never;

interface SortableProps<TItems extends (ObjWithId | string | number)[]> {
  items: TItems;
  onSort: (items: TItems) => void;
  children: React.ReactNode;
  orientation?: "vertical" | "horizontal" | "both";
  disabled?: boolean;
}

/** Wrapper component for building sortable lists, both horizontally and vertically */
export function Sortable<TItems extends (ObjWithId | string | number)[]>({
  children,
  orientation = "vertical",
  items,
  onSort,
  disabled = false,
}: SortableProps<TItems>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getItemId = (item: ItemType<TItems>): string | number => {
    if (typeof item === "object" && item !== null) {
      if (!("id" in item)) {
        throw new Error(
          'Objects in the array must have an unique "id" property',
        );
      }
      return item.id;
    }
    return item;
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over !== null && active.id !== over.id) {
      const oldIndex = items.findIndex(
        (item) => getItemId(item as ItemType<TItems>) === active.id,
      );
      const newIndex = items.findIndex(
        (item) => getItemId(item as ItemType<TItems>) === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex) as TItems;
        onSort(reorderedItems);
      }
    }
  }

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => getItemId(item as ItemType<TItems>))}
        strategy={
          orientation === "vertical"
            ? verticalListSortingStrategy
            : orientation === "both"
              ? rectSortingStrategy
              : horizontalListSortingStrategy
        }
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}

interface SortableItemProps {
  children: React.ReactNode;
  id: string | number;
}

export function SortableItem({ children, id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id,
  });

  const style = {
    transform:
      transform !== null
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    transition,
  };

  /** NOTE(@heymynameisrob): If dragging, set higher z-index so dragging items sits over the top */
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "relative transform-gpu will-change-transform hover:cursor-grabbing z-max",
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "transform-gpu will-change-transform cursor-auto z-0",
        isOver && "pointer-events-none",
      )}
    >
      {children}
    </div>
  );
}
