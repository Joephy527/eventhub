'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface NavMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  menuClassName?: string;
}

export function NavMenu({ trigger, children, className = '', menuClassName = '' }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute top-full right-0 mt-2 min-w-[200px]
            bg-white rounded-lg shadow-lg border border-gray-200
            py-2 z-50
            animate-in fade-in slide-in-from-top-2 duration-200
            ${menuClassName}
          `}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface NavMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export function NavMenuItem({ children, onClick, className = '', icon }: NavMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-2 text-left text-sm
        hover:bg-gray-50 transition-colors
        flex items-center gap-2
        ${className}
      `}
      role="menuitem"
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
