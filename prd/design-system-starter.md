# F1 Penca — Design System Starter

## 1. Colors

### Base (Dark Theme)

| Purpose            | Tailwind Class   | Hex        | Example Usage         |
|--------------------|------------------|------------|-----------------------|
| Main Background    | `bg-gray-950`    | #0a0a0a    | Page background       |
| Card/Container     | `bg-gray-900`    | #18181b    | Cards, navbars, modals|
| Border/Divider     | `border-gray-800`| #27272a    | Card borders, dividers|

### Text

| Purpose            | Tailwind Class   | Hex        |
|--------------------|------------------|------------|
| Primary Text       | `text-gray-100`  | #f4f4f5    |
| Secondary Text     | `text-gray-400`  | #a1a1aa    |
| Disabled/Muted     | `text-gray-600`  | #52525b    |

### Accents

| Purpose            | Tailwind Class   | Hex        | Usage                         |
|--------------------|------------------|------------|-------------------------------|
| Primary Accent Red | `red-600`        | #dc2626    | Buttons, highlights           |
| Hover Accent Red   | `red-700`        | #b91c1c    | Button hover/active           |
| **OR**             |                  |            |                               |
| Primary Accent Blue| `blue-600`       | #2563eb    | Buttons, highlights           |
| Hover Accent Blue  | `blue-700`       | #1d4ed8    | Button hover/active           |

### Status (Successful / Warning)

| Purpose            | Tailwind Class   | Hex        |
|--------------------|------------------|------------|
| Success            | `green-500`      | #22c55e    |
| Warning            | `yellow-400`     | #facc15    |

---

## 2. Typography

- **Font Family:** `Inter, sans-serif` (Tailwind default)
- **Weights:**
  - Bold for headers/app name
  - Medium for buttons
  - Regular for body/description
- **Initial Sizes:**
  - App Title: `48px` (`text-4xl`)
  - Headings: `24–32px` (`text-2xl`–`text-3xl`)
  - Body: `16–20px` (`text-base`–`text-lg`)
  - Small/hints: `12px` (`text-xs`)

---

## 3. Borders and Shadows

- **Border radius:** `rounded-xl` (`16px`)
- **Shadow:** subtle drop shadow (`black`, 20% opacity, 8px blur)

---

## 4. Login Screen Example

- Centered logo/app name in accent color
- Subtitle below (secondary text)
- Google Sign-In button (with icon, accent color, full width on mobile)
- Minimal footer with disclaimer/legal text

---

## 5. Quick Color Reference

- **Background:** `#0a0a0a`
- **Card/Container:** `#18181b`
- **Accent Red:** `#dc2626`
- **Accent Blue:** `#2563eb`
- **Primary Text:** `#f4f4f5`
- **Secondary Text:** `#a1a1aa`
- **Border:** `#27272a`
- **Disabled Text:** `#52525b`
- **Font:** Inter

---

> _Tip: All colors and font weights/sizes correspond directly to Tailwind CSS utility classes for faster dev implementation!_
