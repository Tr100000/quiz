const fallbackLocale = "en";

let fallbackTranslations: any;
let translations: any;
let locale = fallbackLocale;

let browserLocales = navigator.languages.map(locale => locale.split("-")[0]);

const localeSelect = document.getElementById("locale_select") as HTMLSelectElement;
localeSelect.value = locale;
localeSelect.onchange = async () => {
    setLocale(localeSelect.value);
}

export function init() {
    locale = browserLocales.find(locale => browserLocales.indexOf(locale) > -1) ?? fallbackLocale;

    document.addEventListener("DOMContentLoaded", async () => {
        await setLocale(fallbackLocale);
        fallbackTranslations = translations;
    });
}

async function setLocale(locale: string) {
    translations = await fetchTranslations(locale);
    translatePage();
}

async function fetchTranslations(locale: string) {
    return await (await fetch(`/lang/${locale}.json`)).json();
}

function translatePage() {
    document.querySelectorAll("[i18n]").forEach(translateElement);
}

function translateElement(element: Element) {
    const key = element.getAttribute("i18n")!;
    element.innerHTML = getTranslation(key);
}

export function getTranslation(key: string): string {
    return translations[key] ?? fallbackTranslations[key];
}
