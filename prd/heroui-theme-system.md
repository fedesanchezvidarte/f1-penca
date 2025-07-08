# F1 Penca — HeroUI Theme System

> **Note**: This design system is now built using **HeroUI with custom themes** defined in `theme.json`. All styling follows HeroUI's theme system with our custom F1-inspired color palette.

## Theme Configuration

The application uses HeroUI's theme system with a custom dark theme configuration located in `prd/theme.json`. The theme provides:

- **Primary Colors**: F1 Racing Red palette (#dc2626 variants)
- **Secondary Colors**: Racing Blue palette (#2563eb variants)  
- **Status Colors**: Success green, Warning yellow, Danger purple
- **Semantic Colors**: Background, foreground, content levels, dividers

## HeroUI Integration

### TailwindCSS Configuration

The theme is integrated in `tailwind.config.mjs`:

```javascript
import { heroui } from "@heroui/react";
import { themes } from "./prd/theme.json";

const config = {
  plugins: [
    heroui({
      addCommonColors: false,
      defaultTheme: "dark",
      defaultExtendTheme: "dark",
      layout: { disabledOpacity: "0.4" },
      themes: themes
    })
  ],
};
```

### Global Styles

Custom component classes in `globals.css`:

```css
/* F1 Racing themed gradients using theme colors */
.btn-f1-red {
  @apply bg-gradient-to-r from-primary-400 to-primary-300 text-danger-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105;
}

.btn-f1-blue {
  @apply bg-gradient-to-r from-secondary-600 to-primary-400 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105;
}

/* Enhanced border utilities using theme colors */
.border-themed {
  @apply border-divider;
}

/* Racing-themed card variants */
.card-racing {
  @apply bg-content1 border border-divider shadow-lg backdrop-blur-sm;
}

.card-racing-translucent {
  @apply bg-content1/80 border border-divider backdrop-blur-md shadow-xl;
}

/* Enhanced text utilities */
.text-muted {
  @apply text-default-500;
}

.text-emphasis {
  @apply text-primary font-semibold;
}
```

## Component Usage Examples

### Buttons

```jsx
import { Button } from "@heroui/react";

// Primary F1 Red button
<Button color="primary" className="btn-f1-red">
  Make Prediction
</Button>

// Secondary F1 Blue button  
<Button color="secondary" className="btn-f1-blue">
  View Details
</Button>

// Standard theme buttons
<Button color="primary" variant="solid">Primary</Button>
<Button color="secondary" variant="bordered">Secondary</Button>
```

### Cards

```jsx
import { Card, CardBody, CardHeader } from "@heroui/react";

<Card className="card-racing">
  <CardHeader>
    <h3 className="text-foreground">Race Prediction</h3>
  </CardHeader>
  <CardBody>
    <p className="text-muted">Content here</p>
  </CardBody>
</Card>

// Translucent variant for overlays
<Card className="card-racing-translucent">
  <CardBody>
    <p className="text-foreground">Overlay content</p>
  </CardBody>
</Card>
```

### Tables

```jsx
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

<Table 
  aria-label="Leaderboard"
  classNames={{
    wrapper: "card-racing-translucent",
    th: "bg-content2 text-muted font-semibold",
    td: "text-foreground"
  }}
>
  <TableHeader>
    <TableColumn>Position</TableColumn>
    <TableColumn>User</TableColumn>
    <TableColumn>Points</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>1</TableCell>
      <TableCell>User Name</TableCell>
      <TableCell className="text-emphasis">150</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Navigation

```jsx
import { Navbar, NavbarBrand, NavbarContent, Tabs, Tab } from "@heroui/react";

<Navbar className="border-themed-bottom">
  <NavbarBrand>
    <span className="text-foreground font-bold">F1 Penca</span>
  </NavbarBrand>
  <NavbarContent>
    <Tabs color="primary" variant="underlined">
      <Tab title="Home" />
      <Tab title="Leaderboard" />
      <Tab title="Races" />
    </Tabs>
  </NavbarContent>
</Navbar>
```

## Theme Colors Reference

The theme provides semantic color tokens that automatically adapt:

- `text-foreground` - Primary text color
- `text-muted` - Secondary/muted text  
- `text-emphasis` - Emphasized text (primary color)
- `bg-background` - Main background
- `bg-content1` - Card/container background
- `bg-content2` - Secondary container background
- `border-divider` - Border color
- `color="primary"` - F1 Racing red
- `color="secondary"` - Racing blue
- `color="success"` - Success green
- `color="warning"` - Warning yellow
- `color="danger"` - Danger purple
