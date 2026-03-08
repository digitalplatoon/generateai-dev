

# Pre-Deployment Audit Report: GenerateAI.dev

## EXECUTIVE SUMMARY

- **Engineering Health Score:** 72/100
- **Production Readiness:** Needs Work
- **One-Paragraph Assessment:** The project has a solid foundation with good separation of concerns, proper authentication via server-side role checks, input validation on critical edge functions, and comprehensive SEO coverage. However, there are several high-severity issues: 6 edge functions use wildcard CORS (`*`), no edge functions have request timeouts (AbortController), no React Error Boundaries exist, zero code splitting (no React.lazy), and the `check-subscription` function returns "subscribed: true" on errors -- a logic flaw that grants free access on failure. The RLS policies are now correctly PERMISSIVE, and the security scan shows only one informational warning (pgvector extension in public schema).

- **Top 10 Critical Risks:**

| # | Risk | Severity | File | Impact |
|---|------|----------|------|--------|
| 1 | `check-subscription` returns `subscribed: true` on error | Critical | `supabase/functions/check-subscription/index.ts:140` | Users get free access when Stripe is down |
| 2 | 6 edge functions use wildcard CORS `*` | High | `check-subscription`, `create-checkout`, `customer-portal`, `newsletter-subscribe`, `seo-discover-urls`, `seo-generate-prompts` | Cross-origin attacks possible on payment endpoints |
| 3 | No AbortController/timeouts on external API calls in edge functions | High | All 11 edge functions | Functions can hang indefinitely on external API failures |
| 4 | No React Error Boundaries | High | `src/App.tsx` | Unhandled errors crash entire app |
| 5 | No code splitting (React.lazy) | Medium | `src/App.tsx` | All 31 pages loaded upfront, large initial bundle |
| 6 | `seo-generate-prompts` and `seo-discover-urls` have no auth check | High | `supabase/functions/seo-generate-prompts/index.ts:14-20` | Any authenticated user can trigger expensive AI calls |
| 7 | `ai-chat` has no AbortController on OpenAI fetch | High | `supabase/functions/ai-chat/index.ts:186` | Streaming can hang indefinitely |
| 8 | Stale sitemap dates (2024-2025) | Medium | `public/sitemap.xml` | Search engines may deprioritize crawling |
| 9 | Footer copyright says "2025" | Low | `src/components/Footer.tsx:85` | Looks outdated |
| 10 | Google Site Verification placeholder | Medium | `src/components/seo/SEOHead.tsx:36` | `YOUR_GOOGLE_SITE_VERIFICATION_CODE` is still placeholder |

---

## DETAILED FINDINGS BY SECTION

### Section 1: Repository Structure & Architecture

- **Total Issues Found:** 3
- **Critical:** 0 | **High:** 0 | **Medium:** 2 | **Low:** 1

Good separation: `components/`, `hooks/`, `services/`, `pages/`, `types/`, `contexts/`. Edge functions are well-organized. UI components use shadcn/ui pattern correctly.

**Issue 1.1: Unused/Duplicate Page Files**
- **Severity:** Low
- **Location:** `src/pages/RagLab.tsx`, `src/pages/AgentPlayground.tsx`
- **Evidence:** These pages exist but are not routed in `App.tsx` -- `RagLabFunctional` and `AgentsFunctional` are used instead.
- **Impact:** Dead code, developer confusion
- **Fix:** Delete `RagLab.tsx` and `AgentPlayground.tsx`

**Issue 1.2: No Code Splitting**
- **Severity:** Medium
- **Location:** `src/App.tsx:10-42`
- **Evidence:** All 31 page components are statically imported. No `React.lazy()` or `Suspense` usage found.
- **Impact:** Large initial JS bundle, slower first load
- **Fix:** Use `React.lazy()` for all route-level components with `<Suspense>` fallback

---

### Section 2: Performance Optimization

- **Total Issues Found:** 4
- **Critical:** 0 | **High:** 1 | **Medium:** 3 | **Low:** 0

**Issue 2.1: No Code Splitting**
- (Same as 1.2 above)

**Issue 2.2: No React.memo/useMemo/useCallback Optimizations**
- **Severity:** Medium
- **Location:** Project-wide (0 instances found)
- **Evidence:** `grep -r "React.memo\|React.lazy" src/` returns 0 results
- **Impact:** Unnecessary re-renders in component-heavy pages
- **Fix:** Add `React.memo` to heavy components like `ChatMessagesArea`, `ConversationSidebar`

**Issue 2.3: N+1 Query in rag-query**
- **Severity:** High
- **Location:** `supabase/functions/rag-query/index.ts:113-118`
- **Evidence:**
  ```typescript
  for (const chunk of chunks || []) {
    const { data: document } = await supabaseClient
      .from('rag_documents')
      .select('name')
      .eq('id', chunk.document_id)
      .single();
  ```
- **Impact:** Up to 50 sequential DB queries per RAG search
- **Fix:** Batch-fetch document names with `.in('id', documentIds)` in a single query

**Issue 2.4: Sequential Embedding Generation in rag-process-document**
- **Severity:** Medium
- **Location:** `supabase/functions/rag-process-document/index.ts:138-149`
- **Evidence:** Chunks are processed one-by-one with `for` loop calling OpenAI sequentially
- **Impact:** Document processing takes O(n) API calls serially
- **Fix:** Batch embeddings using OpenAI's array input or process in parallel batches

---

### Section 3: Security Hardening

- **Total Issues Found:** 7
- **Critical:** 1 | **High:** 3 | **Medium:** 2 | **Low:** 1

**Issue 3.1: check-subscription Returns "subscribed: true" on Error (STOP-SHIP)**
- **Severity:** Critical
- **Location:** `supabase/functions/check-subscription/index.ts:139-148`
- **Evidence:**
  ```typescript
  } catch (error) {
    // Return free plan on error
    return new Response(JSON.stringify({
      subscribed: true,
      subscription_tier: "free",
      subscription_end: null,
    }), { status: 200 });
  }
  ```
- **Impact:** If Stripe is down or any error occurs, ALL users get treated as subscribed. This bypasses payment checks.
- **Fix:** Return `subscribed: false` or status 500 on error, and handle gracefully in the UI.

**Issue 3.2: Wildcard CORS on Payment Edge Functions**
- **Severity:** High
- **Location:** `supabase/functions/check-subscription/index.ts:7`, `create-checkout/index.ts:7`, `customer-portal/index.ts:7`, `newsletter-subscribe/index.ts:7`, `seo-discover-urls/index.ts:5`, `seo-generate-prompts/index.ts:5`
- **Evidence:** `"Access-Control-Allow-Origin": "*"` used in the `corsHeaders` constant
- **Impact:** Any website can make CORS requests to payment and admin endpoints
- **Fix:** Apply the same `getCorsHeaders(req)` origin-allowlisting pattern used in `ai-chat` and `rag-query`

**Issue 3.3: No Auth Check in seo-generate-prompts**
- **Severity:** High
- **Location:** `supabase/functions/seo-generate-prompts/index.ts:9-20`
- **Evidence:** Function uses `SUPABASE_SERVICE_ROLE_KEY` directly with no user authentication check. Config has `verify_jwt = true` but no code-level auth validation.
- **Impact:** Any authenticated user can trigger expensive AI prompt generation
- **Fix:** Add admin role check using `has_role` after verifying the JWT token

**Issue 3.4: No Auth Check in seo-discover-urls**
- **Severity:** High
- **Location:** `supabase/functions/seo-discover-urls/index.ts:12-18`
- **Evidence:** Uses service role key, no user authentication or role verification
- **Impact:** Any authenticated user can discover URLs for any project
- **Fix:** Verify authenticated user owns the project or is admin

**Issue 3.5: No Timeouts on External API Calls**
- **Severity:** Medium
- **Location:** All edge functions making `fetch()` calls (ai-chat:186, rag-query:148, rag-process-document:230, seo-scan-project:88, seo-generate-prompts:43, generate-insights:82)
- **Evidence:** No `AbortController` or timeout signals on any external `fetch()` call
- **Impact:** Functions can hang indefinitely if OpenAI/Google APIs are slow
- **Fix:** Add `AbortController` with 30-second timeout to all external API calls

**Issue 3.6: Google Site Verification Placeholder**
- **Severity:** Medium
- **Location:** `src/components/seo/SEOHead.tsx:36`
- **Evidence:** `<meta name="google-site-verification" content="YOUR_GOOGLE_SITE_VERIFICATION_CODE" />`
- **Impact:** Google Search Console not verified; placeholder leaks implementation details
- **Fix:** Replace with actual verification code or remove the tag

**Issue 3.7: User Email Logged in check-subscription**
- **Severity:** Low
- **Location:** `supabase/functions/check-subscription/index.ts:54`
- **Evidence:** `logStep("User authenticated", { userId: user.id, email: user.email })`
- **Impact:** PII (email) in server logs
- **Fix:** Remove `email` from log output

---

### Section 4: SEO Optimization

- **Total Issues Found:** 3
- **Critical:** 0 | **High:** 0 | **Medium:** 2 | **Low:** 1

**Issue 4.1: Stale Sitemap Dates**
- **Severity:** Medium
- **Location:** `public/sitemap.xml` (all entries)
- **Evidence:** All `lastmod` dates are 2024-2025, blog posts from 2024
- **Impact:** Search engines may reduce crawl frequency
- **Fix:** Update all `lastmod` dates to current deployment date

**Issue 4.2: Missing Pages in Sitemap**
- **Severity:** Medium
- **Location:** `public/sitemap.xml`
- **Evidence:** `/analytics`, `/prompt-library` routes exist but are not in the sitemap
- **Impact:** Search engines may not discover these pages
- **Fix:** Add missing public pages to sitemap

**Issue 4.3: Footer Copyright Year**
- **Severity:** Low
- **Location:** `src/components/Footer.tsx:85`
- **Evidence:** `© 2025 Available View. All rights reserved.`
- **Impact:** Looks outdated (current year is 2026)
- **Fix:** Update to 2026 or use dynamic `new Date().getFullYear()`

SEO strengths: All 28+ pages have unique `<SEOHead>` with title, description, keywords, OG tags, Twitter cards, canonical URLs, and structured data. `robots.txt` is properly configured.

---

### Section 5: Code Quality & Maintainability

- **Total Issues Found:** 3
- **Critical:** 0 | **High:** 1 | **Medium:** 1 | **Low:** 1

**Issue 5.1: No React Error Boundaries**
- **Severity:** High
- **Location:** `src/App.tsx`
- **Evidence:** Zero `ErrorBoundary` components found in entire codebase
- **Impact:** Any unhandled error in any component crashes the entire application
- **Fix:** Add Error Boundary wrapper around `<Routes>` and around critical sections like chat

**Issue 5.2: Dead Page Components**
- **Severity:** Low
- **Location:** `src/pages/RagLab.tsx`, `src/pages/AgentPlayground.tsx`
- **Evidence:** Not referenced in `App.tsx` routes; `RagLabFunctional` and `AgentsFunctional` are used instead
- **Fix:** Delete unused files

**Issue 5.3: Double req.json() in Error Handler**
- **Severity:** Medium
- **Location:** `supabase/functions/rag-process-document/index.ts:182`
- **Evidence:**
  ```typescript
  } catch (error) {
    try {
      const { documentId } = await req.json(); // req body already consumed!
  ```
- **Impact:** This will always fail (body already consumed in the try block), making the error recovery path dead code
- **Fix:** Store `documentId` in a variable at the top of the function scope

---

### Section 6: User Experience & Accessibility

- **Total Issues Found:** 2
- **Critical:** 0 | **High:** 0 | **Medium:** 1 | **Low:** 1

**Issue 6.1: Social Media Links are "#"**
- **Severity:** Low
- **Location:** `src/components/Footer.tsx:45-57`
- **Evidence:** `<a href="#" ...>` for Twitter, Pinterest, and Code social links
- **Impact:** Dead links in footer, poor user experience
- **Fix:** Replace with actual social media URLs or remove

**Issue 6.2: Mobile Menu Missing Aria Label**
- **Severity:** Medium
- **Location:** `src/components/Header.tsx:112-117`
- **Evidence:**
  ```tsx
  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="text-muted-foreground focus:outline-none">
  ```
- **Impact:** Screen readers cannot identify the purpose of the hamburger menu button
- **Fix:** Add `aria-label="Toggle navigation menu"` and `aria-expanded={isMobileMenuOpen}`

---

### Section 7: Business Logic & Functionality

- **Total Issues Found:** 2
- **Critical:** 1 | **High:** 1 | **Medium:** 0 | **Low:** 0

**Issue 7.1: Subscription Bypass on Error** (same as 3.1 - STOP-SHIP)

**Issue 7.2: Missing STRIPE_SECRET_KEY**
- **Severity:** High
- **Location:** `supabase/functions/create-checkout/index.ts:52`
- **Evidence:** `STRIPE_SECRET_KEY` is not in the configured secrets list (only OPENAI_API_KEY, RESEND_API_KEY, LOVABLE_API_KEY are present)
- **Impact:** All Stripe payment flows (checkout, subscription check, customer portal) will fail or return default free plan
- **Fix:** Add `STRIPE_SECRET_KEY` secret before going to production with paid plans

---

## IMPLEMENTATION PRIORITY

1. **Immediate (before deploy):** Fix check-subscription error-returns-subscribed logic (3.1), add STRIPE_SECRET_KEY (7.2), fix wildcard CORS on payment functions (3.2), add auth checks to seo functions (3.3, 3.4)
2. **Next sprint:** Add Error Boundaries (5.1), add AbortController timeouts (3.5), implement code splitting (2.1), fix N+1 query (2.3), fix double req.json() (5.3)
3. **Polish:** Update sitemap dates (4.1), fix footer copyright (4.3), add aria labels (6.2), remove dead code (5.2), remove placeholder verification meta tag (3.6)

