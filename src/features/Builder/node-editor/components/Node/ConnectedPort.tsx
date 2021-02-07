import clsx from "clsx";
import React from "react";
import { Port } from "./Port";

type ConnectedPort = React.FC<{ className?: string; nodeId: string }>;

export const ConnectedPort: ConnectedPort = ({ className, nodeId }) => {
  return (
    <Port
      nodeId={nodeId}
      className={clsx(
        className,
        "rounded-full h-4 w-4 bg-blue-500 border-2 border-gray-200 shadow-md flex"
      )}
    />
  );
};