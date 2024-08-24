/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    darkMode: "class",
    theme: {
        colors: {
            primary: "var(--primary)",
            primaryDark: "var(--primaryDark)",
            primaryLight: "var(--primaryLight)",

            primaryTransparent: "var(--primaryTransparent)",
            primaryOutline: "var(--primaryOutline)",

            secondary: "var(--secondary)",
            secondaryDark: "var(--secondaryDark)",
            secondaryLight: "var(--secondaryLight)",

            secondaryTransparent: "var(--secondaryTransparent)",
            secondaryOutline: "var(--secondaryOutline)",

            black: "var(--black)",
            white: "var(--white)",
            whiteTransparent: "var(--whiteTransparent)",
            gray: "var(--gray)",
            softGray: "var(--softGray)",
            lightGray: "var(--lightGray)",
            darkGray: "var(--darkGray)",

            danger: "#FF4D4D",
            dangerOutline: "#de48486b",
            warning: "#FBBC05",
            gold: "#D1A829",
            orange: "#EE632C",
            red: "#FF0000",
            success: "#2299DC",
            transparent: "#00000085",
            clear: "#00000000",

            "blue-light": "#8AC1E9",
            "green-dark": "#00AE06",
            "green-soft": "#8AE9DD",
            "green-light": "#A1E976",
            "orange-light": "#FFC178",
            "red-light": "#FFEAEA",
            "gray-dark": "var(--gray-dark)",
        },
        fontFamily: {
            sans: ["Product Sans Medium", "Open Sans", "sans-serif"],
        },
        extend: {
            spacing: {
                "3xl": "25rem",
                "4xl": "30rem",
                "5xl": "34.375rem",
                "6xl": "40rem",
                "7xl": "60rem",
                "8xl": "96rem",
                "9xl": "128rem",
            },
            borderRadius: {
                "4xl": "2rem",
            },
            gridRow: {
                "span-10": "span 10 / span 10",
                "span-7": "span 7 / span 7",
            },
        },
    },
    plugins: [],
};
