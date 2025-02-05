document.addEventListener('DOMContentLoaded', function() {
  // Elimină clasa dark-mode la pornire
  document.body.classList.remove('dark-mode');

  // Referințe DOM
  const particlesJSBackground = document.getElementById('particles-js');
  const sidebar = document.getElementById('sidebar');
  const modeToggle = document.getElementById('modeToggle');
  const toggleMapBtn = document.getElementById('toggleMap');
  const menuToggle = document.getElementById('menuToggle');
  const popup = document.getElementById('imagePopup');
  const popupImage = document.getElementById('popupImage');
  const closePopup = document.getElementById('closePopup');

  let isSidebarOpen = false;

  /* ============================
     Funcții modulare
  ============================ */

  // Funcție pentru gestionarea meniului lateral
  function initSidebar() {
    menuToggle.addEventListener('click', function(event) {
      console.log("Butonul de Meniu a fost apăsat");
      event.stopPropagation();
      isSidebarOpen = !isSidebarOpen;
      if (sidebar) {
        sidebar.style.width = isSidebarOpen ? '250px' : '0';
        sidebar.style.paddingTop = isSidebarOpen ? '20px' : '0';
      }
    });
  
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropbtn && dropdownContent) {
      dropbtn.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
      });
    }
  }

  // Funcție pentru a încărca particulele (mod light/dark)
  function loadParticles(mode) {
    particlesJSBackground.innerHTML = "";
    const lineColor = (mode === 'dark') ? '#ffffff' : '#555';
    const config = {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ed143d' },
        shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
        opacity: { value: 0.5, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: { enable: true, distance: 150, color: lineColor, opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false } }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
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

 function initImagePopups() {
  // Selectează toate imaginile cu clasa "popup-enabled"
  const images = document.querySelectorAll('img.popup-enabled');
  images.forEach(img => {
    img.addEventListener('click', function() {
      popupImage.src = this.src;
      // Nu mai setăm inline max-width și max-height; CSS-ul se va ocupa de asta
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  // Evenimente pentru închiderea popup-ului
  if (closePopup) {
    closePopup.addEventListener('click', function() {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  if (popup) {
    popup.addEventListener('click', function(event) {
      if (event.target === popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
}


  // Funcție pentru inițializarea hărții cu Leaflet
  function initMap() {
    var map = L.map('map').setView([45.9432, 24.9668], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      attribution: '&copy; OpenStreetMap contributors' 
    }).addTo(map);
  
    // Definirea locațiilor pentru secțiuni
    var locations = {
      prolog: { coords: [46, 105], msg: "Prolog – 18 August 1206, Mongolia" },
      khwarazmian: { coords: [45, 90], msg: "Khwarazmian – 1 Ianuarie 1219, Asia centrală" },
      "alta-sectie": { coords: [47, 100], msg: "Altă Secțiune" }
    };
  
    var mapMarkers = {};
    for (var key in locations) {
      if (locations.hasOwnProperty(key)) {
        var loc = locations[key];
        var marker = L.marker(loc.coords).addTo(map).bindPopup(loc.msg);
        mapMarkers[key] = marker;
      }
    }
  
    // Actualizează linkurile active din cuprins
    function updateActiveLink(activeId) {
      document.querySelectorAll('.dropdown-content a[data-loc]').forEach(function(link) {
        if (link.dataset.loc === activeId) {
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      });
    }
  
    // Eveniment pentru linkurile din dropdown-ul "Cuprins"
    var cuprinsLinks = document.querySelectorAll('.dropdown-content a[data-loc]');
    cuprinsLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var locKey = this.dataset.loc;
        updateActiveLink(locKey);
  
        if (locKey === "acasa") {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (locations[locKey]) {
          map.setView(locations[locKey].coords, 6);
          mapMarkers[locKey].openPopup();
          var section = document.getElementById(locKey);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  
    // Observator pentru secțiuni (folosind IntersectionObserver)
    const observerOptions = { root: null, threshold: 0.5 };
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (locations[id]) {
            map.setView(locations[id].coords, 6);
            mapMarkers[id].openPopup();
            updateActiveLink(id);
          } else {
            updateActiveLink("");
          }
        }
      });
    };
  
    const observedSections = document.querySelectorAll('section[id]');
    observedSections.forEach(section => {
      const observer = new IntersectionObserver(observerCallback, observerOptions);
      observer.observe(section);
    });
  
    // Toggle pentru afișarea/ascunderea hărții
    toggleMapBtn.addEventListener('click', function() {
      var mapContainer = document.getElementById('map');
      if (mapContainer.style.display === "none" || mapContainer.style.display === "") {
        mapContainer.style.display = "block";
        setTimeout(function() {
          map.invalidateSize();
        }, 100);
      } else {
        mapContainer.style.display = "none";
      }
    });
  }

  // Funcție pentru încărcarea conținutului secțiunilor din text.txt
  function initTextSections() {
    fetch('text.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Eroare la încărcarea fișierului: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        console.log("Conținutul fișierului text.txt:", text);
        // Parsează fișierul folosind expresia regulată
        const regex = /--([\w-]+)--\s*([\s\S]*?)(?=--[\w-]+--|$)/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          const sectionId = match[1].trim();
          const content = match[2].trim();
          console.log(`Secțiune găsită: ${sectionId} cu conținut: ${content}`);
  
          const sectionElement = document.getElementById(sectionId);
          if (sectionElement) {
            let contentElement = sectionElement.querySelector('.section-content p');
            if (!contentElement) {
              contentElement = sectionElement;
            }
            contentElement.innerText = content;
            console.log(`Textul pentru secțiunea "${sectionId}" a fost actualizat.`);
          } else {
            console.warn(`Secțiunea cu id-ul "${sectionId}" nu a fost găsită în HTML.`);
          }
        }
      })
      .catch(error => console.error("Eroare la încărcarea sau procesarea fișierului text.txt:", error));
  }

  /* ============================
     Inițializări
  ============================ */
  initSidebar();
  loadParticles('light');
  particlesJSBackground.style.backgroundColor = '#f4f4f4';
  initImagePopups(); // Aplica popup la toate imaginile cu clasa "popup-enabled"
  initMap();
  initTextSections();

  // Eveniment pentru schimbarea modului (light/dark)
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
    });
  }
});
