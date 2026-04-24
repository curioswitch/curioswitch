import { Link } from "@tanstack/react-router";
import { MdMail } from "react-icons/md";

import imgLogo from "../assets/logo-white.webp";
import { m } from "../paraglide/messages";

export default function Footer() {
  return (
    <footer>
      <section className="page-gutter flex flex-col gap-8 bg-cyan-400 py-10 text-white lg:py-20">
        <div className="inline-flex w-fit rounded-full border border-white p-4">
          <MdMail size={24} aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">{m.footer_contact_title()}</h3>
          <p>{m.footer_contact_description()}</p>
        </div>
        <div>
          <Link
            to="/contact"
            className="inline-flex rounded-full bg-gray-100 px-6 py-3 text-black transition hover:bg-gray-300"
          >
            {m.footer_contact_button()}
          </Link>
        </div>
      </section>
      <div className="page-gutter bg-black py-10 text-white lg:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <img
            src={imgLogo}
            alt={m.common_logo_alt()}
            className="h-6 w-auto md:h-12"
          />
          <small className="text-sm not-italic">{m.footer_copyright()}</small>
        </div>
      </div>
    </footer>
  );
}
