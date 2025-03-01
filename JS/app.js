// Navigates between pages
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(div => div.style.display = "none"); // Hide all pages
    document.getElementById(pageId).style.display = "block"; // Display page with the specified ID
}