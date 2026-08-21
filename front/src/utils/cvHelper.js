// Utility to safely open CV PDF files across all browsers (Chrome, Edge, Firefox, Safari)
// Converts base64 Data URIs to Blob URLs to bypass Chrome's top-level data: URI navigation restriction.

export const openCvFile = (cvData, API_BASE_URL = '') => {
  let rawUrl = cvData?.fileUrl || (typeof cvData === 'string' ? cvData : null);

  if (!rawUrl) {
    try {
      const local = localStorage.getItem('portfolio_local_cv');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.fileUrl) rawUrl = parsed.fileUrl;
      }
    } catch (e) {}
  }

  // If rawUrl is a Cloudinary image/upload URL (which Cloudinary blocks with 401 by default),
  // route through backend proxy endpoint to stream it cleanly.
  if (!rawUrl || (rawUrl.includes('cloudinary.com') && rawUrl.includes('/image/upload/'))) {
    const defaultApi = import.meta.env.VITE_API_URL || "https://portifolio-backend-4t3v.onrender.com";
    const baseUrl = API_BASE_URL || defaultApi;
    rawUrl = `${baseUrl}/api/cv/file`;
  }

  // Chrome blocks top-frame navigation to data: URIs.
  // Converting base64 to Blob URL solves this completely.
  if (rawUrl.startsWith('data:')) {
    try {
      const parts = rawUrl.split(';base64,');
      const contentType = parts[0].replace('data:', '') || 'application/pdf';
      const byteCharacters = atob(parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      const win = window.open(blobUrl, '_blank');
      if (!win) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      return;
    } catch (e) {
      console.error("Error creating Blob URL for CV:", e);
    }
  }

  // Handle normal URLs (HTTP/HTTPS/Blob)
  const win = window.open(rawUrl, '_blank');
  if (!win) {
    const a = document.createElement('a');
    a.href = rawUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
