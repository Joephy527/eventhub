'use client';

import { useState, ReactNode } from 'react';
import { Menu, X } from 'lucide-react';

export interface MobileNavProps {
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
}

export function MobileNav({ children, className = '', triggerClassName = '' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`
          md:hidden p-2 rounded-md
          hover:bg-gray-100 transition-colors
          ${triggerClassName}
        `}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-sm
          bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={closeMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Content */}
        <nav className="p-4" onClick={closeMenu}>
          {children}
        </nav>
      </div>
    </>
  );
}

export interface MobileNavItemProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function MobileNavItem({ children, className = '', icon }: MobileNavItemProps) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3
        hover:bg-gray-50 rounded-lg transition-colors
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
