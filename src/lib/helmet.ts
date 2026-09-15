/**
 * react-helmet-async ships CommonJS, which breaks named ESM imports during SSR.
 * Re-export through the default export so both server and client resolve it.
 */
import helmetPkg from "react-helmet-async";

const pkg = helmetPkg as unknown as typeof import("react-helmet-async");

export const Helmet = pkg.Helmet;
export const HelmetProvider = pkg.HelmetProvider;
