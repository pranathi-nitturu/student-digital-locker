/* =========================
   STUDENT DIGITAL LOCKER
   ========================= */

let documents = [
    {
        name: "SSC Certificate.pdf",
        category: "Education",
        icon: "📜"
    },

    {
        name: "Intermediate Marksheet.pdf",
        category: "Education",
        icon: "🎓"
    },

    {
        name: "Aadhaar Card.pdf",
        category: "ID Proof",
        icon: "🪪"
    }
];

let cameraStream = null;
let selectedDocument = null;


/* =========================
   DISPLAY DOCUMENTS
   ========================= */

function displayDocuments() {

    const container =
        document.getElementById("documents");

    container.innerHTML = "";

    documents.forEach((doc, index) => {

        const card =
            document.createElement("div");

        card.className = "document";

        card.innerHTML = `

            <div class="document-icon">
                ${doc.icon}
            </div>

            <h3>${doc.name}</h3>

            <p>
                ${doc.category}
                • Stored securely 🔒
            </p>

            <button
                class="view"
                onclick="viewDocument(${index})">

                👁 View

            </button>

            <button
                class="delete"
                onclick="deleteDocument(${index})">

                🗑 Delete

            </button>

        `;

        container.appendChild(card);
    });

    document.getElementById("documentCount")
        .innerText = documents.length;
}


/* =========================
   UPLOAD MODAL
   ========================= */

function openUpload() {

    document.getElementById("uploadModal")
        .style.display = "flex";
}


function closeUpload() {

    document.getElementById("uploadModal")
        .style.display = "none";
}


/* =========================
   CAMERA
   ========================= */

async function openCamera() {

    closeUpload();

    document.getElementById("cameraModal")
        .style.display = "flex";

    try {

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            throw new Error("Camera unavailable");
        }

        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },

                audio: false

            });

        document.getElementById("camera")
            .srcObject = cameraStream;

    }

    catch (error) {

        document.getElementById("cameraError")
            .innerText =
            "Camera permission denied or unavailable. " +
            "Please allow camera access or use Upload from Files.";

    }
}


/* =========================
   CAPTURE DOCUMENT
   ========================= */

function captureDocument() {

    const video =
        document.getElementById("camera");

    const canvas =
        document.getElementById("canvas");

    if (!video.videoWidth) {

        alert("Camera is not ready. Please try again.");

        return;
    }

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;

    const context =
        canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const image =
        canvas.toDataURL("image/jpeg");

    selectedDocument = {

        name: "Scanned Document",

        category: "Other",

        image: image

    };

    closeCamera();

    openSaveModal();

}


/* =========================
   CLOSE CAMERA
   ========================= */

function closeCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => track.stop());

        cameraStream = null;
    }

    document.getElementById("cameraModal")
        .style.display = "none";
}


/* =========================
   FILE UPLOAD
   ========================= */

function selectFile(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    selectedDocument = {

        name: file.name,

        category: "Other",

        file: file,

        image: null

    };

    closeUpload();

    const reader =
        new FileReader();

    reader.onload = function(e) {

        selectedDocument.image =
            e.target.result;

        openSaveModal();

    };

    reader.readAsDataURL(file);
}


/* =========================
   SAVE MODAL
   ========================= */

function openSaveModal() {

    document.getElementById("saveModal")
        .style.display = "flex";

    const input =
        document.getElementById("documentName");

    input.value =
        selectedDocument.name
        .replace(/\.[^/.]+$/, "");

    const preview =
        document.getElementById("preview");

    if (selectedDocument.image) {

        preview.src =
            selectedDocument.image;

        preview.style.display =
            "block";

    } else {

        preview.style.display =
            "none";
    }
}


function closeSave() {

    document.getElementById("saveModal")
        .style.display = "none";
}


/* =========================
   SAVE DOCUMENT
   ========================= */

function saveDocument() {

    const name =
        document.getElementById("documentName")
            .value
            .trim();

    const category =
        document.getElementById("category")
            .value;

    if (!name) {

        alert("Please enter a document name.");

        return;
    }

    let extension = "jpg";

    if (
        selectedDocument.file &&
        selectedDocument.file.name.includes(".")
    ) {

        extension =
            selectedDocument.file.name
            .split(".")
            .pop();

    }

    documents.unshift({

        name: name + "." + extension,

        category: category,

        icon:
            category === "Education"
                ? "🎓"
                : category === "ID Proof"
                ? "🪪"
                : "📄"

    });

    displayDocuments();

    closeSave();

    showToast(
        "✅ Document uploaded successfully!"
    );
}


/* =========================
   SEARCH
   ========================= */

function searchDocuments() {

    const query =
        document.getElementById("search")
            .value
            .toLowerCase();

    const cards =
        document.querySelectorAll(".document");

    cards.forEach(card => {

        const text =
            card.innerText.toLowerCase();

        card.style.display =
            text.includes(query)
                ? "block"
                : "none";
    });
}


/* =========================
   DELETE
   ========================= */

function deleteDocument(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this document?"
        );

    if (!confirmDelete) return;

    documents.splice(index, 1);

    displayDocuments();

    showToast(
        "🗑 Document deleted"
    );
}


/* =========================
   VIEW
   ========================= */

function viewDocument(index) {

    alert(
        "📄 Document\n\n" +

        "Name: " +
        documents[index].name +

        "\nCategory: " +
        documents[index].category +

        "\n\n🔒 Prototype preview"
    );
}


/* =========================
   PERSONAL INFORMATION
   ========================= */

function showInfo() {

    document.getElementById("infoModal")
        .style.display = "flex";
}


function closeInfo() {

    document.getElementById("infoModal")
        .style.display = "none";
}


/* =========================
   TOAST
   ========================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 2500);
}


/* =========================
   INITIAL LOAD
   ========================= */

displayDocuments();