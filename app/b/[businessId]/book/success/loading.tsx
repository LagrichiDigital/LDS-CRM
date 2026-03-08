import Image from "next/image";

export default function SuccessLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-dark-300 px-4">
      <Image
        src="/assets/icons/loader.svg"
        alt=""
        width={40}
        height={40}
        className="animate-spin opacity-80"
      />
      <span className="text-dark-600">Loading your confirmation...</span>
    </div>
  );
}
