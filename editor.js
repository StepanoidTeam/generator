document.querySelector(".grid");

keepRatio.addEventListener("change", () => {
    editorHeightBlock.hidden = keepRatio.checked;
});

keepRatio.click();
keepRatio.disabled = true;
