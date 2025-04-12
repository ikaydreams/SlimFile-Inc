/**
 * Handles file compression in the browser
 * Both image (JPEG, PNG, WebP) and PDF files are supported
 */

const MAX_DIMENSION = 3840;
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB max file size
const QUALITY_LEVELS = { 
    high: 0.6,
    medium: 0.45,
    low: 0.25,
    pdf: 0.5
};

// State to store the compressed file
let compressedFile = null;
let originalFileSize = 0;
let compressedFileSize = 0;
let currentFileType = null;

/**
 * Validates the file type and size
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is valid
 */
function validateFile(file) {
    if (!file) {
        showError('No file selected');
        return false;
    }
    
    const validTypes = [
        'image/jpeg', 
        'image/png', 
        'image/webp', 
        'application/pdf'
    ];
    
    if (!validTypes.includes(file.type)) {
        showError('Invalid file type - please upload an image or PDF');
        return false;
    }

    if (file.size > MAX_FILE_SIZE) {
        showError(`File too large (max ${MAX_FILE_SIZE/1024/1024}MB)`);
        return false;
    }

    return true;
}

/**
 * Calculate dimensions for image resizing
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @returns {[number, number]} - New width and height
 */
function calculateDimensions(width, height) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    return ratio < 1 ? 
        [Math.floor(width * ratio), Math.floor(height * ratio)] :
        [width, height];
}

/**
 * Determine quality level based on file size
 * @param {number} fileSize - Size in bytes
 * @returns {number} - Quality level (0-1)
 */
function calculateQuality(fileSize) {
    if (fileSize > 50 * 1024 * 1024) return QUALITY_LEVELS.low;
    if (fileSize > 20 * 1024 * 1024) return QUALITY_LEVELS.medium;
    return QUALITY_LEVELS.high;
}

/**
 * Compresses an image file
 * @param {File} file - The image file to compress
 * @returns {Promise<{compressedBlob: Blob, beforeSize: number, afterSize: number}>}
 */
async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();

        reader.onload = (e) => {
            if (!e.target?.result) {
                reject(new Error('Failed to read file'));
                return;
            }
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const [width, height] = calculateDimensions(img.width, img.height);
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }
                    
                    // Handle transparent PNGs
                    if(file.type === 'image/png') {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    
                    ctx.drawImage(img, 0, 0, width, height);

                    // Format-specific settings
                    const format = file.type === 'image/png' ? 'png' : 'jpeg';
                    const quality = format === 'png' ? 
                        Math.min(QUALITY_LEVELS.high, 0.8) : 
                        calculateQuality(file.size);

                    canvas.toBlob(blob => {
                        if (!blob) {
                            reject(new Error('Image compression failed'));
                            return;
                        }
                        
                        // Final size validation
                        if(blob.size >= file.size) {
                            reject(new Error('Compression not effective'));
                        } else {
                            resolve({
                                compressedBlob: blob,
                                beforeSize: file.size,
                                afterSize: blob.size
                            });
                        }
                    }, file.type, quality);
                } catch (error) {
                    reject(new Error('Image processing error'));
                }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result.toString();
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Compresses a PDF file
 * @param {File} file - The PDF file to compress
 * @returns {Promise<Blob>} - Compressed PDF blob
 */
async function compressPDF(file) {
    try {
        if (!window.pdfjsLib || !window.PDFLib) {
            throw new Error('PDF libraries not loaded');
        }
        
        const pdfBytes = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        const newPdfDoc = await window.PDFLib.PDFDocument.create();

        const scale = 0.75;
        const dpi = 144;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: scale * (dpi / 72) });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error('Failed to get canvas context');
            }
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const imageBlob = await new Promise(resolve => 
                canvas.toBlob(blob => resolve(blob), 'image/jpeg', QUALITY_LEVELS.pdf)
            );

            const imageBuffer = await imageBlob.arrayBuffer();
            const image = await newPdfDoc.embedJpg(imageBuffer);
            const newPage = newPdfDoc.addPage([image.width, image.height]);
            newPage.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const newPdfBytes = await newPdfDoc.save();
        return new Blob([newPdfBytes], { type: 'application/pdf' });
    } catch (error) {
        console.error('PDF compression error:', error);
        throw new Error('PDF compression failed: ' + (error.message || 'Unknown error'));
    }
}

/**
 * Main function to handle file compression
 * @param {File} file - The file to compress
 */
async function handleFile(file) {
    // Reset state
    hideResults();
    hideError();
    
    if (!validateFile(file)) {
        return;
    }

    showLoader();
    currentFileType = file.type;
    
    try {
        let blob, beforeSize, afterSize;
        
        if (file.type === 'application/pdf') {
            blob = await compressPDF(file);
            beforeSize = file.size;
            afterSize = blob.size;
        } else {
            const result = await compressImage(file);
            blob = result.compressedBlob;
            beforeSize = result.beforeSize;
            afterSize = result.afterSize;
        }

        if (afterSize >= beforeSize) {
            throw new Error('Compression failed - file size increased');
        }

        // Update state
        compressedFile = blob;
        originalFileSize = beforeSize;
        compressedFileSize = afterSize;
        
        // Show results
        showResults();
        showPreview();
    } catch (error) {
        console.error('Compression error:', error);
        showError(`Processing failed: ${error.message || 'Unknown error'}`);
    } finally {
        hideLoader();
    }
}

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
function formatSize(bytes) {
    if (bytes >= 1e6) return `${(bytes/1e6).toFixed(1)} MB`;
    if (bytes >= 1e3) return `${(bytes/1e3).toFixed(0)} KB`;
    return `${bytes} B`;
}

/**
 * Download the compressed file
 */
function downloadCompressedFile() {
    if (!compressedFile) return;
    
    const link = document.createElement('a');
    const ext = currentFileType === 'application/pdf' ? 'pdf' : 
               currentFileType === 'image/png' ? 'png' : 'jpg';
    link.download = `slimfile-${Date.now()}.${ext}`;
    link.href = URL.createObjectURL(compressedFile);
    link.click();
    URL.revokeObjectURL(link.href);
}

// UI Helper functions

/**
 * Show the loading indicator
 */
function showLoader() {
    document.getElementById('loader').hidden = false;
}

/**
 * Hide the loading indicator
 */
function hideLoader() {
    document.getElementById('loader').hidden = true;
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = errorDiv.querySelector('.error-text');
    
    errorText.textContent = message;
    errorDiv.hidden = false;
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('errorMessage').hidden = true;
}

/**
 * Show compression results
 */
function showResults() {
    const statsCard = document.getElementById('stats');
    const statsContent = document.getElementById('statsContent');
    const fileTypeLabel = document.getElementById('fileTypeLabel');
    
    statsCard.hidden = false;
    
    // Set file type label
    fileTypeLabel.textContent = currentFileType === 'application/pdf' ? 'PDF' : 'Image';
    
    // Calculate reduction percentage
    const reduction = ((1 - compressedFileSize / originalFileSize) * 100).toFixed(1);
    
    // Update stats content
    statsContent.innerHTML = `
        <div class="stat-item">
            <p class="stat-label">Original</p>
            <p class="stat-value">${formatSize(originalFileSize)}</p>
        </div>
        <div class="stat-item">
            <p class="stat-label">Compressed</p>
            <p class="stat-value">${formatSize(compressedFileSize)}</p>
        </div>
        <div class="stat-item">
            <p class="stat-label">Reduction</p>
            <p class="stat-value success">${reduction}%</p>
        </div>
    `;
}

/**
 * Hide results
 */
function hideResults() {
    document.getElementById('stats').hidden = true;
    document.getElementById('preview').style.display = 'none';
    document.getElementById('pdfPreview').style.display = 'none';
    
    // Clear any existing previews
    URL.revokeObjectURL(document.getElementById('preview').src);
    URL.revokeObjectURL(document.getElementById('pdfPreview').src);
    
    compressedFile = null;
    originalFileSize = 0;
    compressedFileSize = 0;
    currentFileType = null;
}

/**
 * Show file preview
 */
function showPreview() {
    if (!compressedFile) return;
    
    const previewImg = document.getElementById('preview');
    const pdfPreview = document.getElementById('pdfPreview');
    
    // Hide both previews first
    previewImg.style.display = 'none';
    pdfPreview.style.display = 'none';
    
    // Create object URL
    const objectUrl = URL.createObjectURL(compressedFile);
    
    if (currentFileType === 'application/pdf') {
        pdfPreview.src = objectUrl;
        pdfPreview.style.display = 'block';
    } else {
        previewImg.src = objectUrl;
        previewImg.style.display = 'block';
    }
}