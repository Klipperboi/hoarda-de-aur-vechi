document.addEventListener('DOMContentLoaded', function() {
  // Elimină clasa dark-mode la pornire
  document.body.classList.remove('dark-mode');

  const particlesJSBackground = document.getElementById('particles-js');
  const sidebar = document.getElementById('sidebar');
  const modeToggle = document.getElementById('modeToggle');
  const toggleMapBtn = document.getElementById('toggleMap');
  // Folosește butonul definit în HTML
  const menuToggle = document.getElementById('menuToggle');
  const img = document.querySelector('img');
  const popup = document.getElementById('imagePopup');
  const popupImage = document.getElementById('popupImage');
  const closePopup = document.getElementById('closePopup');

  let isSidebarOpen = false;

  // Eveniment pentru butonul de Meniu
  menuToggle.addEventListener('click', function(event) {
    console.log("Butonul de Meniu a fost apăsat");
    event.stopPropagation();
    isSidebarOpen = !isSidebarOpen;
    if (sidebar) {
      sidebar.style.width = isSidebarOpen ? '250px' : '0';
      sidebar.style.paddingTop = isSidebarOpen ? '20px' : '0';
    }
  });

  // Dropdown-ul din sidebar – atașează event listener-ul
  const dropbtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  if (dropbtn && dropdownContent) {
    dropbtn.addEventListener('click', function(event) {
      event.stopPropagation();
      dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
    });
  }

  // Funcția de reîncărcare a particulelor (light/dark)
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

  // Inițial, încarcă particulele în modul light
  loadParticles('light');
  particlesJSBackground.style.backgroundColor = '#f4f4f4';

  // Evenimente pentru popup-ul imaginii
  if (img) {
    img.addEventListener('click', function() {
      popupImage.src = this.src;
      popupImage.style.maxWidth = '200%';
      popupImage.style.maxHeight = '100vh';
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

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

  // Inițializare hartă cu Leaflet
  var map = L.map('map').setView([45.9432, 24.9668], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

  // Obiectul cu locații (definim secțiunile care vor schimba poziția hărții)
  var locations = {
    prolog: { coords: [46, 105], msg: "Prolog – 18 August 1206, Mongolia" }
    // Adaugă aici și alte secțiuni, ex: "capitol1": { coords: [47, 106], msg: "Capitolul 1 – ..." }
  };

  var mapMarkers = {};
  for (var key in locations) {
    if (locations.hasOwnProperty(key)) {
      var loc = locations[key];
      var marker = L.marker(loc.coords).addTo(map).bindPopup(loc.msg);
      mapMarkers[key] = marker;
    }
  }

  // Funcția pentru actualizarea linkurilor active din cuprins
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

  // Observator pentru secțiuni (folosim IntersectionObserver)
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
});
