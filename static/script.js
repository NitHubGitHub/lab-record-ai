const validateBtn = document.getElementById("validateBtn");

const generateBtn = document.getElementById("generateBtn");

const outputPanel = document.getElementById("outputPanel");
const viewDocBtn =
    document.getElementById("viewDocBtn");


const validationResult =
    document.getElementById("validationResult");

const sectionsPanel =
    document.getElementById("sectionsPanel");

const documentModal =
    document.getElementById("documentModal");

const documentPreview =
    document.getElementById("documentPreview");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const editDocBtn =
    document.getElementById("editDocBtn");

const downloadDocBtn =
    document.getElementById("downloadDocBtn");


let generatedContent = "";
let editedContent = "";
let isEditing = false;

const SECTION_ORDER = [
    "Aim",
    "Requirements",
    "Materials Required",
    "Apparatus Required",
    "Theory",
    "Formula",
    "Algorithm",
    "Flowchart",
    "Procedure",
    "Program",
    "Source Code",
    "Observation",
    "Observation Table",
    "Calculation",
    "Output",
    "Result",
    "Conclusion",
    "Applications",
    "Precautions",
    "Viva Questions",
    "Learning Outcomes",
    "References"
];



validateBtn.addEventListener("click", validateExperiment);
generateBtn.addEventListener("click", generateContent);

viewDocBtn.addEventListener(
    "click",
    openDocumentPreview
);

closeModalBtn.addEventListener(
    "click",
    closeDocumentPreview
);

editDocBtn.addEventListener(
    "click",
    toggleEditing
);

downloadDocBtn.addEventListener(
    "click",
    downloadDocument
);


async function validateExperiment() {

    const course =
        document.getElementById("course").value.trim();

    const experiment =
        document.getElementById("experiment").value.trim();

    if (!course || !experiment) {

        validationResult.innerHTML = `
            <div style="color:#ff6b6b; margin-top:20px;">
                Please enter both Course Name and Experiment Name.
            </div>
        `;

        sectionsPanel.classList.add("hidden");
        return;
    }

    validationResult.innerHTML = `
        <div style="margin-top:20px;">
            Validating academic experiment...
        </div>
    `;

    sectionsPanel.classList.add("hidden");

    try {

        const response = await fetch("/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                course,
                experiment
            })
        });

        const data = await response.json();

        generatedContent = data.content;
        editedContent = data.content;

        if (data.valid) {

                    document
            .querySelectorAll(
                '#sectionsPanel input[type="checkbox"]'
            )
            .forEach(cb => {
                cb.checked = false;
            });

        if (data.recommended_sections) {

            data.recommended_sections.forEach(section => {

                const checkbox =
                    document.querySelector(
                        `#sectionsPanel input[value="${section}"]`
                    );

                if (checkbox) {
                    checkbox.checked = true;
                }

            });

        }

            validationResult.innerHTML = `
                <div class="success-box">

                    <div class="success-title">
                        ✓ Academic Experiment Detected
                    </div>

                    <div class="result-item">
                        <strong>Domain:</strong><br>
                        ${data.domain}
                    </div>

                    <div class="result-item">
                        <strong>Corrected Course:</strong><br>
                        ${data.corrected_course}
                    </div>

                    <div class="result-item">
                        <strong>Corrected Experiment:</strong><br>
                        ${data.corrected_experiment}
                    </div>

                </div>
            `;

            sectionsPanel.classList.remove("hidden");

        }

        else if (data.domain === "System") {

            validationResult.innerHTML = `
                <div class="error-box">

                    <div class="error-title">
                        ⚠ Service Unavailable
                    </div>

                    <div class="result-item">
                        ${data.reason}
                    </div>

                </div>
            `;

        }

        else {

            validationResult.innerHTML = `
                <div class="error-box">

                    <div class="error-title">
                        ✗ Invalid Academic Experiment
                    </div>

                    <div class="result-item">
                        ${data.reason}
                    </div>

                </div>
            `;

            sectionsPanel.classList.add("hidden");
        }

    }

    catch(error) {

        validationResult.innerHTML = `
            <div class="error-box">
                Unable to connect to server.
            </div>
        `;

        sectionsPanel.classList.add("hidden");

        console.error(error);
    }
}

async function generateContent() {

    const course =
        document.getElementById("course").value.trim();

    const experiment =
        document.getElementById("experiment").value.trim();

    const selectedSections = [
        ...document.querySelectorAll(
            '#sectionsPanel input[type="checkbox"]:checked'
        )
    ].map(cb => cb.value);

    selectedSections.sort(
        (a, b) =>
            SECTION_ORDER.indexOf(a) -
            SECTION_ORDER.indexOf(b)
    );

    if (selectedSections.length === 0) {

        alert("Please select at least one section.");

        return;
    }

    outputPanel.innerHTML = `
        <div class="placeholder">
            Generating content...
        </div>
    `;

    try {

        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                course,
                experiment,
                sections: selectedSections
            })
        });

        const data = await response.json();

        generatedContent = data.content;

        outputPanel.innerHTML = `
            <pre>${data.content}</pre>
        `;

        viewDocBtn.classList.remove("hidden");

        /* Mobile: jump to output after generation */
        if (window.innerWidth <= 768) {

            document.getElementById("outputPanel")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }

    }

    catch(error) {

        console.error(error);

        outputPanel.innerHTML = `
            <div class="error-box">
                Failed to generate content.
            </div>
        `;
    }
}

function openDocumentPreview() {

    let html = generatedContent;

    // Convert headings
    html = html.replace(
        /^##\s+(.*)$/gm,
        '<div class="doc-heading">$1</div>'
    );

    // Convert code blocks
    html = html.replace(
        /```([\s\S]*?)```/g,
        '<pre class="doc-code">$1</pre>'
    );

    // Convert paragraphs
    html = html.replace(/\n\n/g, '</p><p>');

    html = `
        <div class="doc-container">
            <p>${html}</p>
        </div>
    `;

    documentPreview.innerHTML = html;

    documentModal.style.display = "flex";
}
function closeDocumentPreview() {

    documentModal.style.display = "none";
}

function toggleEditing() {

    const docContainer =
        document.querySelector(".doc-container");

    if (!docContainer) return;

    if (!isEditing) {

        const confirmed = confirm(
            "You are about to edit the generated document.\n\n" +
            "Your edited version will become the final version used for export.\n\n" +
            "Continue?"
        );

        if (!confirmed) {
            return;
        }

        docContainer.contentEditable = "true";

        docContainer.focus();

        editDocBtn.textContent = "Save Changes";

        isEditing = true;
    }

    else {

        editedContent = docContainer.innerText;

        docContainer.contentEditable = "false";

        editDocBtn.textContent = "Edit Document";

        isEditing = false;

        alert("Changes saved.");
    }
}

async function downloadDocument() {

    const content =
        editedContent || generatedContent;

    try {

        const response = await fetch(
            "/download-docx",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: content
                })
            }
        );

        if (!response.ok) {

            const text = await response.text();

            console.error(text);

            alert("Server error while generating DOCX.");

            return;
        }

        const blob = await response.blob();

        const link =
            document.createElement("a");

        link.href =
            URL.createObjectURL(blob);

        link.download =
            "Lab_Record.docx";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    }

    catch(error) {

        console.error(error);

        alert("Download failed.");
    }
}