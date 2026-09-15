/**
 * react-helmet-async resolves to CommonJS on the server and ESM in the browser.
 * A namespace import works for both; unwrap an interop `default` when present.
 */
import * as helmetNs from "react-helmet-async";

type HelmetModule = typeof import("react-helmet-async");

const mod = ((helmetNs as unknown as { default?: HelmetModule }).default ??
  helmetNs) as HelmetModule;

export const Helmet = mod.Helmet;
export const HelmetProvider = mod.HelmetProvider;
