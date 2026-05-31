const fileInput = document.getElementById('file-input');
const thumbnailsContainer = document.getElementById('thumbnails');
const btnOcr = document.getElementById('btn-ocr');
const btnClear = document.getElementById('btn-clear');
const downloadBtn = document.getElementById('download-btn');
const progressDiv = document.getElementById('progress');
const statusDiv = document.getElementById('status');

let originalPdfBlob = null;
let ocrText = '';
let pdfDocument = null;

// Función para renderizar miniaturas de todas las páginas
async function renderThumbnails(file) {
  thumbnailsContainer.innerHTML = '';
  const fileReader = new FileReader();
  fileReader.onload = async () => {
    const typedarray = new Uint8Array(fileReader.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;
    pdfDocument = pdf;
    const numPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      // Escalar para miniatura
      const thumb = document.createElement('canvas');
      thumb.width = 80;
      thumb.height = (viewport.height / viewport.width) * 80;
      const thumbCtx = thumb.getContext('2d');
      thumbCtx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
      // Agregar miniatura
      thumbnailsContainer.appendChild(thumb);
    }
  };
  fileReader.readAsArrayBuffer(file);
}

// Limpia toda la interfaz
function limpiar() {
  fileInput.value = '';
  thumbnailsContainer.innerHTML = '';
  btnOcr.disabled = true;
  downloadBtn.disabled = true;
  statusDiv.innerText = '';
  progressDiv.innerText = '';
  ocrText = '';
  originalPdfBlob = null;
  pdfDocument = null;
  document.getElementById('btn-clear').disabled = true;
}

// Manejar selección de archivo
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file && file.type === 'application/pdf') {
    originalPdfBlob = file;
    renderThumbnails(file);
    btnOcr.disabled = false;
    downloadBtn.disabled = true;
    statusDiv.innerText = '';
    ocrText = '';
    document.getElementById('btn-clear').disabled = false;
  } else {
    alert('Por favor, seleccione un archivo PDF válido.');
    limpiar();
  }
});

// Función para aplicar OCR en todas las páginas
async function applyOCR() {
  if (!originalPdfBlob || !pdfDocument) return;
  statusDiv.innerText = '';
  progressDiv.innerText = 'Procesando OCR...';
  ocrText = '';

  const numPages = pdfDocument.numPages;
  let fullText = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    statusDiv.innerText = `Procesando página ${pageNum} de ${numPages}...`;
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 }); // mayor escala para mejor OCR
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport: viewport }).promise;

    // Convertir canvas a blob para OCR
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

    // OCR en la imagen
    const result = await Tesseract.recognize(blob, 'spa', {
      logger: m => {
        progressDiv.innerText = `Reconociendo página ${pageNum}: ${Math.round(m.progress * 100)}%`;
      }
    });
    fullText += result.data.text + '\n';
  }

  ocrText = fullText;
  statusDiv.innerText = 'OCR completado.';
  progressDiv.innerText = '';
  downloadBtn.disabled = false;
}

// Evento para botón OCR
document.getElementById('btn-ocr').addEventListener('click', () => {
  applyOCR();
});

// Función para descargar el contenido OCR en txt
function downloadText() {
  if (!ocrText) return;
  const blob = new Blob([ocrText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'archivo_ocr.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Evento para botón de descarga
downloadBtn.addEventListener('click', () => {
  downloadText();
});

// Evento para limpiar
document.getElementById('btn-clear').addEventListener('click', () => {
  limpiar();
});
