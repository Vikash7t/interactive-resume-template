# ResuCraft AI — Design System & Visual Specification

---

## 1. Brand Aesthetics & Inspiration
The ResuCraft AI visual identity is directly grounded in the precision engineering aesthetic of the **PostgreSQL / pgAdmin 4 splash interface**:
* **Theme:** "Precision Engineering meets Intelligent Career Crafting."
* **Philosophy:** Clean geometric surfaces, technical sophistication, low visual noise, and absolute visual hierarchy.

---

## 2. Color Palette (Extracted & Balanced for WCAG 2.1 AA Compliance)

```
        Primary Brand                  Secondary Accent                Tertiary Highlight
        #396DA6 (Postgres Blue)         #5E429A (Amethyst Indigo)      #1C73A6 (Cyan Slate)
        ┌─────────────────────┐        ┌─────────────────────┐        ┌─────────────────────┐
        │  Action Buttons     │        │  AI Enhancements    │        │  Status Badges      │
        │  Active Nav Tabs    │        │  Feature Highlights │        │  Metrics & Scores   │
        └─────────────────────┘        └─────────────────────┘        └─────────────────────┘
```

### 2.1 Color Tokens & Hex Codes

| Token Name | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| **`--primary`** | `#2B5C8F` (Deep Postgres) | `#4D88C7` (Electric Blue) | Primary CTA buttons, focused rings, key links |
| **`--primary-hover`** | `#1F4770` | `#639BD6` | Button hover states |
| **`--secondary`** | `#5E429A` (Amethyst) | `#8E6DC9` (Soft Violet) | AI Copilot buttons, smart badges, active tools |
| **`--secondary-hover`**| `#4A317D` | `#A081DC` | Secondary hover states |
| **`--accent`** | `#1C73A6` (Cyan Slate) | `#38BDF8` (Sky) | Keyword match highlights, ATS score rings |
| **`--background`** | `#F8FAFD` (Ice Canvas) | `#0B1120` (Deep Midnight Slate) | Main page background |
| **`--surface`** | `#FFFFFF` | `#131D31` (Card Slate) | Editor panels, preview cards, modals |
| **`--surface-subtle`**| `#EDF4FA` | `#1A263D` | Sidebar backgrounds, input field backgrounds |
| **`--border`** | `#D4E2EE` | `#22334F` | Subtle dividing borders, card outlines |
| **`--text-primary`** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | High-contrast body text, headings |
| **`--text-muted`** | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Secondary labels, timestamps, placeholders |
| **`--success`** | `#15803D` (Emerald 700) | `#22C55E` (Emerald 500) | Passed ATS checks, saved status |
| **`--warning`** | `#B45309` (Amber 700) | `#F59E0B` (Amber 500) | Missing keywords, recommended skills |
| **`--danger`** | `#DC2626` (Red 600) | `#EF4444` (Red 500) | Delete actions, validation errors |

---

## 3. Typography Specification

To maintain a crisp, modern, technical aesthetic that feels right at home in developer tooling:
* **Primary Sans-Serif Font:** `Inter`, `Geist Sans`, or system `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
* **Monospace Font (Code & ATS Raw Tokens):** `JetBrains Mono`, `Fira Code`, or `ui-monospace`.

### Hierarchy Scale:
* **H1 / Page Title:** `2rem (32px)` / Weight: `700 (Bold)` / Line-height: `1.2`
* **H2 / Section Title:** `1.5rem (24px)` / Weight: `600 (Semi-bold)` / Line-height: `1.3`
* **H3 / Card Title:** `1.125rem (18px)` / Weight: `600 (Semi-bold)` / Line-height: `1.4`
* **Body / Inputs:** `0.875rem (14px)` to `1rem (16px)` / Weight: `400 (Regular)`
* **Microcopy / Captions / Badges:** `0.75rem (12px)` / Weight: `500 (Medium)`

---

## 4. UI Component Architecture & Elevation

1. **Split-Screen Studio:**
   - **Editor Pane:** Left side (50% desktop), clean vertical flow, accordion sections for Experience/Education/Skills.
   - **Gutter Divider:** 4px interactive resize bar with subtle hover feedback (`#396DA6`).
   - **Preview Pane:** Right side (50% desktop), centered A4 canvas with subtle drop-shadow (`box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15)`).
2. **Buttons & Controls:**
   - Radius: `0.375rem (6px)` — crisp and modern, not bubbly.
   - Transitions: `150ms ease-in-out` on all interactive states.
   - Keyboard Focus: `outline: 2px solid var(--primary)` with `2px offset`.
