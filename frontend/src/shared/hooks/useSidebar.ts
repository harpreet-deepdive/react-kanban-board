"use client";

import { useState } from "react";

export default function useSidebar() {
  const [expanded, setExpanded] = useState<boolean>(true);

  return { expanded, setExpanded };
}
