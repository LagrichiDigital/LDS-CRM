import Image from "next/image";

export default function BookLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-dark-500 px-[5%] py-4">
        <div className="h-8 w-48 animate-pulse rounded bg-dark-400" />
      </div>
      <main className="container my-auto flex-1 px-[5%] py-10">
        <div className="sub-container mx-auto max-w-[560px] space-y-6">
          <div className="h-9 w-64 animate-pulse rounded bg-dark-400" />
          <div className="h-5 w-full max-w-md animate-pulse rounded bg-dark-400" />
          <div className="flex-center gap-3 py-12">
            <Image
              src="/assets/icons/loader.svg"
              alt=""
              width={32}
              height={32}
              className="animate-spin opacity-80"
            />
            <span className="text-dark-600">Loading booking form...</span>
          </div>
        </div>
      </main>
    </div>
  );
}
