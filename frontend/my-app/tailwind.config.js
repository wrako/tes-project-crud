/** @type {import('tailwindcss').Config} */
module.exports = {
  // Пути, где Tailwind будет искать ваши классы
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",        // App Router
    "./components/**/*.{js,ts,jsx,tsx}",     // Компоненты вне src/app
    "./src/styles/**/*.{js,ts,jsx,tsx}",     // Если вдруг есть папка styles в src (необязательно)
  ],
  theme: {
    extend: {
      // Здесь можно добавить свои цвета/шрифты/брейкпоинты, если нужно.
      colors: {
        primary: "hsl(220, 90%, 56%)",
        secondary: "hsl(340, 82%, 52%)",
      },
    },
  },
  plugins: [
    // Если вы хотите использовать плагины Tailwind (Forms, Typography и т.д.),
    // раскомментируйте и установите их через npm (tailwindcss/forms, tailwindcss/typography).
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
