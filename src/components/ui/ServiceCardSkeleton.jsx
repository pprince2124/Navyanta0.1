export default function ServiceCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm">
      <div className="h-40 w-full animate-pulse rounded-md bg-gray-200" />
      <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
      <div className="mt-4 h-9 w-full animate-pulse rounded bg-gray-200" />
    </div>
  );
}
