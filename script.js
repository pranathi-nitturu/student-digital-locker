let documents = [];

const fileInput = document.getElementById("fileInput");
const cameraInput = document.getElementById("cameraInput");

function openUpload() {
    document.getElementById("uploadModal").style.display = "block";
}

function closeUpload() {
    document.getElementById("uploadModal").style.display = "none";
}

function chooseFile() {
    fileInput.click();
}

function openCamera() {
    cameraInput.click();
}

function handleFile(file) {

    if (!file) return;

    const nameInput = document.getElementById("documentName");

    let documentName =
        nameInput.value.trim() ||
        file.name.replace(/\.[^/.]+$/, "");

    const documentType =
        document.getElementById("documentType").value;

    const newDocument = {
        id: Date.now(),
        name: documentName,
        type: documentType,
        fileName: file.name,
        size: file.size,
        date: new Date().toLocaleDateString(),
        verified: false,
        url: URL.createObjectURL(file)
    };

    documents.push(newDocument);

    saveDocuments();

    displayDocuments();

    closeUpload();

    document.getElementById("documentName").value = "";

    alert("Document uploaded successfully! 🎉");
}


function displayDocuments() {

    const container =
        document.getElementById("documentList");

    const search =
        document.getElementById("searchInput").value
        .toLowerCase();

    const filtered =
        documents.filter(doc =>
            doc.name.toLowerCase().includes(search) ||
            doc.type.toLowerCase().includes(search)
        );

    container.innerHTML = "";

    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="document-card">
                <div class="document-icon">📭</div>
                <h3>No documents found</h3>
                <p>Upload your first academic document.</p>
            </div>
        `;

        updateStats();
        return;
    }

    filtered.forEach(doc => {

        const card = document.createElement("div");

        card.className = "document-card";

        card.innerHTML = `
            <div class="document-icon">
                ${getIcon(doc.type)}
            </div>

            <h3>${doc.name}</h3>

            <p>
                ${doc.type}<br>
                Uploaded: ${doc.date}
            </p>

            <div class="verified">
                ${doc.verified ? "✓ Verified" : "○ Pending Verification"}
            </div>

            <div class="document-actions">

                <button
                    class="view-btn"
                    onclick="viewDocument(${doc.id})">
                    View
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteDocument(${doc.id})">
                    Delete
                </button>

            </div>
        `;

        container.appendChild(card);
    });

    updateStats();
}


function getIcon(type) {

    switch(type) {

        case "Certificate":
            return "🏆";

        case "Marksheet":
            return "📊";

        case "ID Proof":
            return "🪪";

        case "Bonafide":
            return "📜";

        case "Resume":
            return "📄";

        default:
            return "📁";
    }
}


function viewDocument(id) {

    const doc = documents.find(d => d.id === id);

    if (!doc) return;

    window.open(doc.url, "_blank");
}


function deleteDocument(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this document?");

    if (!confirmDelete) return;

    documents =
        documents.filter(doc => doc.id !== id);

    saveDocuments();

    displayDocuments();
}


function updateStats() {

    document.getElementById("documentCount")
        .textContent = documents.length;

    const verified =
        documents.filter(doc => doc.verified).length;

    document.getElementById("verifiedCount")
        .textContent = verified;

    const totalBytes =
        documents.reduce(
            (total, doc) => total + doc.size,
            0
        );

    document.getElementById("storageCount")
        .textContent = formatSize(totalBytes);
}


function formatSize(bytes) {

    if (bytes === 0)
        return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024)
        return kb.toFixed(1) + " KB";

    return (kb / 1024).toFixed(1) + " MB";
}


function saveDocuments() {

    // Save document information only.
    // Browser object URLs are temporary.

    const data = documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        fileName: doc.fileName,
        size: doc.size,
        date: doc.date,
        verified: doc.verified
    }));

    localStorage.setItem(
        "studentDocuments",
        JSON.stringify(data)
    );
}


function loadDocuments() {

    const saved =
        localStorage.getItem("studentDocuments");

    if (saved) {

        documents =
            JSON.parse(saved).map(doc => ({
                ...doc,
                url: "#"
            }));
    }

    displayDocuments();
}


window.onclick = function(event) {

    const modal =
        document.getElementById("uploadModal");

    if (event.target === modal) {
        closeUpload();
    }
};


loadDocuments();