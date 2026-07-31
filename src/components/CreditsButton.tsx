"use client";

// A button that opens the credits Modal. Kept as its own client component so
// pages that host it (the Header, the Closing) can stay server components; the
// trigger's look is passed in via `className` so it matches each page's row.

import { useState, type ReactNode } from "react";
import { Modal } from "@/components/Modal";

function CreditLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-text underline decoration-accent-text/40 hover:decoration-accent-text"
    >
      {children}
    </a>
  );
}

export function CreditsButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Credits
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Credits" accent="var(--accent-text)">
        <p className="font-body text-[14px] md:text-[15px] leading-[1.6] text-ink-soft">
          This website was built by{" "}
          <CreditLink href="https://spencermichaels.com/">Spencer Michaels</CreditLink> with the
          guidance of Isaak Mengesha, Sean McGregor, Simon Mylius, and Peter Slattery. Many thanks to
          the <CreditLink href="https://incidentdatabase.ai/">AI Incident Database</CreditLink>,{" "}
          <CreditLink href="https://airisk.mit.edu/">MIT AI Risk Initiative</CreditLink>,{" "}
          <CreditLink href="https://www.arcadiaimpact.org/">Arcadia Impact</CreditLink>, and the{" "}
          <CreditLink href="https://www.cbai.ai/">Cambridge Boston Alignment Initiative</CreditLink>{" "}
          for their institutional support. The framework and findings are drawn from the source
          paper; full credit for the underlying research belongs to its authors.
        </p>
      </Modal>
    </>
  );
}
