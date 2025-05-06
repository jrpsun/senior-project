export function openPdfInNewTab(base64: string, fileName = "document.pdf") {
    if (!base64) return;
  
    try {
      // ตัด prefix ถ้ามี
      const cleanedBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
  
      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
  
      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, "_blank");
  
      newTab?.addEventListener("beforeunload", () => {
        URL.revokeObjectURL(blobUrl);
      });
    } catch (error) {
      console.error("Failed to open PDF:", error);
    }
  }
  