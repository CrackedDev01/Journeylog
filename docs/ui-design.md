# JourneyLog UI design contract

Direction: a calm, professional personal workspace. Existing sign-in, daily dashboard, and monthly goals screens are the references; no external reference catalogue was supplied. Preserve their forest-green identity while replacing inconsistent olive tones and decorative gradients with forest, sage, warm white, and a small amber accent.

- Sign-in and registration: one clear action, persistent labels, password visibility, inline request errors, and honest progress states. The decorative weekly preview is explicitly illustrative.
- Workspace: visible navigation and clear current location, a compact date/account header, and a content area prioritizing daily focus, tasks, and monthly goals. On small screens use a labelled menu drawer rather than a permanently narrow icon rail.
- Monthly planning: primary action is New goal; retain category/status filters, month navigation, goal editing and reviews. Distinguish an empty month from empty filter results.
- Use a 4px spacing scale, restrained 8–12px corners, subtle borders, sans-serif interface typography, and serif only for editorial headings. Semantic tokens define colors and interaction states.
- Provide loading skeletons, retryable errors, meaningful empty states and accurate activity indicators. Never infer completed activity from the current date.
- Native dialogs provide focus containment, Escape dismissal, return focus and background isolation. Visible focus, labelled controls, reduced motion, touch targets and responsive layouts are required.
- Verify at 320, 768, 1024 and 1440px. Reject gradients, excessive shadows, fake actions, fabricated metrics and implementation instructions in product copy.

## Verification — 22 October 2026

- Production build passed. Existing third-party `use client` bundling warnings remain.
- Headless Chrome checks covered sign-in, registration, Today, mobile navigation, monthly empty and populated views, goal creation, progress updates, review dialogs, filter reset and failed-request retry.
- Layout checks passed at 320, 768, 1024 and 1440px without document overflow.
- Axe WCAG 2 A/AA and 2.1 AA scans reported no violations in ten checked views/states. This is automated coverage, not a full accessibility certification.
- No browser page errors during those checks. Dialog Escape dismissal and focus restoration passed.
- API responses and goal mutations were mocked in the test browser; no real account data was changed. Live backend behavior was outside this UI verification.
