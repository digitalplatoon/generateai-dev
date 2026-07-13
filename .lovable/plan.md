
# Full-Project Audit — Findings & Implementation Plan

## Findings

### Bugs
1. **Light theme is broken.** `src/App.tsx` wraps the whole app in `bg-dark` (hardcoded), so toggling to light leaves a black page.
2. **Dead social links.** `Footer.tsx` still has three `href="#"` icons (Twitter, dev.to, Code). No target, no `rel="noopener"`.
3. **No scroll-to-top on route change.** Navigating between long pages preserves the previous scroll position — content appears mid-page.
4. **Hardcoded `bg-navy` / `text-white` classes** across ~15 files bypass the theme tokens. In light mode they render as unreadable dark blocks. High-visibility offenders: `HeroSection`, `LearningPathsSection`, `PromptLibrarySection`, `LearningPaths`, `PromptLibrary`, `Auth`, `Documentation`, `Blog`, `ApiReference`.
5. **Console noise in production.** `AuthContext` already guards logs, but ~30 `console.error` calls run unconditionally in hooks/components.

### Accessibility
6. **No "Skip to main content" link** for keyboard users.
7. **`<main>` has no `id`** — skip link can't target it.
8. **Theme toggle has no visible focus ring style beyond default.**

### UX / Polish
9. **404 page** likely inherits `bg-dark` wrapper — verify still readable in light mode.
10. **Route transitions** are abrupt; the lazy Suspense spinner flashes even for tiny chunks.

## Implementation Plan

### Phase 1 — Theme & Layout Bugs (highest impact)
- `src/App.tsx`: replace `bg-dark` with `bg-background` and add `text-foreground`. Add `id="main"` to `<main>`.
- Add a **ScrollToTop** component that resets scroll on `pathname` change; mount inside `BrowserRouter`.
- Add **SkipToContent** anchor as first child of the app shell, visible on focus.

### Phase 2 — Footer & Social Links
- Update `Footer.tsx`: point the three social icons to real destinations (Twitter/X, dev.to, GitHub for GenerateAI.dev), add `target="_blank" rel="noopener noreferrer"` and `aria-label`s. Remove any that don't have a real URL.

### Phase 3 — Theme-token migration for high-traffic surfaces
Convert the most visible hardcoded `bg-navy*` / `text-white` / `border-white/10` usages to semantic tokens (`bg-card`, `bg-muted`, `text-foreground`, `border-border`) in:
- `HeroSection.tsx`
- `LearningPathsSection.tsx`
- `LearningPaths.tsx` (page)
- `PromptLibrarySection.tsx`

Lower-priority files (Auth, PromptLibrary page, Blog, Documentation, ApiReference, ChatTab) stay for a follow-up pass — noted but out of scope this turn to keep the change reviewable.

### Phase 4 — Production log hygiene
- Introduce a tiny `logger` helper (`src/lib/logger.ts`) with `error`/`warn` that only forward when `import.meta.env.DEV`.
- Swap the top offender files' `console.error` calls (`useOnboarding`, `RagLabFunctional`, `UserProfile`, `ConversationSharingDialog`, `ProfileSetupStep`, `LearningPreferencesStep`) to use it.

## Out of scope this turn
- Full color-token migration for every legacy page (large mechanical change; queued as Phase 5).
- Backend/RLS/security work (already covered by prior turns).
