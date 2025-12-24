'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

export interface NavbarProps {
  logo?: ReactNode;
  logoHref?: string;
  leftItems?: ReactNode;
  rightItems?: ReactNode;
  mobileMenu?: ReactNode;
  className?: string;
  containerClassName?: string;
  sticky?: boolean;
}

export function Navbar({
  logo,
  logoHref = '/',
  leftItems,
  rightItems,
  mobileMenu,
  className = '',
  containerClassName = '',
  sticky = true,
}: NavbarProps) {
  return (
    <nav
      className={`
        bg-white border-b border-gray-200
        ${sticky ? 'sticky top-0 z-40' : ''}
        ${className}
      `}
    >
      <div
        className={`
          max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          ${containerClassName}
        `}
      >
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {logo && (
            <Link href={logoHref} className="flex-shrink-0">
              {logo}
            </Link>
          )}

          {/* Desktop Left Navigation */}
          {leftItems && (
            <div className="hidden md:flex items-center space-x-6 flex-1 ml-10">
              {leftItems}
            </div>
          )}

          {/* Desktop Right Navigation */}
          {rightItems && (
            <div className="hidden md:flex items-center space-x-4">
              {rightItems}
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenu && <div className="md:hidden">{mobileMenu}</div>}
        </div>
      </div>
    </nav>
  );
}

export interface NavSectionProps {
  children: ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export function NavSection({
  children,
  className = '',
  direction = 'horizontal',
}: NavSectionProps) {
  return (
    <div
      className={`
        flex
        ${direction === 'horizontal' ? 'flex-row items-center gap-4' : 'flex-col gap-2'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
