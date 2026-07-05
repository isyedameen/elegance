import React from "react";

function ProductSkeleton() {
  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border shadow-premium overflow-hidden animate-pulse">
      {/* IMAGE PLACEHOLDER */}
      <div className="h-48 bg-gray-200"></div>

      {/* CONTENT PLACEHOLDER */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/3 mt-2"></div>

        {/* BUTTON PLACEHOLDER */}
        <div className="h-10 bg-gray-200 rounded-xl mt-3"></div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
