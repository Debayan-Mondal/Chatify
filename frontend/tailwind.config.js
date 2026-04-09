import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["forest",
      {
        forestLight: {
          "primary": "#1eb854",       // Vibrant leaf green
          "primary-content": "#ffffff",
          "secondary": "#1db88e",     // Teal-leaning green
          "accent": "#1db8ab",        // Soft cyan-green
          "neutral": "#19362d",       // Deep forest green for text/icons
          "base-100": "#f0f7f4",      // Soft minty off-white background
          "base-200": "#e1ede8",      // Slightly darker for cards/sections
          "base-300": "#ceded6",      // Border and divider color
          "base-content": "#19362d",  // High-contrast text
          "info": "#66c6ff",
          "success": "#87d039",
          "warning": "#e2d562",
          "error": "#ff6f6f",
          "--rounded-box": "0.2rem",   // rounded corners for cards/modals
          "--rounded-btn": "0.2rem",   // rounded corners for buttons
          "--rounded-badge": "0.2rem", // rounded corners for badges
          "--tab-radius": "0.2rem",
        },
      }
    ],
  },
}