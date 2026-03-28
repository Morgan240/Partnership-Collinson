import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'var(--lms-interactive)',
  defaultOpen = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="about-collapse">
      <button
        className={`about-collapse__header ${open ? 'about-collapse__header--open' : ''}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <div className="about-collapse__left">
          {badge && (
            <span className="about-collapse__badge" style={{ background: badgeColor }}>
              {badge}
            </span>
          )}
          <div>
            <span className="about-collapse__title">{title}</span>
            {subtitle && <span className="about-collapse__subtitle">{subtitle}</span>}
          </div>
        </div>
        <svg
          className={`about-collapse__chevron ${open ? 'about-collapse__chevron--open' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="about-collapse__body">{children}</div>}
    </div>
  );
};
