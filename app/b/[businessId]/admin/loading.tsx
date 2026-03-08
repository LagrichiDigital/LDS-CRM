import Image from "next/image";

export default function AdminLoading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <div className="h-5 w-40 animate-pulse rounded bg-dark-400" />
        <div className="h-5 w-32 animate-pulse rounded bg-dark-400" />
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <div className="h-9 w-48 animate-pulse rounded bg-dark-400" />
          <div className="h-5 w-72 animate-pulse rounded bg-dark-400" />
        </section>
        <div className="flex-center gap-3 py-16">
          <Image
            src="/assets/icons/loader.svg"
            alt=""
            width={32}
            height={32}
            className="animate-spin opacity-80"
          />
          <span className="text-dark-600">Loading dashboard...</span>
        </div>
      </main>
    </div>
  );
}
