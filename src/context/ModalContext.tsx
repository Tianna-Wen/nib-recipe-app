"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ModalContextType {
  openModals: number;
  registerModal: () => () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openModals, setOpenModals] = useState(0);

  useEffect(() => {
    if (openModals > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openModals]);

  const registerModal = () => {
    setOpenModals((prev) => prev + 1);

    // Return cleanup function
    return () => {
      setOpenModals((prev) => Math.max(0, prev - 1));
    };
  };

  return (
    <ModalContext.Provider value={{ openModals, registerModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
