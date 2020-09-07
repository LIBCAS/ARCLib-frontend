/**
 * Downloads file
 */
export const downloadFile = (content, name, type) => {
  const blob = new Blob([content], { type });

  downloadBlob(blob, name);
};

/**
 * Downloads blob
 */
export const downloadBlob = (blob, name) => {
  // pro IE
  if (navigator.appVersion.toString().indexOf(".NET") > 0) {
    window.navigator.msSaveBlob(blob, name);
  } else {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

/**
 * Downloads file from URL
 */
export const downloadFileFromUrl = (url, name = "unknown") => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
