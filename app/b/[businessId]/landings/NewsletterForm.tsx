"use client";

type Props = {
  businessName: string;
  buttonStyle?: React.CSSProperties;
};

export function NewsletterForm({ businessName, buttonStyle }: Props) {
  return (
    <section className="border-t border-neutral-200 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-xl px-5 text-center md:px-8">
        <h2 className="text-3xl font-bold text-neutral-900">
          Stay Updated with {businessName}
        </h2>
        <p className="mt-3 text-neutral-600">
          Get news, offers, and booking reminders.
        </p>
        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Your email"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
          <button
            type="submit"
            className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={buttonStyle ?? { backgroundColor: "#1a1a1a" }}
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-xs text-neutral-500">
          I agree to the Terms of service and Privacy policy
        </p>
      </div>
    </section>
  );
}
