// src/components/ui/SkeletonText.jsx
import React from 'react';
import Skeleton from './Skeleton';

const SkeletonText = ({ lines = 3, widths = ['100%', '90%', '95%'] }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-4" style={{ width: widths[i % widths.length] }} />
    ))}
  </div>
);

export default SkeletonText;