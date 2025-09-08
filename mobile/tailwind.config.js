/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        spacegrotesk: ["SpaceGrotesk-Regular", "sans-serif"],
        "spacegrotesk-bold": ["SpaceGrotesk-Bold", "sans-serif"],
        "spacegrotesk-semibold": ["SpaceGrotesk-SemiBold", "sans-serif"],
        "spacegrotesk-light": ["SpaceGrotesk-Light", "sans-serif"],
        "spacegrotesk-medium": ["SpaceGrotesk-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
