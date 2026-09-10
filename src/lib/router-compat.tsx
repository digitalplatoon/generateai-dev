/**
 * react-router-dom compatibility shim over TanStack Router.
 * Keeps the react-router calling convention for code migrated from the SPA stack.
 */
import { forwardRef, useCallback, useMemo } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  Link as TanStackLink,
  useLocation as useTanStackLocation,
  useNavigate as useTanStackNavigate,
  useParams as useTanStackParams,
  useRouter,
} from "@tanstack/react-router";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  children?: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace, state, children, ...rest },
  ref,
) {
  const isExternal = /^(https?:)?\/\//.test(to) || to.startsWith("mailto:") || to.startsWith("tel:");
  if (isExternal) {
    return (
      <a ref={ref} href={to} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <TanStackLink ref={ref} to={to} replace={replace ?? false} {...(rest as Record<string, unknown>)}>
      {children}
    </TanStackLink>
  );
});

export const NavLink = Link;

export function useLocation() {
  const location = useTanStackLocation();
  return useMemo(
    () => ({
      pathname: location.pathname,
      search: location.searchStr ?? "",
      hash: location.hash ?? "",
      state: location.state,
      key: location.href,
    }),
    [location],
  );
}

type NavigateOptions = { replace?: boolean; state?: unknown };

export function useNavigate() {
  const navigate = useTanStackNavigate();
  return useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        if (typeof window !== "undefined") window.history.go(to);
        return;
      }
      void navigate({ to, replace: options?.replace ?? false });
    },
    [navigate],
  );
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  return useTanStackParams({ strict: false }) as unknown as T;
}

type SetSearchParams =
  | URLSearchParams
  | Record<string, string>
  | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>);

export function useSearchParams(): [URLSearchParams, (next: SetSearchParams, options?: NavigateOptions) => void] {
  const location = useTanStackLocation();
  const router = useRouter();
  const searchStr = location.searchStr ?? "";

  const params = useMemo(() => new URLSearchParams(searchStr), [searchStr]);

  const setParams = useCallback(
    (next: SetSearchParams, options?: NavigateOptions) => {
      const resolved = typeof next === "function" ? next(new URLSearchParams(searchStr)) : next;
      const usp = resolved instanceof URLSearchParams ? resolved : new URLSearchParams(resolved);
      const qs = usp.toString();
      void router.navigate({
        to: location.pathname,
        search: Object.fromEntries(new URLSearchParams(qs).entries()),
        replace: options?.replace ?? false,
      });
    },
    [router, location.pathname, searchStr],
  );

  return [params, setParams];
}

export { Outlet, Navigate, useRouter } from "@tanstack/react-router";
