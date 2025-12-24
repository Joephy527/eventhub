'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  onClick?: () => void;
}

export function NavLink({
  href,
  children,
  className = '',
  activeClassName = 'text-blue-600 font-semibold',
  exact = false,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href);

  const linkClassName = `
    transition-colors duration-200
    ${className}
    ${isActive ? activeClassName : ''}
  `.trim();

  return (
    <Link href={href} className={linkClassName} onClick={onClick}>
      {children}
    </Link>
  );
}
