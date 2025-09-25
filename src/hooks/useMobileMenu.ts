import { useState } from "react";

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen((prev: boolean) => !prev);
  };

  return { isOpen, toggleMenu };
}
