document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const modeToggle = document.getElementById('modeToggle');
    const menuToggle = document.createElement('button');
    const img = document.querySelector('img');
    let isSidebarOpen = false;
    let isZoomed = false;

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

    // Evită închiderea meniului la clic în interiorul lui
    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Animare imagine cu zoom
    img.addEventListener('click', function(event) {
        event.stopPropagation();
        if (!isZoomed) {
            img.style.transform = 'scale(1.5)';
            img.style.transition = 'transform 0.5s ease-in-out';
            isZoomed = true;
        } else {
            img.style.transform = 'scale(1)';
            isZoomed = false;
        }
    });

    // Resetează imaginea la dimensiunea inițială când se apasă în afara ei
    document.addEventListener('click', function() {
        if (isZoomed) {
            img.style.transform = 'scale(1)';
            isZoomed = false;
        }
    });

    // Funcția de schimbare a modului întunecat/luminos
    modeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });
});
