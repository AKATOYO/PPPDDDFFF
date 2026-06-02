<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCR & Geolocation Extractor</title>
    <!-- PDF.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
    <!-- Tesseract.js -->
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <!-- SweetAlert2 for nice loading alerts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        :root {
            --primary: #2563eb;
            --bg: #f8fafc;
            --border: #e2e8f0;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg);
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 { color: #1e293b; }
        .container {
            width: 100%;
            max-width: 1000px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .upload-section {
            border: 2px dashed var(--border);
            padding: 40px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 20px;
            cursor: pointer;
            transition: 0.3s;
        }
        .upload-section:hover { border-color: var(--primary); background: #f1f5f9; }
        input[type="file"] { display: none; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid var(--border);
            padding: 12px;
            text-align: left;
        }
        th { background-color: #f1f5f9; color: #334155; }
        tr:hover { background-color: #f8fafc; }
        .btn-download {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 15px;
        }
        .btn-download:hover { background-color: #1d4ed8; }
        .badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>📄 OCR & Geolocation Extractor</h1>
    <p>Upload PDF or Images. The system will extract text, identify the format (IMAGE / REF / TXT), and map their X,Y coordinates.</p>

    <div class="upload-section" onclick="document.getElementById('fileInput').click()">
        <h3>Drag & Drop or Click to Upload</h3>
        <p>Supports: PDF, PNG, JPG, JPEG</p>
        <input type="file" id="fileInput" accept=".pdf,.png,.jpg,.jpeg" multiple>
    </div>

    <div id="statusMessage" style="text-align: center; color: #475569; margin: 10px 0;"></div>

    <button class="btn-download" id="downloadBtn" style="display: none;" onclick="downloadCSV()">⬇ Download CSV (Image, Ref, Txt)</button>

    <table id="resultTable" style="display: none;">
        <thead>
            <tr>
                <th>Page / Source</th>
                <th>IMAGEN (Top)</th>
                <th>X, Y (Image)</th>
                <th>REF (Middle)</th>
                <th>X, Y (Ref)</th>
                <th>TXT (Bottom)</th>
                <th>X, Y (Txt)</th>
            </tr>
        </thead>
        <tbody id="tableBody">
        </tbody>
    </table>
</div>

<script>
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    const fileInput = document.getElementById('fileInput');
    const tableBody = document.getElementById('tableBody');
    const resultTable = document.getElementById('resultTable');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let extractedData = [];

    fileInput.addEventListener('change', async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        extractedData = [];
        tableBody.innerHTML = '';
        
        const { value: progress } = await Swal.fire({
            title: 'Processing Document',
            html: 'Initializing OCR Engine...<br><small>This may take a moment depending on the file size.</small>',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type === 'application/pdf') {
                    await processPDF(file);
                } else {
                    await processImage(file, "Img-1");
                }
            }

            resultTable.style.display = 'table';
            downloadBtn.style.display = 'inline-block';
            Swal.fire('Success!', 'Data extracted and formatted successfully.', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Something went wrong during processing.', 'error');
        }
    });

    // Convert File to Base64/Data URL
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Process PDF: Render pages to images, then OCR
    async function processPDF(file) {
        const dataUrl = await readFileAsDataURL(file);
        const pdf = await pdfjsLib.getDocument(dataUrl).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 }); // Scale for better OCR accuracy
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const imgDataUrl = canvas.toDataURL('image/png');
            
            await processImage(imgDataUrl, `PDF-Page-${i}`);
        }
    }

    // Process Image with Tesseract OCR
    async function processImage(source, sourceName) {
        const isUrl = typeof source === 'string' && source.startsWith('data:');
        
        const worker = await Tesseract.createWorker('eng+spa'); // Add languages as needed e.g., eng+spa
        const { data } = await worker.recognize(isUrl ? source : source);
        await worker.terminate();

        if (data && data.words) {
            parseAndFormatData(data.words, sourceName);
        }
    }

    // Parse OCR Words to find the format: IMAGE (top), REF (middle), TXT (bottom)
    function parseAndFormatData(words, sourceName) {
        // Sort words by Y (top) then X (left) to simulate reading order
        const sortedWords = words.sort((a, b) => a.bbox.y0 - b.bbox.y0 || a.bbox.x0 - b.bbox.x0);

        for (let i = 0; i < sortedWords.length; i++) {
            const currentWord = sortedWords[i].text.toUpperCase();
            
            // Look for the keyword "REF"
            if (currentWord.includes("REF")) {
                const refWord = sortedWords[i];
                const refY = refWord.bbox.y0;
                const refX = refWord.bbox.x0;

                let imageWord = null;
                let txtWord = null;

                // Search for IMAGE (Above REF) - Lower Y value, similar X
                for (let j = 0; j < sortedWords.length; j++) {
                    if (i === j) continue;
                    const word = sortedWords[j];
                    // If it's above (word Y < ref Y) and roughly aligned vertically (X overlap)
                    if (word.bbox.y0 < refY && Math.abs(word.bbox.x0 - refX) < 100) {
                        if (!imageWord || word.bbox.y0 > imageWord.bbox.y0) { // Closest word above
                            imageWord = word;
                        }
                    }
                }

                // Search for TXT (Below REF) - Higher Y value, similar X
                for (let k = 0; k < sortedWords.length; k++) {
                    if (i === k) continue;
                    const word = sortedWords[k];
                    // If it's below (word Y > ref Y) and roughly aligned vertically
                    if (word.bbox.y0 > refY && Math.abs(word.bbox.x0 - refX) < 100) {
                        if (!txtWord || word.bbox.y0 < txtWord.bbox.y0) { // Closest word below
                            txtWord = word;
                        }
                    }
                }

                // If we found the structure, push to data
                if (imageWord || txtWord) {
                    const formatData = {
                        source: sourceName,
                        image: imageWord ? imageWord.text : "N/A",
                        image_xy: imageWord ? `X:${Math.round(imageWord.bbox.x0)}, Y:${Math.round(imageWord.bbox.y0)}` : "N/A",
                        ref: refWord.text,
                        ref_xy: `X:${Math.round(refWord.bbox.x0)}, Y:${Math.round(refWord.bbox.y0)}`,
                        txt: txtWord ? txtWord.text : "N/A",
                        txt_xy: txtWord ? `X:${Math.round(txtWord.bbox.x0)}, Y:${Math.round(txtWord.bbox.y0)}` : "N/A"
                    };

                    extractedData.push(formatData);
                    appendToTable(formatData);
                }
            }
        }
    }

    function appendToTable(data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="badge">${data.source}</span></td>
            <td><strong>${data.image}</strong></td>
            <td>${data.image_xy}</td>
            <td>${data.ref}</td>
            <td>${data.ref_xy}</td>
            <td>${data.txt}</td>
            <td>${data.txt_xy}</td>
        `;
        tableBody.appendChild(row);
    }

    // Download formatted data as CSV
    function downloadCSV() {
        if (extractedData.length === 0) return;

        const headers = ["Source", "IMAGEN", "X_Y_Image", "REF", "X_Y_REF", "TXT", "X_Y_TXT"];
        const csvRows = [
            headers.join(','),
            ...extractedData.map(row => 
                `"${row.source}","${row.image}","${row.image_xy}","${row.ref}","${row.ref_xy}","${row.txt}","${row.txt_xy}"`
            )
        ].join('\n');

        const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'Extracted_OCR_Geolocation.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
</script>

</body>
</html>
