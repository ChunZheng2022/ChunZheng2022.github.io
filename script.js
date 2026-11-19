"use strict";

// The page and citations remain readable without JavaScript.
if (window.isSecureContext && navigator.clipboard?.writeText) {
  document.querySelectorAll(".copy-citation").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", async () => {
      const citation = button.parentElement.querySelector("code").textContent;
      const status = document.getElementById("copy-status");
      button.disabled = true;
      try {
        await navigator.clipboard.writeText(citation);
        button.textContent = "Copied";
        status.textContent = "BibTeX citation copied to clipboard.";
      } catch {
        button.textContent = "Select text";
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(button.parentElement.querySelector("code"));
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = "Please copy the selected citation with your keyboard.";
      } finally {
        window.setTimeout(() => {
          button.textContent = "Copy";
          button.disabled = false;
        }, 2000);
      }
    });
  });
}
