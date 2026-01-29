# Moltbot Web — Roadmap (public demo)

Last updated: 2026-01-29 (UTC)

## Recently shipped (2026-01-29)
- **Calendar event action buttons now usable on mobile + keyboard**
  - Mobile: action icons are visible by default (no hover required)
  - Desktop: actions appear on hover and `:focus-within`
  - Added `:focus-visible` outline for better accessibility
- **Build footer chip respects iOS safe-area insets**
  - Prevents the chip from sitting under the iPhone home indicator
- **Added real `/robots.txt` + `/sitemap.xml`**
  - Correct content-types; no longer served by SPA fallback


## Next (high-signal, small)
1. **Fix first-paint loading placeholder (avoid blank screen on slow JS)**
   - Observed (live CSS): `.loading-placeholder{display:none}` hides the placeholder as soon as CSS loads, which can produce a brief blank page before React mounts.
   - Change: keep the placeholder visible by default; hide/remove it only after React mounts.

2. **Make project GitHub affordance visible on desktop (accessibility + credibility)**
   - Observed (live CSS): `.project-link` is `opacity: 0` until hover on desktop.
   - Change: show it by default (or at least for keyboard focus via `:focus-visible`).

3. **Remove personal naming from the public demo**
   - Observed: header says **“Good morning, Swap”** on the public site.
   - Change: default to a generic greeting (e.g., “Good morning”) and allow optional local-only name in settings.

4. **Fix mobile header ergonomics (Import/Export + focus)**
   - Observed: on mobile, the Import/Export controls feel cramped and the “Today’s focus” input is easy to miss.
   - Change: make Import/Export full-width stacked buttons (or a single “Data” menu) and visually elevate “Today’s focus”.

5. **Hide or de-emphasize the build/deploy debug line**
   - Observed: a "Build: <hash> | Deployed: <timestamp>" line appears between sections and looks like a UI glitch.
   - Change: move to a tiny footer, hide behind a “Details” toggle, or dev-only.

## Soon
6. **Make mobile scanning easier with collapsible sections**
   - Observed: on mobile, the page is very long (Money → Calendar → Projects) and requires lots of scrolling.
   - Change: add a simple accordion / collapse toggle per section; remember state locally.

7. **Add “Today’s focus” presets tied to goals**
   - Add quick-pick chips like: “Debt payoff sprint”, “Raise monthly income”, “Travel prep”, “Ship feature”.
   - Keep local-only; no real financial data.

## Later
8. **Accessibility + semantics pass** (labels, contrast checks, keyboard)
9. **Lightweight analytics (privacy-preserving)** (optional)
