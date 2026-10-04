'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  /** Renders the trigger; call `open` from its onClick. */
  trigger: (open: () => void, dialogId: string) => ReactNode;
  children: ReactNode;
  /** Wide dialogs host the A4 notice; narrow ones the GARAN label. */
  size?: 'wide' | 'narrow';
}

/**
 * Native <dialog>: modal focus trap, Esc to close and focus return to the
 * trigger come from the browser. Content is only mounted while open so the
 * official files are fetched on the first click, as Annex II allows for the
 * nested display ("appear in its entirety on the first mouse click").
 */
export default function LegalDialog({ title, trigger, children, size = 'wide' }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const baseId = useId().replace(/:/g, '');
  const dialogId = `legal-dialog-${baseId}`;
  const titleId = `${dialogId}-title`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <>
      {trigger(() => setIsOpen(true), dialogId)}
      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-labelledby={titleId}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          // Click on the backdrop (the dialog element itself) closes it.
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
        className={`m-auto max-h-[92vh] w-[calc(100vw-1rem)] rounded-2xl border-0 bg-white p-0 text-dark shadow-2xl backdrop:bg-dark/60 ${
          size === 'wide' ? 'max-w-3xl' : 'max-w-md'
        }`}
      >
        {isOpen && (
          <div className="flex max-h-[92vh] flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
              <h2 id={titleId} className="font-heading text-base font-bold text-dark sm:text-lg">
                {title}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="-mr-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-dark-300 transition hover:bg-slate-100 hover:text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Închide"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto px-3 py-4 sm:px-6 sm:py-5">{children}</div>
          </div>
        )}
      </dialog>
    </>
  );
}
