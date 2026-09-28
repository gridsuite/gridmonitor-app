# UI Styling Guidelines

These guidelines apply to React and Material UI styling in GridMonitor.

## Colors

- Use theme colors (`theme.palette`, or references such as `color: 'error.main'`) for semantic roles.
- When MUI provides the exact shade needed, import it from `@mui/material/colors` (for example, `grey[900]`, `purple.A700`, or `cyan[800]`). Check the actual values in both light and dark modes.
- Keep an explicit CSS color when no MUI color exactly matches the intended appearance.

## Spacing and dimensions

- Use MUI's spacing scale for margins, gaps, and padding: `sx={{ px: 3, mt: 2, gap: 1 }}` or `<Stack spacing={2}>`. With the default spacing scale, `1` equals `8px`.
- Use `theme.spacing(n)` when a calculated spacing value is needed outside an `sx` property that already applies the scale; avoid `sx={{ px: theme.spacing(3) }}`.
- Do not use the spacing scale for fixed dimensions, borders, font sizes, or border radii. A numeric `height` in `sx` means pixels (`height: 56`), while a percentage remains a string (`height: '100%'`). Include units where the CSS property or API requires them.

## Responsive

- The application theme defines `xs: 0` as the baseline and `sm: 768` as its only nonzero breakpoint; `md`, `lg`, and `xl` are disabled in its types. Use `xs` and `sm` for responsive values, for example, `direction={{ xs: 'column', sm: 'row' }}`.
- Do not rely on responsive object types alone: some properties accept an `md` key even though the application theme does not define it. Before integrating dependency components, check whether they assume `md` exists; this theme does not provide that breakpoint.
