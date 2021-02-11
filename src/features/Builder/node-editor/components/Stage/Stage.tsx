import React from "react";
import { useKeyPressEvent } from "react-use";
import { useGesture } from "react-use-gesture";
import { useEditorStore } from "../../globalState";
import clsx from "clsx";
import { clamp } from "remeda";

type StageProps = {
  /**
   * Setting this to false disables panning in the Editor.
   */
  disablePan: boolean;
  /**
   * Setting this to false disables zooming in the Editor.
   */
  disableZoom: boolean;
  className?: string;
};

type Stage = React.FC<React.HTMLAttributes<HTMLDivElement> & StageProps>;

/**
 * The Stage is the main parent component of the node-editor. It holds all the Nodes and Connections pased in as children. It's main pourpose is to allow panning and zooming.
 */
export const Stage: Stage = ({
  children,
  className,
  disablePan,
  disableZoom,
  ...props
}) => {
  const [zoom, coordinates, setEditorConfig] = useEditorStore((state) => [
    state.editorConfig.zoom,
    state.editorConfig.coordinates,
    state.setEditorConfig,
  ]);

  /**
   * This tracks whether the space key is pressed. We need this, because the Stage should be pannable when pressing the space key.
   */
  const [spaceIsPressed, setSpaceIsPressed] = React.useState(false);
  useKeyPressEvent(
    (e) => e.code === "Space",
    () => setSpaceIsPressed(true),
    () => setSpaceIsPressed(false)
  );

  /**
   * These gestures represent the panning and zooming inside the Stage. They are enabled and disabled by the `disableZoom` and `disablePan` props.
   */
  const stageGestures = useGesture(
    {
      // We track the mousewheel and zoom in and out of the Stage.
      onWheel: ({ delta: [, y] }) =>
        setEditorConfig({
          zoom: clamp(zoom - clamp(y, { min: -10, max: 10 }) * 0.005, {
            min: 0.5,
            max: 2,
          }),
        }),

      // We track the drag and pan the Stage based on the previous coordinates and the delta (change) in the coordinates.
      onDrag: ({ movement }) => setEditorConfig({ coordinates: movement }),
      //This gesture enables panning of the Stage when the mouse is moved. We need this to make the Stage pannable when the Space key is pressed.
      onMove: ({ movement }) => setEditorConfig({ coordinates: movement }),
    },
    {
      move: { enabled: !disablePan && spaceIsPressed, initial: coordinates },
      wheel: { enabled: !disableZoom, axis: "y" },
      drag: { enabled: !disablePan, initial: coordinates },
    }
  );

  //------------------------------------------------------------------------

  return (
    <div
      className={clsx(
        "overflow-hidden relative pattern-background outline-none",
        className
      )}
      tabIndex={-1}
      style={{ cursor: spaceIsPressed ? "grab" : "" }}
      {...stageGestures()}
      {...props}
    >
      {/* This inner wrapper is used to translate the position of the content on pan. */}
      <div
        className="origin-center absolute left-1/2 top-1/2"
        style={{
          transform: `translate(${coordinates[0]}px, ${coordinates[1]}px)`,
        }}
      >
        {/* This inner wrapper is used to zoom.  */}
        <div className="absolute" style={{ transform: `scale(${zoom})` }}>
          {children}
        </div>
      </div>
    </div>
  );
};
