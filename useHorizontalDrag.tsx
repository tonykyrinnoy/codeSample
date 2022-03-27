import { useWindowInfo } from './useWindowInfo';
import clamp from 'lodash/clamp';
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState
} from 'react';

type UseHorizontalDragReturnValue = {
  /**
   * HTML attributes to be applied on the drag container
   */
  dragContainerAttributes: DragContainerAttributes;
  /**
   * HTML attributes to be applied on the drag item
   */
  dragItemAttributes: DragItemAttributes;
  /**
   * Whether the user has dragged the item in the current touch action.
   * Can be useful if you need to disable an onClick from a drag action.
   */
  currentlyDragging: boolean;
};

type DragContainerAttributes = Partial<
  Pick<
    ComponentPropsWithoutRef<'div'>,
    | 'onTouchEnd'
    | 'onTouchStart'
    | 'onTouchMove'
    | 'onMouseDown'
    | 'onMouseUp'
    | 'onMouseMove'
    | 'style'
  >
> & {
  ref: React.RefObject<HTMLDivElement>;
};

type DragItemAttributes = Pick<ComponentPropsWithoutRef<'div'>, 'style'> & {
  ref: React.RefObject<HTMLDivElement>;
};

/**
 * A hook that returns attributes & refs to allow an item to be horizontally dragged.
 * Currently only supports dragging for items overflowing horizontally on the right side,
 * but could be extended to support more.
 */
export function useHorizontalDrag(): UseHorizontalDragReturnValue {
  const [pressed, setPressed] = useState(false);
  const [currentX, setCurrentX] = useState<number>(0);
  const [initialX, setInitialX] = useState<number>(0);
  const [xOffset, setXOffset] = useState(0);
  const [draggable, setDraggable] = useState(false);
  const [currentlyDragging, setCurrentlyDragging] = useState(false);
  const { width, height } = useWindowInfo();

  const dragContainerRef = useRef<HTMLDivElement>(null);
  const dragItemRef = useRef<HTMLDivElement>(null);

  const [dragItemWidth, setDragItemWidth] = useState(0);

  useEffect(() => {
    setDragItemWidth(dragItemRef?.current?.offsetWidth || 0);
  }, [dragItemRef]);

  function setTranslateX(pixels: number) {
    if (dragItemRef && dragItemRef.current) {
      dragItemRef.current.style.transform = `translateX(${pixels}px)`;
    }
  }
  useEffect(() => {
    if (
      dragContainerRef.current &&
      dragContainerRef.current?.clientWidth < dragItemWidth
    ) {
      setDraggable(true);
    } else {
      setDraggable(false);
      setTranslateX(0);
    }
  }, [width, height, dragItemWidth]);

  function onDragStart(
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) {
    if (e.type === 'touchstart') {
      setInitialX(
        (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX - xOffset
      );
    } else {
      setInitialX(
        (e as React.MouseEvent<HTMLDivElement, MouseEvent>).clientX - xOffset
      );
    }
    if (dragItemRef && dragItemRef.current) {
      if (
        e.target === dragItemRef.current ||
        dragItemRef.current.contains(e.target as Node)
      ) {
        setPressed(true);
      }
    }
  }

  function onDragEnd() {
    setTimeout(() => {
      setCurrentlyDragging(false);
    }, 1);

    setInitialX(currentX);
    setPressed(false);
  }

  function onDrag(
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) {
    if (pressed) {
      setCurrentlyDragging(true);
      e.preventDefault();
      let draggedX;
      if (e.type === 'touchmove') {
        draggedX =
          (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX - initialX;
      } else {
        draggedX =
          (e as React.MouseEvent<HTMLDivElement, MouseEvent>).clientX -
          initialX;
      }

      if (draggedX != null && dragContainerRef.current) {
        const minX = dragContainerRef.current.clientWidth - dragItemWidth;
        draggedX = clamp(draggedX, minX, 0);
        setCurrentX(draggedX);
        setXOffset(currentX);

        if (dragItemRef && dragItemRef.current) {
          setTranslateX(currentX);
        }
      }
    }
  }

  let draggableAttributes: DragContainerAttributes = {
    style: {
      width: '100%',
      whiteSpace: 'nowrap',
      touchAction: 'none'
    },
    ref: dragContainerRef
  };
  if (draggable) {
    draggableAttributes = {
      ...draggableAttributes,
      onTouchStart: onDragStart,
      onTouchEnd: onDragEnd,
      onTouchMove: onDrag,
      onMouseDown: onDragStart,
      onMouseUp: onDragEnd,
      onMouseMove: onDrag
    };
  }

  return {
    dragContainerAttributes: draggableAttributes,
    dragItemAttributes: {
      style: {
        display: 'inline-block',
        touchAction: 'none',
        userSelect: 'none'
      },
      ref: dragItemRef
    },
    currentlyDragging
  };
}
