export const theme = {
  // Colors - Pure Black & White with grays
  colors: {
    primary: '#000000',        // Pure black
    secondary: '#FFFFFF',      // Pure white
    background: '#FFFFFF',     // White background
    backgroundAlt: '#F5F5F5',  // Light gray for cards
    text: '#000000',           // Black text
    textLight: '#666666',      // Gray text for secondary info
    border: '#E0E0E0',         // Light gray borders
    success: '#2E7D32',        // Dark green for good scores
    warning: '#F57C00',        // Orange for medium scores
    error: '#C62828',          // Dark red for low scores
    hover: '#F0F0F0',          // Very light gray for hover states
  },

  // Typography
  fonts: {
    main: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    mono: '"Courier New", monospace',  // For code/technical text
  },

  // Spacing (using 8px base unit - industry standard)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Border radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',  // For circular elements
  },

  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.15)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
};