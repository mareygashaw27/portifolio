const cloudinary = require("./cloudinary");

/**
 * Upload a base64-encoded file to Cloudinary.
 * If the data is already a URL (not base64), it is returned as-is.
 *
 * @param {string} base64Data - The base64 data URI (e.g. "data:image/png;base64,...")
 * @param {string} folder     - Cloudinary folder to store the file in (e.g. "portfolio/videos")
 * @param {string} [resourceType="auto"] - Cloudinary resource type: "image", "video", "raw", or "auto"
 * @returns {Promise<string>} - The secure Cloudinary URL
 */
async function uploadToCloudinary(base64Data, folder, resourceType = "auto") {
  // If it's already a URL or empty, return as-is
  if (!base64Data || !base64Data.startsWith("data:")) return base64Data;

  try {
    const options = {
      folder: folder,
      resource_type: resourceType,
    };
    
    // Explicitly handle PDFs as 'raw' so Cloudinary serves them publicly without 401 restrictions
    if (base64Data.startsWith("data:application/pdf")) {
      options.resource_type = "raw";
    }

    const result = await cloudinary.uploader.upload(base64Data, options);
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    // Fallback: If Cloudinary fails (e.g. timestamp/stale request error), return base64 data URI directly
    console.warn("Falling back to storing base64 Data URI directly in database.");
    return base64Data;
  }
}

module.exports = { uploadToCloudinary };
