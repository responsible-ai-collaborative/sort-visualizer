import type { ReactNode } from "react";

// A content step renders against a display number assigned by page.tsx from
// a single running counter — content modules never hardcode "01".."20", so
// inserting or removing a step can't desync the numbering.
export type ContentStep = {
  id: string;
  render: (num: string) => ReactNode;
};
