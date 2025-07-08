# F1 Penca — Design System Starter

> **Note**: This design system is built using **HeroUI (NextUI)** components with **TailwindCSS** customization. HeroUI provides the foundation components while maintaining our custom theme and color palette.

## 1. Colors

### Base (Dark Theme)

| Purpose            | Tailwind Class   | Hex        | Example Usage         | HeroUI Equivalent     |
|--------------------|------------------|------------|-----------------------|-----------------------|
| Main Background    | `bg-gray-950`    | #0a0a0a    | Page background       | `background`          |
| Card/Container     | `bg-gray-900`    | #18181b    | Cards, navbars, modals| `content1`            |
| Border/Divider     | `border-gray-800`| #27272a    | Card borders, dividers| `divider`             |

### Text

| Purpose            | Tailwind Class   | Hex        | HeroUI Equivalent     |
|--------------------|------------------|------------|-----------------------|
| Primary Text       | `text-gray-100`  | #f4f4f5    | `foreground`          |
| Secondary Text     | `text-gray-400`  | #a1a1aa    | `foreground-500`      |
| Disabled/Muted     | `text-gray-600`  | #52525b    | `foreground-300`      |

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

### Custom Gradient Styles

| Purpose                | CSS Class               | Gradient Definition                    | Usage                     |
|------------------------|-------------------------|----------------------------------------|---------------------------|
| Red Gradient Button    | `btn-red-gradient`      | `from-red-700 to-red-500`            | Primary action buttons    |
| Blue Teal Gradient     | `btn-blue-teal-gradient`| `from-blue-600 to-teal-400`          | Secondary action buttons  |

**Implementation Example:**
```css
/* Defined in globals.css */
.btn-red-gradient {
  @apply bg-gradient-to-tr from-red-700 to-red-500 shadow-lg;
}

.btn-blue-teal-gradient {
  @apply bg-gradient-to-tr from-blue-600 to-teal-400 shadow-lg;
}
```

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

### Custom Gradients
- **Red Gradient:** `from-red-700 to-red-500` (Class: `btn-red-gradient`)
- **Blue Teal Gradient:** `from-blue-600 to-teal-400` (Class: `btn-blue-teal-gradient`)

---

## 6. HeroUI Components Integration

### Core Components Used

#### Buttons
```jsx
import { Button } from "@nextui-org/react";

// Primary button (F1 Red theme)
<Button color="danger" variant="solid" size="lg">
  Make Prediction
</Button>

// Custom Gradient Buttons
<Button 
  variant="solid" 
  size="lg"
  className="btn-red-gradient text-white font-semibold"
>
  Primary Action
</Button>

<Button 
  variant="solid" 
  size="lg"
  className="btn-blue-teal-gradient text-white font-semibold"
>
  Secondary Action
</Button>

// Secondary button
<Button color="default" variant="bordered">
  View Details
</Button>
```

#### Cards
```jsx
import { Card, CardBody, CardHeader } from "@nextui-org/react";

<Card className="bg-gray-900 border-gray-800">
  <CardHeader>
    <h3 className="text-gray-100">Race Prediction</h3>
  </CardHeader>
  <CardBody>
    <p className="text-gray-400">Content here</p>
  </CardBody>
</Card>
```

#### Navigation
```jsx
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";

<Navbar className="bg-gray-900 border-b border-gray-800">
  <NavbarBrand>
    <p className="font-bold text-red-600">F1 Penca</p>
  </NavbarBrand>
  <NavbarContent>
    <NavbarItem>
      <Link color="foreground" href="/predictions">
        Predictions
      </Link>
    </NavbarItem>
  </NavbarContent>
</Navbar>
```

#### Forms
```jsx
import { Input, Select, SelectItem } from "@nextui-org/react";

<Input
  type="text"
  label="Driver Name"
  placeholder="Select a driver"
  variant="bordered"
  className="text-gray-100"
/>

<Select
  label="Position"
  placeholder="Select position"
  variant="bordered"
  className="text-gray-100"
>
  <SelectItem key="1" value="1">1st Place</SelectItem>
  <SelectItem key="2" value="2">2nd Place</SelectItem>
</Select>
```

#### Tables (Leaderboard)
```jsx
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

<Table 
  aria-label="Leaderboard"
  className="bg-gray-900"
  classNames={{
    th: "bg-gray-800 text-gray-100",
    td: "text-gray-100"
  }}
>
  <TableHeader>
    <TableColumn>POSITION</TableColumn>
    <TableColumn>USER</TableColumn>
    <TableColumn>POINTS</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow key="1">
      <TableCell>1</TableCell>
      <TableCell>User Name</TableCell>
      <TableCell>150</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Theme Configuration

#### NextUI Theme Setup
```typescript
// tailwind.config.js
import { nextui } from "@nextui-org/react";

module.exports = {
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#0a0a0a",
            foreground: "#f4f4f5",
            content1: "#18181b",
            content2: "#27272a",
            divider: "#27272a",
            danger: "#dc2626", // F1 Red
            primary: "#2563eb", // F1 Blue alternative
          },
        },
      },
    }),
  ],
};
```

#### Animation & Motion
- **Framer Motion** integration for smooth page transitions
- **HeroUI animations** for component interactions
- **Loading states** with skeleton components
- **Hover effects** on interactive elements
