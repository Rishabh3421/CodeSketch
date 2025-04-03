import dedent from "dedent";

export const AIModels = [
  {
    name: "Gemini Google",
    icon: "/google.png",
    modelName: "google/gemini-2.0-flash-thinking-exp:free",
  },
  {
    name: "Llama by Meta",
    icon: "/meta.png",
    modelName: "meta-llama/llama-3.2-3b-instruct:free",
  },
  {
    name: "Deepseek",
    icon: "/deepseek.png",
    modelName: "deepseek/deepseek-chat-v3-0324:free",
  },
];

export default {
  PROMPT_OLD: dedent`
    You are an expert frontend React developer. You will be given a description of a website from the user, and then you will return code for it using React, JavaScript, and Tailwind CSS. Follow the instructions carefully; it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export.
- Feel free to have multiple components in the file, but make sure to have one main component that uses all the other components.
- Make sure to describe where everything is in the UI so the developer can recreate it and understand how elements are aligned.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If it's just a wireframe, then add colors and create a real-life, colorful webpage.
- Make sure to mention every part of the screenshot, including any headers, footers, sidebars, etc.
- Use the exact text from the screenshot for UI elements.
- Do not add placeholder comments; write the full code.
- Use placeholder images from: https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png
- Make sure the React app is interactive and functional, using state when needed.
- If you use any React hooks, import them directly.
- Use JavaScript (.js) as the language.
- Use Tailwind CSS classes for styling. DO NOT use arbitrary values like \`h-[600px]\`.
- Ensure proper spacing and layout for a well-structured UI.
- Please ONLY return the full React code starting with the imports, nothing else.`,

  PROMPT: dedent`
    You are a professional React developer and UI/UX designer.
- Based on the provided wireframe image, generate a similar webpage.
- Use the description to write a React + Tailwind CSS component.
- Ensure the page includes a Header and Footer with appropriate options from the wireframe. If none are mentioned, add relevant options based on the description.
- Use the placeholder image: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'.
- Include all small details to make the UI more professional.
- Maintain a consistent color scheme across the page.
- Add colors to make the UI modern and visually appealing.
- Use the Lucide library for icons.
- Do not use any third-party UI libraries.
- Return only React + Tailwind CSS code, with no additional text.
`,

  DEPENDENCY: {
    postcss: "^8",
    tailwindcss: "^3.4.1",
    autoprefixer: "^10.0.0",
    uuid4: "^2.0.3",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "^0.469.0",
    "react-router-dom": "^7.1.1",
    firebase: "^11.1.0",
    "@google/generative-ai": "^0.21.0",
    "date-fns": "^4.1.0",
    "react-chartjs-2": "^5.3.0",
    "chart.js": "^4.4.7",
  },

  FILES: {
    "/App.css": {
      code: `
@tailwind base;
@tailwind components;
@tailwind utilities;
            `,
    },
    "/tailwind.config.js": {
      code: `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
            `,
    },
    "/postcss.config.js": {
      code: `
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
module.exports = config;
            `,
    },
  },
};
