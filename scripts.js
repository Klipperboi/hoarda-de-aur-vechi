document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const modeToggle = document.getElementById('modeToggle');
    const menuToggle = document.createElement('button');
    const img = document.querySelector('img');
    const popup = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    const closePopup = document.getElementById('closePopup');
    let isSidebarOpen = false;

    // Definește procentul de mărire a imaginii
    let zoomPercentage = '200%'; // Poți modifica acest procentaj după preferințe

    // Creare buton pentru deschiderea meniului
    menuToggle.innerHTML = 'Meniu';
    menuToggle.style.position = 'fixed';
    menuToggle.style.top = '20px';
    menuToggle.style.right = '20px';
    menuToggle.style.zIndex = '1000';
    document.body.appendChild(menuToggle);

    // Deschide/închide meniul
    menuToggle.addEventListener('click', function() {
        isSidebarOpen = !isSidebarOpen;
        sidebar.style.width = isSidebarOpen ? '250px' : '0';
        sidebar.style.paddingTop = isSidebarOpen ? '20px' : '0';
    });

    // Închide meniul când se apasă în afara lui
    document.addEventListener('click', function(event) {
        if (isSidebarOpen && !sidebar.contains(event.target) && event.target !== menuToggle) {
            sidebar.style.width = '0';
            sidebar.style.paddingTop = '0';
            isSidebarOpen = false;
        }
    });

    // Pop-up pentru imagine
    img.addEventListener('click', function() {
        popupImage.src = this.src;
        popupImage.style.maxWidth = zoomPercentage; // Setează lățimea maximă la valoarea definită
        popupImage.style.maxHeight = '100vh'; // Setează înălțimea maximă la 100% din înălțimea vizuală a ferestrei
        popup.style.display = 'flex';
    });

    closePopup.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Închide popup-ul când se face click în afara imaginii sau se apasă Escape
    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            popup.style.display = 'none';
        }
    });

    // Funcția de schimbare a modului întunecat/luminos
    modeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });
});
