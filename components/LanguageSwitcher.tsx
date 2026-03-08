"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Locale } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "ar", label: "AR" },
];

function getLocaleLabel(locale: Locale): string {
  return LOCALES.find((l) => l.value === locale)?.label ?? "EN";
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const currentLabel = getLocaleLabel(locale);

  const handleSelect = (value: Locale) => {
    setLocale(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-w-[3rem] items-center justify-center gap-1 rounded-lg border border-dark-500 bg-dark-400 px-3 py-2 text-14-medium text-white hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[var(--page-bg)]"
          aria-label="Change language"
          aria-haspopup="listbox"
        >
          <span>{currentLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-auto min-w-[3rem] rounded-lg border border-dark-500 bg-dark-400 p-1 shadow-lg"
      >
        <ul role="listbox" className="flex flex-col gap-0.5">
          {LOCALES.filter((l) => l.value !== locale).map(({ value, label }) => (
            <li key={value} role="option">
              <button
                type="button"
                onClick={() => handleSelect(value)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-14-medium text-dark-700 transition hover:bg-dark-500 hover:text-white"
                )}
                aria-label={`Switch to ${label}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
