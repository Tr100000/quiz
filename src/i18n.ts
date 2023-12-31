const searchParams = new URLSearchParams(window.location.search);

const fallbackLocale = "en";
const supportedLocales = ["en", "ja"];

let fallbackTranslations: any;
let translations: any;
let locale = searchParams.get("lang") ?? fallbackLocale;

let browserLocales = navigator.languages.map(locale => locale.split("-")[0]);

export let initFinished = false;

if (!searchParams.get("lang")) {
    locale = supportedLocales.find(locale => browserLocales.indexOf(locale) > -1) ?? fallbackLocale;
}

const localeSelect = document.getElementById("locale_select") as HTMLSelectElement;
localeSelect.value = locale;
localeSelect.onchange = async () => {
    setLocale(localeSelect.value);
}

document.addEventListener("DOMContentLoaded", async () => {
    fallbackTranslations = await fetchTranslations(fallbackLocale);
    if (fallbackLocale != locale) {
        await setLocale(locale);
    }
    else {
        translations = fallbackTranslations;
        translatePage();
    }
    document.body.removeAttribute("style");
    initFinished = true;
});

async function setLocale(locale: string) {
    translations = await fetchTranslations(locale);
    translatePage();
}

async function fetchTranslations(locale: string) {
    return await (await fetch(`/quiz/lang/${locale}.json`)).json();
}

function translatePage() {
    document.querySelectorAll("[i18n]").forEach(translateElement);
    console.log("Page translated!");
}

function translateElement(element: Element) {
    const key = element.getAttribute("i18n")!;
    element.innerHTML = getTranslation(key);
}

export function getTranslation(key: string): string {
    if (!(translations || fallbackTranslations)) {
        return "Oops!";
    }
    return translations[key] ?? fallbackTranslations[key];
}
