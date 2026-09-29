import React from 'react';

const categoryColorMap = {
  music: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  technology: { bg: 'rgba(14, 165, 233, 0.15)', text: '#38bdf8', border: 'rgba(14, 165, 233, 0.3)' },
  education: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
  workshop: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  sports: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  cultural: { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
};

export const CategoryBadge = ({ category, className = '' }) => {
  if (!category) return null;
  const key = category.toLowerCase().trim();
  const theme = categoryColorMap[key] || {
    bg: 'rgba(99, 102, 241, 0.15)',
    text: '#a5b4fc',
    border: 'rgba(99, 102, 241, 0.3)',
  };

  return (
    <span
      className={`badge ${className}`}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        borderColor: theme.border,
      }}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
