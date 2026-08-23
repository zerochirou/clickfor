import FlickerSpinner from "@/components/commons/flicker-loading/flicker-spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <FlickerSpinner />
    </div>
  );
}
