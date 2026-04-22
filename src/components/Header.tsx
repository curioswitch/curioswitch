import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";

import imgLogo from "../assets/logo.webp";
import { m } from "../paraglide/messages";
import { getLocale, getUrlOrigin, localizeUrl } from "../paraglide/runtime";

const navItems = [
  {
    getLabel: () => m.home_services_heading(),
    to: "/" as const,
    hash: "services" as const,
  },
  { getLabel: () => m.common_page_works(), to: "/works" as const },
  { getLabel: () => m.common_page_news(), to: "/news" as const },
  { getLabel: () => m.common_page_company(), to: "/company" as const },
  { getLabel: () => m.common_page_members(), to: "/members" as const },
];

const localeItems = [
  { label: "JA", locale: "ja" },
  { label: "EN", locale: "en" },
] as const;

function NavItemLink({
  activeClassName,
  label,
  to,
  hash,
  className,
  onClick,
}: {
  activeClassName?: string;
  label: string;
  to: "/" | "/works" | "/news" | "/company" | "/members" | "/contact";
  hash?: string;
  className: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      hash={hash}
      className={className}
      onClick={onClick}
      activeOptions={{
        exact: to === "/",
        includeHash: false,
        includeSearch: false,
      }}
      activeProps={
        hash || !activeClassName ? undefined : { className: activeClassName }
      }
    >
      {label}
    </Link>
  );
}

function toRelativeHref(url: URL) {
  return `${url.pathname}${url.search}${url.hash}`;
}

function LanguageSwitcher({
  className,
  currentClassName,
  linkClassName,
  onNavigate,
}: {
  className: string;
  currentClassName: string;
  linkClassName: string;
  onNavigate?: () => void;
}) {
  const href = useLocation({ select: (location) => location.href });
  const currentLocale = getLocale();
  const currentUrl = new URL(href, getUrlOrigin());

  return (
    <nav className={className} aria-label={m.common_language_switcher_label()}>
      {localeItems.map((item, index) => {
        const isCurrent = item.locale === currentLocale;
        const targetHref = isCurrent
          ? undefined
          : toRelativeHref(localizeUrl(currentUrl, { locale: item.locale }));

        return (
          <span key={item.locale} className="contents">
            {isCurrent ? (
              <span className={currentClassName}>{item.label}</span>
            ) : (
              <a
                href={targetHref}
                lang={item.locale}
                hrefLang={item.locale}
                className={linkClassName}
                onClick={onNavigate}
              >
                {item.label}
              </a>
            )}
            {index < localeItems.length - 1 ? (
              <span aria-hidden="true" className="text-gray-400">
                /
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 isolate px-4 md:px-8 backdrop-blur-lg">
        <nav className="page-wrap grid grid-cols-[1fr_auto] items-center py-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:py-0">
          <h2 className="m-0 text-base font-semibold tracking-tight md:justify-self-start md:py-8">
            <Link
              to="/"
              className="inline-flex items-center text-lg no-underline transition-opacity hover:opacity-70"
            >
              <img
                src={imgLogo}
                alt={m.common_logo_alt()}
                className="h-6 w-auto"
              />
            </Link>
          </h2>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={m.common_menu_open_label()}
            className="inline-flex items-center justify-center rounded-full p-2 transition-opacity hover:opacity-70 md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <MdMenu size={24} />
          </button>

          <div className="hidden items-center gap-4 md:flex md:flex-wrap md:justify-center md:py-8 lg:gap-8">
            {navItems.map((item) => (
              <NavItemLink
                key={`${item.to}-${item.hash ?? ""}`}
                label={item.getLabel()}
                to={item.to}
                hash={item.hash}
                className="text-sm no-underline transition-opacity hover:opacity-70"
                activeClassName="font-semibold underline decoration-2 underline-offset-6"
              />
            ))}
          </div>

          <div className="hidden items-center justify-self-end whitespace-nowrap md:flex md:translate-x-8">
            <LanguageSwitcher
              className="mr-4 flex items-center gap-2 text-sm tracking-[0.18em] uppercase lg:mr-6"
              currentClassName="font-semibold underline decoration-2 underline-offset-4"
              linkClassName="transition-opacity hover:opacity-70"
            />
            <div className="rounded-bl-4xl bg-black px-6 py-8 lg:px-10 lg:py-8">
              <NavItemLink
                label={m.common_page_contact()}
                to="/contact"
                className="text-sm text-white no-underline transition-opacity hover:opacity-70"
              />
            </div>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-80 overflow-y-auto bg-white px-6 py-6 transition-opacity duration-200 md:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col">
          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label={m.common_menu_close_label()}
              className="inline-flex items-center justify-center transition-opacity hover:opacity-70"
              onClick={() => setIsMenuOpen(false)}
            >
              <MdClose size={24} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-5 py-8">
            <NavItemLink
              label={m.common_nav_home()}
              to="/"
              className="text-4xl font-medium tracking-tight no-underline transition-opacity hover:opacity-70 sm:text-5xl"
              onClick={() => setIsMenuOpen(false)}
            />
            {navItems.map((item) => (
              <NavItemLink
                key={`${item.to}-${item.hash ?? ""}`}
                label={item.getLabel()}
                to={item.to}
                hash={item.hash}
                className="text-4xl font-medium tracking-tight no-underline transition-opacity hover:opacity-70 sm:text-5xl"
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
            <NavItemLink
              label={m.common_page_contact()}
              to="/contact"
              className="text-4xl font-medium tracking-tight no-underline transition-opacity hover:opacity-70 sm:text-5xl"
              onClick={() => setIsMenuOpen(false)}
            />
            <LanguageSwitcher
              className="mt-2 flex items-center gap-2 text-xs tracking-[0.18em] uppercase"
              currentClassName="font-semibold underline decoration-2 underline-offset-4"
              linkClassName="transition-opacity hover:opacity-70"
              onNavigate={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
