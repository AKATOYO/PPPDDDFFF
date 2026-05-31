const fileInput = document.getElementById('file-input');
const pdfPreview = document.getElementById('pdf-preview');
const btnOCR = document.getElementById('apply-ocr');
const btnDownload = document.getElementById('download');
const statusDiv = document.getElementById('status');

let originalPDFBlob = null;
let ocrText = "";
let pagesCanvas = [];

fileInput.addEventListener('change', handleFileSelect);
btnOCR.addEventListener('click', applyOCR);
btnDownload.addEventListener('click', downloadOCRText);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
        alert('Por favor selecciona un archivo PDF.');
        return;
    }
    originalPDFBlob = file;
    previewPDF(file);
}

async function previewPDF(file) {
    // Limpia la vista previa
    pdfPreview.innerHTML = "";
    pagesCanvas = [];
    ocrText = "";
    btnDownload.disabled = true;
    statusDiv.textContent = "Cargando PDF...";

    const url = URL.createObjectURL(file);
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.js';

    const pdf = await pdfjsLib.getDocument(url).promise;
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        // Añadir la página a la vista previa
        pdfPreview.appendChild(canvas);
        pagesCanvas.push(canvas);
    }
    URL.revokeObjectURL(url);
    statusDiv.textContent = "PDF cargado. Listo para aplicar OCR.";
}

async function applyOCR() {
    if (pagesCanvas.length === 0) {
        alert("Primero carga un PDF.");
        return;
    }
    statusDiv.textContent = "Aplicando OCR...";
    ocrText = "";
    for (let i = 0; i < pagesCanvas.length; i++) {
        const canvas = pagesCanvas[i];
        const dataURL = canvas.toDataURL('image/png');
        const result = await Tesseract.recognize(dataURL, 'spa', {
            logger: m => {
                statusDiv.textContent = `Reconociendo página ${i + 1} de ${pagesCanvas.length}: ${Math.round(m.progress * 100)}%`;
            }
        });
        ocrText += result.data.text + "\n\n";
    }
    statusDiv.textContent = "OCR completado.";
    btnDownload.disabled = false;
}

function downloadOCRText() {
    const blob = new Blob([ocrText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo_ocr.txt';  // Puedes cambiar a .pdf si quieres convertir a PDF
    a.click();
    URL.revokeObjectURL(url);
}
