import * as main from "./main";

const fileReader = new FileReader();
let isLoadingData = false;

fileReader.onloadend = fileDataLoadFinished;
fileReader.onerror = fileDataLoadFailed;
fileReader.onabort = fileDataLoadFailed;

export function loadDataFromFile() {
    if (!isLoadingData && main.canLoadQuiz && main.uploadInput.files != null && main.uploadInput.files.length > 0) {
        isLoadingData = true;

        const selectedFile: File = main.uploadInput.files[0];
        fileReader.readAsText(selectedFile);
    }
}

function fileDataLoadFinished() {
    isLoadingData = false;

    main.parseData(fileReader.result as string);
}

function fileDataLoadFailed() {
    isLoadingData = false;

    alert("Something went wrong while loading quiz data!");
}

export function loadDataFromUrl(url: string) {
    if (!isLoadingData && main.canLoadQuiz) {
        isLoadingData = true;
        
        fetch(new URL(url)).then(r => {
            return r.text();
        })
        .then(text => {
            main.parseData(text);
            isLoadingData = false;
        })
        .catch(() => {
            alert("Failed to load data!");
            isLoadingData = false;
        });
    }
}
