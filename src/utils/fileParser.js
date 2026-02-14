// File parsing utilities for PDF and DOCX

// Extract text from PDF using pdf.js
export const extractTextFromPDF = async (file) => {
  // Dynamic import to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker path
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map(item => item.str)
            .join(' ');
          fullText += pageText + '\n\n';
        }
        
        resolve({
          text: fullText.trim(),
          pageCount: pdf.numPages,
          metadata: await pdf.getMetadata().catch(() => ({}))
        });
      } catch (error) {
        reject(new Error(`Failed to parse PDF: ${error.message}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

// Extract text from DOCX using mammoth
export const extractTextFromDOCX = async (file) => {
  const mammoth = await import('mammoth');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        
        // Extract raw text
        const textResult = await mammoth.extractRawText({ arrayBuffer });
        
        // Also try to get HTML for better structure understanding
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer }).catch(() => ({ value: '' }));
        
        resolve({
          text: textResult.value.trim(),
          html: htmlResult.value,
          warnings: textResult.messages
        });
      } catch (error) {
        reject(new Error(`Failed to parse DOCX: ${error.message}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

// Extract text from plain text files
export const extractTextFromTXT = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve({
        text: e.target.result.trim()
      });
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Main file parser that routes to appropriate handler
export const parseFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  const maxSize = 10 * 1024 * 1024; // 10MB limit
  
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }
  
  switch (extension) {
    case 'pdf':
      return await extractTextFromPDF(file);
    
    case 'docx':
    case 'doc':
      if (extension === 'doc') {
        throw new Error('Legacy .doc format not supported. Please convert to .docx');
      }
      return await extractTextFromDOCX(file);
    
    case 'txt':
    case 'md':
      return await extractTextFromTXT(file);
    
    default:
      throw new Error(`Unsupported file type: .${extension}. Supported: PDF, DOCX, TXT`);
  }
};

// Get file type info
export const getFileTypeInfo = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  
  const types = {
    pdf: { icon: '📕', name: 'PDF Document', color: 'red' },
    docx: { icon: '📘', name: 'Word Document', color: 'blue' },
    doc: { icon: '📘', name: 'Word Document (Legacy)', color: 'blue' },
    txt: { icon: '📝', name: 'Text File', color: 'gray' },
    md: { icon: '📝', name: 'Markdown File', color: 'gray' }
  };
  
  return types[extension] || { icon: '📄', name: 'Unknown', color: 'gray' };
};

// Validate file before parsing
export const validateFile = (file) => {
  const errors = [];
  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = ['pdf', 'docx', 'txt', 'md'];
  
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(extension)) {
    errors.push(`Unsupported file type. Allowed: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    errors.push('File too large. Maximum size is 10MB.');
  }
  
  if (file.size === 0) {
    errors.push('File is empty.');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
