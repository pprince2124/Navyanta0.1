// src/components/ui/SkeletonCard.jsx
import React from 'react';
import Skeleton from './ServiceCardSkeleton';

const SkeletonCard = () => (
  <div className="border border-gray-700/50 rounded-lg p-4 space-y-3">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-32 w-full rounded-md" />
  </div>
);

export default SkeletonCard;