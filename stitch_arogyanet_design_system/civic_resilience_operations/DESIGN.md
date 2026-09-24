---
name: Civic Resilience Operations
colors:
  surface: '#f9f9ff'
  surface-dim: '#d4dae9'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e8eefd'
  surface-container-high: '#e3e8f7'
  surface-container-highest: '#dde2f2'
  on-surface: '#161c26'
  on-surface-variant: '#46464b'
  inverse-surface: '#2b313c'
  inverse-on-surface: '#ecf0ff'
  outline: '#76777b'
  outline-variant: '#c6c6cb'
  surface-tint: '#5d5e64'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1a1b21'
  on-primary-container: '#82838a'
  inverse-primary: '#c6c6cd'
  secondary: '#006a65'
  on-secondary: '#ffffff'
  secondary-container: '#8cf4eb'
  on-secondary-container: '#00716b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e0061'
  on-tertiary-container: '#8974dc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e9'
  primary-fixed-dim: '#c6c6cd'
  on-primary-fixed: '#1a1b21'
  on-primary-fixed-variant: '#45474c'
  secondary-fixed: '#8cf4eb'
  secondary-fixed-dim: '#6fd7cf'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#00504c'
  tertiary-fixed: '#e7deff'
  tertiary-fixed-dim: '#cbbeff'
  on-tertiary-fixed: '#1e0061'
  on-tertiary-fixed-variant: '#4a349a'
  background: '#f9f9ff'
  on-background: '#161c26'
  surface-variant: '#dde2f2'
  app-bg: '#EDEEF0'
  workspace-surface: '#F8F8FA'
  card-surface: '#FFFFFF'
  surface-muted: '#F3F4F6'
  text-primary: '#111318'
  text-secondary: '#626875'
  text-muted: '#8D93A1'
  border-hairline: '#E7E9EE'
  action-hover: '#252830'
  teal-accent: '#0F8F88'
  teal-tint: '#E7F7F5'
  purple-accent: '#A994FF'
  purple-tint: '#EEE8FF'
  amber-accent: '#F2C94C'
  amber-tint: '#FFF2BF'
  red-critical: '#E05252'
  red-tint: '#FDEAEA'
  green-healthy: '#2FA86B'
  green-tint: '#E7F7EF'
  blue-info: '#4A90E2'
  blue-tint: '#EAF3FF'
typography:
  metric-display:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: '0'
  headline-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: '0'
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: '0'
  headline-md:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: '0'
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: '0'
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: '0'
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

# ArogyaNet Design Specification for Google Stitch

## Product Direction

ArogyaNet is an AI-powered public-health resource resilience dashboard for district and state health administrators. It monitors Primary Health Centres (PHCs), predicts medicine stock-outs, highlights bed and staff pressure, and recommends safe redistribution actions across the network.

Design the product as a calm civic operations dashboard, not a consumer wellness app. The interface should feel modern, trustworthy, soft, and highly scannable, inspired by the attached reference image: a light canvas, floating rounded panels, pill navigation, large clear metrics, compact charts, and gentle status colors.

Primary user: a non-technical district health administrator who needs to understand risk and take action within seconds.

Core tagline: "See the shortage before it happens. Move resources before it's a crisis."

## Visual Style

Use a soft command-center layout with a premium dashboard feel:

- Warm light grey app background.
- Large rounded white workspace container.
- Floating white cards with subtle borders and very soft shadows.
- Black or deep navy active navigation pills.
- Soft purple, teal, amber, red, and green status accents.
- Rounded pill filters and action buttons.
- Friendly but official tone: approachable, calm, and decisive.
- No harsh enterprise table-heavy look unless the screen specifically needs inventory details.
- No stock photography, hero images, decorative gradients, maps as the main visual, or wellness/gym styling.

The attached reference image should guide the interaction density, card proportions, rounded edges, spacing, and pill-shaped controls. Replace fitness content with public health operations content.

## Design Tokens

### Colors

- App background: `#EDEEF0`
- Main workspace surface: `#F8F8FA`
- Card surface: `#FFFFFF`
- Raised muted surface: `#F3F4F6`
- Primary text: `#111318`
- Secondary text: `#626875`
- Muted text: `#8D93A1`
- Hairline border: `#E7E9EE`
- Soft shadow: `0 18px 45px rgba(17, 19, 24, 0.08)`

### Brand and Action Colors

- Primary action black: `#111318`
- Primary action hover: `#252830`
- Teal AI accent: `#0F8F88`
- Teal tint: `#E7F7F5`
- Purple accent: `#A994FF`
- Purple tint: `#EEE8FF`
- Amber accent: `#F2C94C`
- Amber tint: `#FFF2BF`
- Red critical: `#E05252`
- Red tint: `#FDEAEA`
- Green healthy: `#2FA86B`
- Green tint: `#E7F7EF`
- Blue info: `#4A90E2`
- Blue tint: `#EAF3FF`

### Typography

Use Inter, Manrope, or a similar clean rounded sans-serif.

- Page title: 34-40px, line-height 1.05, weight 700, letter spacing 0
- Section title: 20-24px, line-height 1.2, weight 700
- Card title: 17-19px, line-height 1.25, weight 700
- Body text: 14px, line-height 20px, weight 400
- Small/meta text: 12-13px, line-height 18px, weight 400
- Metric numerals: 44-64px, line-height 1, weight 600, tabular numerals
- Button labels: 14px, weight 600

Do not use negative letter spacing. Keep text compact and legible.

### Layout

Desktop canvas target: 1440px wide.

- Outer page padding: 44-56px
- Main app shell: centered, max width 1320-1440px, min height 860px, radius 28-36px
- App shell padding: 28-32px
- Top navigation height: 54-64px
- Card radius: 18-24px
- Button and chip radius: 999px for pills, 12px for rectangular controls
- Card padding: 20-28px
- Main grid gap: 16-24px

Keep the first viewport as a complete working dashboard. Do not create a marketing landing page.

## Navigation

Use a top pill navigation system like the reference image, not a dark left sidebar.

Top-left:

- Small circular product mark using a health cross plus connected-node motif.
- Product label may be shown as "ArogyaNet" near the mark on wider screens.

Main nav pills:

- Dashboard
- PHC Network
- Alerts
- Redistribution
- BRICS Network
- Assistant

Active nav:

- Black pill background `#111318`
- White text
- White/grey icon

Inactive nav:

- White pill background
- Soft border or shadow
- Secondary text
- Outline icon

Top-right utility icons:

- Search
- Notifications with red dot badge
- Refresh/sync
- Theme toggle or display mode toggle
- User avatar for District Admin
