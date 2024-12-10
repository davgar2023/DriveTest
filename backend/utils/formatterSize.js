/**
 * Converts a file size from bytes to a human-readable format.
 * 
 * @param {number} bytes - The file size in bytes.
 * @returns {string} - The formatted file size with appropriate unit (e.g., "1.23 MB").
 */
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let size = bytes;
    
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }
  
    return `${size.toFixed(2)} ${units[index]}`;
  }

  module.exports = formatFileSize;