/**
 * Downloads file
 */
export const downloadFile = (content, name, type) => {
  const blob = new Blob([content], { type });
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
export const downloadFileFromUrl = url => {
  const link = document.createElement("a");
  link.href = url;
  link.click();
};
