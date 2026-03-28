// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

// import en from "./locales/en.json";
// import hi from "./locales/hi.json";
// import pa from "./locales/pa.json";

// i18n
//     .use(LanguageDetector) // auto detect
//     .use(initReactI18next)
//     .init({
//         resources: {
//             en: { translation: en },
//             hi: { translation: hi },
//             pa: { translation: pa },
//         },
//         fallbackLng: "en", // default english
//         interpolation: {
//             escapeValue: false,
//         },
//     });

// export default i18n;


import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import pa from "./locales/pa.json";

// ✅ Get saved language from localStorage
const savedLang = localStorage.getItem("appLanguage") || "en";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            pa: { translation: pa },
        },

        lng: savedLang, // 🔥 set from localStorage
        fallbackLng: "en",

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;