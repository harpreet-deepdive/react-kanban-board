"use client";
import { createContext } from "react";

interface SidebarContextProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarContext = createContext<SidebarContextProps>({
  expanded: true,
  setExpanded: () => {},
});
