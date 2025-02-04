document.addEventListener('DOMContentLoaded', function() {
  // Elimină clasa dark-mode la pornire
  document.body.classList.remove('dark-mode');

  const particlesJSBackground = document.getElementById('particles-js');
  const sidebar = document.getElementById('sidebar');
  const modeToggle = document.getElementById('modeToggle');
  const img = document.querySelector('img');
  const popup = document.getElementById('imagePopup');
  const popupImage = document.getElementById('popupImage');
  const closePopup = document.getElementById('closePopup');

  // Buton suplimentar pentru controlul sidebar-ului
  const menuToggle = document.createElement('button');
  menuToggle.innerHTML = 'Meniu';
  menuToggle.style.position = 'fixed';
  menuToggle.style.top = '20px';
  menuToggle.style.right = '20px';
  menuToggle.style.zIndex = '1000';
  document.body.appendChild(menuToggle);
  let isSidebarOpen = false;

  // Dropdown-ul din sidebar – dacă există, atașează event listener-ul
  const dropbtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  if (dropbtn && dropdownContent) {
    dropbtn.addEventListener('click', function(event) {
      event.stopPropagation();
      dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
    });
  }

  // Funcția de reîncărcare a particulelor în funcție de mod (light/dark)
  function loadParticles(mode) {
    particlesJSBackground.innerHTML = "";
    const lineColor = (mode === 'dark') ? '#ffffff' : '#555';
    const config = {
      particles: {
        number: {
          value: 80,
          density: { enable: true, value_area: 800 }
        },
        color: { value: '#ed143d' },
        shape: {
          type: 'circle',
          stroke: { width: 0, color: '#000000' }
        },
        opacity: { value: 0.5, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: {
          enable: true,
          distance: 150,
          color: lineColor,
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: false }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' }
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 1 } },
          bubble: { distance: 200, size: 40, duration: 2, opacity: 8, speed: 1 },
          repulse: { distance: 50, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 }
        }
      },
      retina_detect: true
    };
    particlesJS('particles-js', config);
  }

  // Inițial, se încarcă particulele în modul light
  loadParticles('light');
  particlesJSBackground.style.backgroundColor = '#f4f4f4';

  // Eveniment pentru toggle-ul meniului lateral suplimentar
  menuToggle.addEventListener('click', function(event) {
    event.stopPropagation();
    isSidebarOpen = !isSidebarOpen;
    if (sidebar) {
      sidebar.style.width = isSidebarOpen ? '250px' : '0';
      sidebar.style.paddingTop = isSidebarOpen ? '20px' : '0';
    }
  });

  // Închide meniul lateral atunci când se face click în afara lui
  document.addEventListener('click', function(event) {
    if (isSidebarOpen && !sidebar.contains(event.target) && event.target !== menuToggle) {
      sidebar.style.width = '0';
      sidebar.style.paddingTop = '0';
      isSidebarOpen = false;
    }
  });

  // Eveniment pentru deschiderea popup-ului imaginii
  if (img) {
    img.addEventListener('click', function() {
      popupImage.src = this.src;
      popupImage.style.maxWidth = '200%';
      popupImage.style.maxHeight = '100vh';
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Dezactivează scroll-ul paginii
    });
  }

  // Închiderea popup-ului prin butonul de închidere
  if (closePopup) {
    closePopup.addEventListener('click', function() {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // Închiderea popup-ului la apăsarea tastei Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Închiderea popup-ului la click pe zona din afara imaginii
  if (popup) {
    popup.addEventListener('click', function(event) {
      if (event.target === popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Eveniment pentru schimbarea modului dark/light
  if (modeToggle) {
    modeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        particlesJSBackground.style.backgroundColor = '#333';
        loadParticles('dark');
      } else {
        particlesJSBackground.style.backgroundColor = '#f4f4f4';
        loadParticles('light');
      }
      // Dropdown-ul își păstrează starea
    });
  }
});
