"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import dynamic from "next/dynamic";

const ContactModal = dynamic(() => import("./contact-modal"), { ssr: false });

type ContactModalContextValue = {
  open: () => void;
  close: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(
  null
);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const open = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ open, close }}>
      {children}
      {hasOpened && <ContactModal isOpen={isOpen} onClose={close} />}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error(
      "useContactModal must be used within ContactModalProvider"
    );
  }
  return context;
}
