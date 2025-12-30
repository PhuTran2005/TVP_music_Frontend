"use strict";
exports.__esModule = true;
var config = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                "music-bar": {
                    "0%, 100%": { height: "20%" },
                    "50%": { height: "100%" }
                }
            },
            animation: {
                "music-bar-1": "music-bar 0.8s ease-in-out infinite",
                "music-bar-2": "music-bar 1.1s ease-in-out infinite",
                "music-bar-3": "music-bar 0.9s ease-in-out infinite"
            }
        }
    },
    plugins: []
};
exports["default"] = config;
