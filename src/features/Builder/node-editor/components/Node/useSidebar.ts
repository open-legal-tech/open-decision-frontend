import React from "react";
import { useClickAway, useKeyPressEvent } from "react-use";
import create from "zustand";

export const useSidebar = () => {
  const [open, nodeId, openSidebar, closeSidebar] = useSidebarState((state) => [
    state.open,
    state.nodeId,
    state.openSidebar,
    state.closeSidebar,
  ]);

  const ref = React.useRef(null);

  useClickAway(ref, (event) => {
    event.stopPropagation();
    closeSidebar();
  });
  useKeyPressEvent("Escape", () => closeSidebar());

  return { open, nodeId, openSidebar, closeSidebar, ref };
};

type ModalState = {
  open: boolean;
  nodeId: string;
  nodeType: string;
  openSidebar: (nodeId: string, nodeType: string) => void;
  closeSidebar: () => void;
};

export const useSidebarState = create<ModalState>((set) => ({
  open: false,
  nodeId: "",
  nodeType: "",
  openSidebar: (nodeId, nodeType) => set({ open: true, nodeId, nodeType }),
  closeSidebar: () => set({ open: false, nodeId: "", nodeType: "" }),
}));
