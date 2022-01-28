const dropZone = document.querySelector(".dropzone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const uploadPercent = document.querySelector("#percent");
const filesUploaded = document.querySelector(".upload");
const fileURL = document.querySelector("#url");
const fileContainer = document.querySelector(".file-container");
const copyBtn = document.querySelector("#copy-btn");
const emailForm = document.querySelector(".email-form");

const emailURL = "https://eshare-app.herokuapp.com/api/send";

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();

    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files
    if (files.length) {
        fileInput.files = files
        uploadFile()
    }
});

fileInput.addEventListener("change", () => {
    uploadFile();
})

browseBtn.addEventListener("click", () => {
    fileInput.click();
})

copyBtn.addEventListener("click", () => {
    fileURL.select();
    document.execCommand("copy");
})

const uploadFile = () => {
    progress.style.display = "block";
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfiles", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgess;

    xhr.upload.onerror = ()=>{
        fileInput.value = "";
    }

    xhr.open("POST", "https://eshare-app.herokuapp.com/api", true);
    xhr.send(formData)
};

const updateProgess = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${percent}%`
    filesUploaded.innerText = "Uploading files...";
    uploadPercent.innerText = percent;
    if (percent == 100) {
        filesUploaded.innerText = "Files uploaded";
    }
    progressBar.style.transform = `scaleX(${percent / 100})`
}

const showLink = ({ file: url }) => {
    progress.style.display = "none";
    fileContainer.style.display = "block";
    fileURL.value = url;
};

emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = fileURL.value;
    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["To"].value,
        emailFrom: emailForm.elements["From"].value
    }

    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then(res => res.json()).then(({success}) => {
        if(success){
            fileContainer.style.display = "none";
            alert("Email sent successfully");
        }
        if(!success){
            alert("Email not sent");
        }
    });
});
