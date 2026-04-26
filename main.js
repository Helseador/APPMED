// ══════════════════════════════════════════════════════════
// IDENTIDAD DEL LABORATORIO
// Cambia estos valores en cada copia del proyecto
// ══════════════════════════════════════════════════════════
var LAB_NOMBRE = "Mi Laboratorio"; // ← cambia por el nombre real
var LAB_COLOR = "#0F766E"; // ← color del laboratorio
var LAB_ID = "default"; // ← id corto ej: 'abamia', 'nestle'
var LABS = [
  {
    id: "nestle",
    name: "Nestle",
    color: "#E2001A",
    colorLight: "#FEE2E2",
    icon: "fa-cube",
    logo: window._LG_nestle || "",
  },
  {
    id: "abamia",
    name: "Abamia",
    color: "#0066CC",
    colorLight: "#DBEAFE",
    icon: "fa-pills",
    logo: window._LG_abamia || "",
  },
  {
    id: "fresenius",
    name: "Fresenius",
    color: "#009036",
    colorLight: "#DCFCE7",
    icon: "fa-syringe",
    logo: window._LG_fresenius || "",
  },
  {
    id: "ketolance",
    name: "Ketolance",
    color: "#F59E0B",
    colorLight: "#FEF3C7",
    icon: "fa-flask",
    logo: window._LG_ketolance || "",
  },
];

// ══════════════════════════════════════════════════════════
// FIREBASE CONFIG — reemplaza con las credenciales reales
// ══════════════════════════════════════════════════════════
var FIREBASE_CONFIG = {
  apiKey: "AIzaSyAKcDvxBjl4-fJ6ov2bRhX1ExFQlRFiszA",
  authDomain: "appmed-f21de.firebaseapp.com",
  databaseURL: "https://appmed-f21de-default-rtdb.firebaseio.com",
  projectId: "appmed-f21de",
  storageBucket: "appmed-f21de.firebasestorage.app",
  messagingSenderId: "77112324308",
  appId: "1:77112324308:web:5f2204fc5182d4ab004b41",
  measurementId: "G-2FR4P74ZE6",
};
var SUPER_ADMIN_KEY = "TesJua2024!";
var MAX_LOGIN_ATTEMPTS = 5,
  LOCKOUT_SECONDS = 30,
  SESSION_MINUTES = 30;
var AV_COLORS = [
  "#0F766E",
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#2563EB",
  "#DB2777",
  "#059669",
  "#EA580C",
  "#4F46E5",
  "#0891B2",
];
var MIN_PER_PUNTO = 15;

// Mostrar chip de laboratorio en login
(function () {
  var chip = document.getElementById("labChip"),
    name = document.getElementById("labChipName");
  if (LAB_NOMBRE && LAB_NOMBRE !== "Mi Laboratorio") {
    chip.style.display = "inline-flex";
    name.textContent = LAB_NOMBRE;
  }
})();

function avatarColor(id) {
  var h = 0;
  for (var i = 0; i < (id || "").length; i++)
    h = id.charCodeAt(i) + ((h << 5) - h);
  return AV_COLORS[Math.abs(h) % AV_COLORS.length];
}
function initials(n) {
  if (!n) return "??";
  var p = n.trim().split(/\s+/);
  return p.length >= 2
    ? (p[0][0] + p[1][0]).toUpperCase()
    : n.substring(0, 2).toUpperCase();
}
function uid() {
  return "id_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
}
function today() {
  var d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function todayDow() {
  var d = new Date().getDay();
  return d === 0 ? 7 : d;
}
function fmtDate(d) {
  if (!d) return "";
  var dt = new Date(d + "T12:00:00");
  var m = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return dt.getDate() + " " + m[dt.getMonth()] + " " + dt.getFullYear();
}
function fmtDateShort(d) {
  if (!d) return "";
  var dt = new Date(d + "T12:00:00");
  var m = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return dt.getDate() + " " + m[dt.getMonth()];
}
function fmt(h, m) {
  return h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0");
}
var DOW_NAME = {
  1: "Lunes",
  2: "Martes",
  3: "Miercoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sabado",
  7: "Domingo",
};
function userById(id) {
  return D.users.find(function (u) {
    return u.id === id;
  });
}
function pointById(id) {
  return D.points.find(function (p) {
    return p.id === id;
  });
}
function haversine(a, b, c, d) {
  var R = 6371000,
    t = function (v) {
      return (v * Math.PI) / 180;
    };
  var e = t(c - a),
    f = t(d - b);
  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(
        Math.sin(e / 2) ** 2 +
        Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(f / 2) ** 2,
      ),
      Math.sqrt(
        1 -
        (Math.sin(e / 2) ** 2 +
          Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(f / 2) ** 2),
      ),
    )
  );
}
function esc(s) {
  if (!s) return "";
  var d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
function mapsLink(lat, lng, addr) {
  if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng))
    return "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng;
  return (
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(addr || "")
  );
}
function addrHTML(a, lat, lng) {
  if (!a)
    return '<span style="color:var(--muted);font-size:12px;">Sin direccion</span>';
  var l = mapsLink(lat, lng, a);
  var s = a.length > 50 ? a.substring(0, 50) + "..." : a;
  return (
    '<a href="' +
    l +
    '" target="_blank" rel="noopener" class="map-link" style="font-size:12px;" title="' +
    esc(a) +
    '"><i class="fa-solid fa-location-arrow" style="font-size:10px;"></i> ' +
    esc(s) +
    "</a>"
  );
}
function pctColor(pct) {
  var h = Math.round(pct * 1.55);
  return (
    "hsl(" + h + ", " + (70 + pct * 0.15) + "%, " + (45 + pct * 0.1) + "%)"
  );
}
function pctColorBg(pct) {
  var h = Math.round(pct * 1.55);
  return (
    "linear-gradient(135deg, hsl(" +
    h +
    ", 60%, 96%) 0%, hsl(" +
    h +
    ", 50%, 99%) 100%)"
  );
}
function getGreeting() {
  var h = new Date().getHours();
  if (h >= 5 && h < 12) return "Buenos dias";
  if (h >= 12 && h < 19) return "Buenas tardes";
  return "Buenas noches";
}
function setLoginGreeting() {
  var el = document.getElementById("loginGreeting");
  if (el)
    el.textContent = getGreeting() + " - Ingresa tus datos para continuar";
}
setLoginGreeting();

var currentRouteId = null;
var D = defaultData(),
  currentUser = null,
  currentPhotoData = null,
  _superBackTo = null,
  currentLabId = null;
var firebaseReady = false,
  firebaseOnline = false,
  myLastWriteId = null;
var currentAdminTab = "canvas",
  currentVisitorTab = "hoy",
  currentSuperTab = "users";
var lastVisitorDetailId = null,
  lastSuperDetailId = null,
  dbRef = null,
  gpsPermission = "unknown";
var profFirmaCanvas = null,
  profFirmaCtx = null,
  profFirmaActiva = false;
var visitaGpsCoords = null,
  visitaFotoDataGeneral = null,
  visitaFotoDataProf = null;

function defaultData() {
  return {
    _writeId: null,
    users: [
      {
        id: "u1",
        username: "admin",
        password: "admin123",
        role: "admin",
        name: "Coordinador General",
        active: true,
      },
      {
        id: "u2",
        username: "jperez",
        password: "visit123",
        role: "visitor",
        name: "Juan Perez Garcia",
        active: true,
        labId: "nestle",
      },
      {
        id: "u3",
        username: "mlopez",
        password: "visit123",
        role: "visitor",
        name: "Maria Lopez Hernandez",
        active: true,
        labId: "nestle",
      },
      {
        id: "u4",
        username: "cruiz",
        password: "visit123",
        role: "visitor",
        name: "Carlos Ruiz Martinez",
        active: true,
        labId: "nestle",
      },
    ],
    points: [
      {
        id: "p1",
        name: "Farmacia San Rafael",
        address: "Av. Insurgentes Sur 1234, CDMX",
        lat: 19.3826,
        lng: -99.1749,
        assignedTo: "u2",
        dayOfWeek: 1,
        order: 1,
        labId: "nestle",
      },
      {
        id: "p2",
        name: "Clinica del Valle",
        address: "Calle Amsterdam 56, Hipodromo, CDMX",
        lat: 19.4284,
        lng: -99.1717,
        assignedTo: "u2",
        dayOfWeek: 1,
        order: 2,
        labId: "nestle",
      },
      {
        id: "p3",
        name: "Hospital Central Norte",
        address: "Blvd. Manuel Avila Camacho 20, CDMX",
        lat: 19.4363,
        lng: -99.1964,
        assignedTo: "u2",
        dayOfWeek: 2,
        order: 1,
        labId: "nestle",
      },
      {
        id: "p4",
        name: "Distribuidora Medica Sur",
        address: "Av. Revolucion 890, CDMX",
        lat: 19.3782,
        lng: -99.1712,
        assignedTo: "u3",
        dayOfWeek: 1,
        order: 1,
        labId: "nestle",
      },
      {
        id: "p5",
        name: "Farmacia la Luz",
        address: "Calle Ermita 45, Coyoacan, CDMX",
        lat: 19.367,
        lng: -99.1449,
        assignedTo: "u3",
        dayOfWeek: 1,
        order: 2,
        labId: "nestle",
      },
      {
        id: "p6",
        name: "Clinica Santa Maria",
        address: "Av. Tlahuac 230, Iztapalapa, CDMX",
        lat: 19.355,
        lng: -99.132,
        assignedTo: "u3",
        dayOfWeek: 3,
        order: 1,
        labId: "nestle",
      },
      {
        id: "p7",
        name: "Sanatorio del Angel",
        address: "Av. Paseo de la Reforma 500, CDMX",
        lat: 19.4291,
        lng: -99.1843,
        assignedTo: "u4",
        dayOfWeek: 1,
        order: 1,
        labId: "nestle",
      },
      {
        id: "p8",
        name: "FarmaExpress Satelite",
        address: "Blvd. de la Luz 12, Naucalpan, Edo. Mex.",
        lat: 19.4978,
        lng: -99.2346,
        assignedTo: "u4",
        dayOfWeek: 2,
        order: 1,
        labId: "nestle",
      },
    ],
    routes: [
      {
        id: "rt1",
        name: "Ruta Zona Norte",
        labId: "nestle",
        assignedTo: "u2",
        pointIds: ["p1", "p2", "p3"],
      },
      {
        id: "rt2",
        name: "Ruta Zona Sur",
        labId: "nestle",
        assignedTo: "u3",
        pointIds: ["p4", "p5", "p6"],
      },
      {
        id: "rt3",
        name: "Ruta Satelite",
        labId: "nestle",
        assignedTo: "u4",
        pointIds: ["p7", "p8"],
      },
    ],
    visits: [
      {
        id: "v1",
        pointId: "p1",
        visitorId: "u2",
        date: "2025-07-14",
        arrivalTime: "09:20",
        closeTime: "09:55",
        arrivalLat: 19.3827,
        arrivalLng: -99.175,
        closeLat: 19.3827,
        closeLng: -99.175,
        photo: null,
        jefeNombre: "Lic. Roberto Vargas",
        notes: "Entrega de muestra.",
        status: "completed",
        tipoVisita: "general",
        labId: "nestle",
      },
      {
        id: "v2",
        pointId: "p2",
        visitorId: "u2",
        date: "2025-07-14",
        arrivalTime: "10:30",
        closeTime: "11:00",
        arrivalLat: 19.4285,
        arrivalLng: -99.1718,
        closeLat: 19.4285,
        closeLng: -99.1718,
        photo: null,
        jefeNombre: "Dra. Patricia Mendoza",
        notes: "Seguimiento.",
        status: "completed",
        tipoVisita: "general",
        labId: "nestle",
      },
      {
        id: "v3",
        pointId: "p4",
        visitorId: "u3",
        date: "2025-07-14",
        arrivalTime: "09:00",
        closeTime: null,
        arrivalLat: 19.3783,
        arrivalLng: -99.1713,
        closeLat: null,
        closeLng: null,
        photo: null,
        jefeNombre: "",
        notes: "",
        status: "in-progress",
        tipoVisita: "general",
        labId: "nestle",
      },
    ],
  };
}

function saveLocal(d) {
  try {
    localStorage.setItem("appmed_v1", JSON.stringify(d));
  } catch (e) { }
}
function save(d) {
  myLastWriteId = Date.now() + "_" + Math.random().toString(36).substr(2, 6);
  d._writeId = myLastWriteId;
  saveLocal(d);
  if (firebaseReady && dbRef) {
    dbRef
      .ref("appmed")
      .set(d)
      .catch(function (err) {
        console.error("Error Firebase:", err);
        toast("Error de sincronizacion. Datos guardados localmente.", "err");
      });
  }
}
function updateConnBadge() {
  var b = document.getElementById("loginConnBadge");
  if (firebaseOnline) {
    b.className = "conn-badge online";
    b.innerHTML = '<span class="conn-dot"></span> Conectado a la nube';
  } else if (firebaseReady) {
    b.className = "conn-badge offline";
    b.innerHTML = '<span class="conn-dot"></span> Sin conexion temporal';
  }
}
function updateHeaderConn() {
  ["adminConn", "visitorConn", "superConn", "labSelectConn"].forEach(
    function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var s = id === "superConn";
      if (firebaseOnline) {
        el.className = "header-conn online";
        if (s) {
          el.style.background = "rgba(255,255,255,0.15)";
          el.style.color = "#fff";
        }
        el.innerHTML = '<span class="hdot"></span>Cloud';
      } else {
        el.className = "header-conn offline";
        if (s) {
          el.style.background = "rgba(255,255,255,0.1)";
          el.style.color = "rgba(255,255,255,0.5)";
        }
        el.innerHTML = '<span class="hdot"></span>Local';
      }
    },
  );
}
function showSyncIndicator() {
  var el = document.getElementById("syncIndicator");
  el.classList.add("show");
  setTimeout(function () {
    el.classList.remove("show");
  }, 2000);
}
function renderCurrentScreen() {
  if (!currentUser) return;
  if (
    document.querySelector(".modal-overlay.open") ||
    document.querySelector(".confirm-overlay.open")
  )
    return;
  try {
    if (currentUser.role === "super") {
      if (currentSuperTab === "users") renderSuperAdmin();
      else if (currentSuperTab === "superDetail" && lastSuperDetailId)
        openSuperDetail(lastSuperDetailId);
    } else if (currentUser.role === "admin") {
      if (!currentLabId) {
        renderLabSelect();
        return;
      }
      if (currentAdminTab === "canvas") renderCanvasDashboard();
      else if (currentAdminTab === "visitadores") renderVisitorList();
      else if (currentAdminTab === "visitas") {
        populateVisitFilter();
        renderAdminVisitas();
      } else if (currentAdminTab === "fotos") renderPhotoGallery();
      else if (currentAdminTab === "informes") renderInformes();
      else if (currentAdminTab === "visitorDetail" && lastVisitorDetailId)
        openVisitorDetail(lastVisitorDetailId);
    } else {
      if (currentVisitorTab === "hoy") renderVisitorToday();
      else if (currentVisitorTab === "semana") renderVisitorWeek();
      else if (currentVisitorTab === "perfil") renderVisitorProfile();
    }
  } catch (e) {
    console.error("renderCurrentScreen:", e);
  }
}

function initFirebase() {
  var loginBtn = document.getElementById("loginBtn"),
    connBadge = document.getElementById("loginConnBadge");
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    dbRef = firebase.database();
    dbRef.ref(".info/connected").on("value", function (snap) {
      firebaseOnline = snap.val() === true;
      updateConnBadge();
      updateHeaderConn();
    });
    dbRef
      .ref("appmed")
      .once("value")
      .then(function (snap) {
        var r = snap.val();
        if (r && r.users && r.users.length > 0) {
          D = r;
          myLastWriteId = r._writeId || null;
        } else {
          D = defaultData();
          myLastWriteId = Date.now() + "_init";
          D._writeId = myLastWriteId;
          dbRef.ref("appmed").set(D);
        }
        saveLocal(D);
        if (D.labs && D.labs.length) {
          D.labs.forEach(function (l) {
            if (
              !LABS.find(function (x) {
                return x.id === l.id;
              })
            )
              LABS.push(l);
          });
        }
        firebaseReady = true;
        firebaseOnline = true;
        loginBtn.disabled = false;
        loginBtn.innerHTML = "Iniciar Sesion";
        updateConnBadge();
        updateHeaderConn();
      })
      .catch(function (err) {
        console.error("Error Firebase:", err);
        try {
          var l = JSON.parse(localStorage.getItem("appmed_v1"));
          if (l && l.users) D = l;
        } catch (e) { }
        saveLocal(D);
        firebaseReady = false;
        firebaseOnline = false;
        loginBtn.disabled = false;
        loginBtn.innerHTML = "Iniciar Sesion";
        connBadge.className = "conn-badge offline";
        connBadge.innerHTML =
          '<span class="conn-dot"></span> Sin conexion — modo local';
        updateHeaderConn();
      });
    dbRef.ref("appmed").on("value", function (snap) {
      var n = snap.val();
      if (!n || !n.users) return;
      if (n._writeId && n._writeId === myLastWriteId) return;
      showSyncIndicator();
      D = n;
      myLastWriteId = n._writeId || null;
      saveLocal(D);
      renderCurrentScreen();
    });
  } catch (e) {
    console.error("Error init Firebase:", e);
    try {
      var l = JSON.parse(localStorage.getItem("appmed_v1"));
      if (l && l.users) D = l;
    } catch (ex) { }
    saveLocal(D);
    firebaseReady = false;
    loginBtn.disabled = false;
    loginBtn.innerHTML = "Iniciar Sesion";
    connBadge.className = "conn-badge offline";
    connBadge.innerHTML = '<span class="conn-dot"></span> Error de conexion';
    updateHeaderConn();
  }
}

var loginAttempts = 0,
  lockoutEnd = 0,
  lockoutInterval = null;
function showLockout() {
  document.getElementById("lockoutOverlay").style.display = "flex";
  lockoutInterval = setInterval(function () {
    var r = Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000));
    document.getElementById("lockoutTimer").textContent =
      Math.floor(r / 60)
        .toString()
        .padStart(2, "0") +
      ":" +
      (r % 60).toString().padStart(2, "0");
    if (r <= 0) {
      clearInterval(lockoutInterval);
      document.getElementById("lockoutOverlay").style.display = "none";
      loginAttempts = 0;
    }
  }, 250);
}
var sessionTimer = null,
  sessionEnd = 0;
var SESSION_MS = SESSION_MINUTES * 60 * 1000;
function resetSession() {
  sessionEnd = Date.now() + SESSION_MS;
  if (sessionTimer) clearInterval(sessionTimer);
  sessionTimer = setInterval(function () {
    var r = Math.max(0, sessionEnd - Date.now());
    var m = Math.floor(r / 60000),
      s = Math.floor((r % 60000) / 1000);
    var txt = m + ":" + s.toString().padStart(2, "0");
    ["adminSessionTimer", "visitorSessionTimer"].forEach(function (id) {
      var el = document.querySelector("#" + id);
      if (el) {
        if (r < 300000) {
          el.style.display = "flex";
          el.querySelector("span").textContent = txt;
        } else el.style.display = "none";
      }
    });
    if (r <= 0) {
      clearInterval(sessionTimer);
      sessionTimer = null;
      doLogout();
      toast("Sesion cerrada por inactividad", "info");
    }
  }, 1000);
}
function stopSession() {
  if (sessionTimer) {
    clearInterval(sessionTimer);
    sessionTimer = null;
  }
  ["adminSessionTimer", "visitorSessionTimer"].forEach(function (id) {
    var el = document.querySelector("#" + id);
    if (el) el.style.display = "none";
  });
}
["click", "touchstart", "keydown", "scroll"].forEach(function (e) {
  document.addEventListener(
    e,
    function () {
      if (currentUser && sessionEnd) sessionEnd = Date.now() + SESSION_MS;
    },
    { passive: true },
  );
});

var confirmCallback = null;
function showConfirm(title, msg, type, cb) {
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMsg").textContent = msg;
  var ic = document.getElementById("confirmIcon"),
    ii = document.getElementById("confirmIconI"),
    ok = document.getElementById("confirmOkBtn");
  if (type === "danger") {
    ic.className = "confirm-icon danger";
    ii.className = "fa-solid fa-trash-can";
    ok.className = "btn btn-danger";
    ok.textContent = "Eliminar";
  } else {
    ic.className = "confirm-icon warning";
    ii.className = "fa-solid fa-arrow-right-from-bracket";
    ok.className = "btn btn-primary";
    ok.textContent = "Cerrar sesion";
  }
  confirmCallback = cb;
  document.getElementById("confirmOverlay").classList.add("open");
}
function cancelConfirm() {
  document.getElementById("confirmOverlay").classList.remove("open");
  confirmCallback = null;
}
function executeConfirm() {
  document.getElementById("confirmOverlay").classList.remove("open");
  if (confirmCallback) confirmCallback();
  confirmCallback = null;
}
function confirmLogout() {
  showConfirm(
    "Cerrar Sesion",
    "Se perdera el progreso no guardado.",
    "logout",
    function () {
      doLogout();
    },
  );
}

// ══════════════════════════════════════════════════════════
// GPS Y GEOLOCALIZACIÓN
// ══════════════════════════════════════════════════════════
function _normCO(addr) {
  return addr
    .replace(/\bCra\.?\b/gi, "Carrera")
    .replace(/\bCl\.?\b/gi, "Calle")
    .replace(/\bAv\.?\s*Cra\.?\b/gi, "Avenida Carrera")
    .replace(/\bAv\.?\s*Cl\.?\b/gi, "Avenida Calle")
    .replace(/\bTv\.?\b/gi, "Transversal")
    .replace(/\bDg\.?\b/gi, "Diagonal")
    .replace(/\bKm\.?\b/gi, "Km")
    .replace(/#/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function _simplCO(addr) {
  return _normCO(addr)
    .replace(/([0-9]+)\s*[a-zA-Z]+\b/g, "$1")
    .replace(/-\s*\d+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

var geoTimer = null;
function geocodeAddress() {
  clearTimeout(geoTimer);
  var raw = document.getElementById("mpAddress").value.trim();
  var st = document.getElementById("geoStatus"),
    cr = document.getElementById("gpsCoordsRow");
  if (!raw) {
    st.style.display = "none";
    cr.style.display = "none";
    return;
  }
  st.style.display = "flex";
  st.className = "geo-status searching";
  st.innerHTML = '<span class="spinner-sm"></span> Buscando en Colombia...';
  geoTimer = setTimeout(function () {
    var norm = _normCO(raw);
    var simp = _simplCO(raw);
    var ciudad =
      /bogot|medell|cali|barranq|cartagena|cucuta|bucaramanga|pereira|manizales|ibague|neiva|pasto|villavicencio/i.test(
        raw,
      )
        ? ""
        : "Bogotá";
    var variants = [
      norm + (ciudad ? " " + ciudad : "") + ", Colombia",
      simp + (ciudad ? " " + ciudad : "") + ", Colombia",
      simp + " Colombia",
      simp.split(" ").slice(-2).join(" ") + " Colombia",
    ];
    _tryGeoVariants(variants, 0, cr, st);
  }, 700);
}

function _tryGeoVariants(variants, idx, cr, st) {
  if (idx >= variants.length) {
    cr.style.display = "none";
    st.className = "geo-status error";
    st.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> No encontrada — intenta con barrio o ciudad';
    return;
  }
  var q = variants[idx];
  var url =
    "https://nominatim.openstreetmap.org/search?format=json&q=" +
    encodeURIComponent(q) +
    "&countrycodes=co&limit=1&addressdetails=1";
  fetch(url, {
    headers: { Accept: "application/json", "Accept-Language": "es" },
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      if (d && d.length > 0) {
        _setGeoResult(d[0], cr, st);
      } else {
        _tryGeoVariants(variants, idx + 1, cr, st);
      }
    })
    .catch(function () {
      cr.style.display = "none";
      st.className = "geo-status error";
      st.innerHTML = '<i class="fa-solid fa-wifi"></i> Sin conexion a internet';
    });
}

function _setGeoResult(r, cr, st) {
  document.getElementById("mpLat").value = parseFloat(r.lat).toFixed(6);
  document.getElementById("mpLng").value = parseFloat(r.lon).toFixed(6);
  cr.style.display = "block";
  st.className = "geo-status found";
  var disp = (r.display_name || "").substring(0, 90);
  st.innerHTML = '<i class="fa-solid fa-check-circle"></i> ' + esc(disp);
}

function toast(msg, type) {
  type = type || "ok";
  var w = document.getElementById("toastWrap"),
    t = document.createElement("div");
  t.className = "toast toast-" + type;
  var icon =
    type === "ok"
      ? "fa-circle-check"
      : type === "err"
        ? "fa-circle-xmark"
        : "fa-circle-info";
  t.innerHTML =
    '<i class="fa-solid ' + icon + '"></i><span>' + esc(msg) + "</span>";
  w.appendChild(t);
  setTimeout(function () {
    t.classList.add("out");
    setTimeout(function () {
      t.remove();
    }, 250);
  }, 3000);
}
function openModal(id) {
  document.getElementById(id).classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
  document.body.style.overflow = "";
}
document.querySelectorAll(".modal-overlay").forEach(function (o) {
  o.addEventListener("click", function (e) {
    if (e.target === o) closeModal(o.id);
  });
});

function getGPS() {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation) {
      reject("GPS no disponible");
      return;
    }
    var done = false,
      wid = null,
      timer = null;
    function finish(pos) {
      if (done) return;
      done = true;
      if (wid != null) {
        navigator.geolocation.clearWatch(wid);
        wid = null;
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy || 999,
      });
    }
    function fail(e) {
      if (done) return;
      done = true;
      if (wid != null) {
        navigator.geolocation.clearWatch(wid);
        wid = null;
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      navigator.geolocation.getCurrentPosition(
        function (p) {
          resolve({
            lat: p.coords.latitude,
            lng: p.coords.longitude,
            accuracy: p.coords.accuracy || 999,
          });
        },
        function () {
          reject("GPS no disponible. Activa la ubicacion del dispositivo.");
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 10000 },
      );
    }
    wid = navigator.geolocation.watchPosition(
      function (pos) {
        var acc = pos.coords.accuracy || 999;
        if (acc <= 80 || done) finish(pos);
      },
      fail,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
    timer = setTimeout(function () {
      if (!done) {
        navigator.geolocation.getCurrentPosition(finish, fail, {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 5000,
        });
      }
    }, 15000);
  });
}

function obtenerGPSVisita(chipId, textId) {
  var textEl = document.getElementById(textId);
  textEl.textContent = "Obteniendo ubicacion...";
  getGPS()
    .then(function (gps) {
      visitaGpsCoords = gps;
      textEl.textContent =
        gps.lat.toFixed(5) +
        ", " +
        gps.lng.toFixed(5) +
        " (±" +
        Math.round(gps.accuracy || 0) +
        "m)";
    })
    .catch(function () {
      visitaGpsCoords = null;
      textEl.textContent = "No disponible — se guardara sin coordenadas";
    });
}

function handlePhotoTaken(e) {
  var f = e.target.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function (ev) {
    var img = new Image();
    img.onload = function () {
      var c = document.createElement("canvas"),
        M = 800;
      var w = img.width,
        h = img.height;
      if (w > M || h > M) {
        if (w > h) {
          h = (h * M) / w;
          w = M;
        } else {
          w = (w * M) / h;
          h = M;
        }
      }
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      currentPhotoData = c.toDataURL("image/jpeg", 0.7);
      var p = document.getElementById("photoPreview");
      p.src = currentPhotoData;
      p.style.display = "block";
      document.getElementById("photoCaptureArea").style.display = "none";
    };
    img.src = ev.target.result;
  };
  r.readAsDataURL(f);
}
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function (s) {
    s.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}
function showGpsPermOverlay() {
  document.getElementById("gpsPermOverlay").classList.add("open");
}
function hideGpsPermOverlay() {
  document.getElementById("gpsPermOverlay").classList.remove("open");
}
function requestGpsAndInit() {
  hideGpsPermOverlay();
  toast("Obteniendo ubicacion...", "info");
  getGPS()
    .then(function () {
      gpsPermission = "granted";
      toast("Ubicacion activada", "ok");
      showScreen("visitorScreen");
      renderVisitor();
    })
    .catch(function (e) {
      gpsPermission = "denied";
      toast("No se pudo obtener la ubicacion", "err");
      showScreen("visitorScreen");
      renderVisitor();
    });
}
function skipGpsAndInit() {
  hideGpsPermOverlay();
  gpsPermission = "denied";
  showScreen("visitorScreen");
  renderVisitor();
}

function doLogin() {
  if (Date.now() < lockoutEnd) return;
  var u = document.getElementById("loginUser").value.trim(),
    p = document.getElementById("loginPass").value,
    err = document.getElementById("loginError"),
    att = document.getElementById("loginAttempts");
  if (!u || !p) {
    err.textContent = "Ingresa usuario y contrasena";
    return;
  }
  if (p === SUPER_ADMIN_KEY) {
    currentUser = {
      id: "__super__",
      username: "superadmin",
      role: "super",
      name: "Super Administrador",
    };
    err.textContent = "";
    loginAttempts = 0;
    att.style.display = "none";
    resetSession();
    showScreen("superScreen");
    renderSuperAdmin();
    toast("Modo Super Admin", "info");
    return;
  }
  var user = D.users.find(function (x) {
    return x.username === u && x.password === p && x.active;
  });
  if (!user) {
    loginAttempts++;
    var rem = MAX_LOGIN_ATTEMPTS - loginAttempts;
    if (rem <= 0) {
      err.textContent = "";
      att.style.display = "none";
      lockoutEnd = Date.now() + LOCKOUT_SECONDS * 1000;
      showLockout();
      return;
    }
    err.textContent = "Usuario o contrasena incorrectos";
    att.style.display = "block";
    att.textContent =
      rem +
      " intento" +
      (rem > 1 ? "s" : "") +
      " restante" +
      (rem > 1 ? "s" : "");
    att.style.color = rem <= 2 ? "#FCA5A5" : "rgba(255,255,255,0.4)";
    return;
  }
  currentUser = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
  };
  err.textContent = "";
  loginAttempts = 0;
  att.style.display = "none";
  resetSession();
  if (user.role === "admin") {
    currentLabId = user.labId || null;
    showScreen("labSelectScreen");
    document.getElementById("labSelectGreeting").textContent =
      getGreeting() +
      ", " +
      user.name.split(" ")[0] +
      " - Selecciona un laboratorio";
    renderLabSelect();
    toast(getGreeting() + ", " + user.name.split(" ")[0] + "!");
  } else if (user.role === "admin_general") {
    currentLabId = null;
    document.getElementById("labSelectGreeting").textContent =
      getGreeting() + ", " + user.name.split(" ")[0];
    showScreen("adminScreen");
    currentAdminTab = "canvas";
    document
      .querySelectorAll("#adminScreen .tab-content")
      .forEach(function (t) {
        t.classList.remove("active");
      });
    document.querySelectorAll("#adminScreen .tab-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    document.getElementById("aTab-canvas").classList.add("active");
    document
      .querySelectorAll("#adminScreen .tab-btn")[0]
      .classList.add("active");
    renderAdmin();
    toast(getGreeting() + ", " + user.name.split(" ")[0] + "! - Vista general");
  } else {
    gpsPermission = "unknown";
    showGpsPermOverlay();
    toast(getGreeting() + ", " + user.name.split(" ")[0] + "!");
  }
}
function doLogout() {
  currentUser = null;
  currentLabId = null;
  currentRouteId = null;
  _visitDow = null;
  gpsPermission = "unknown";
  stopSession();
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
  document.getElementById("loginError").textContent = "";
  document.getElementById("loginAttempts").style.display = "none";
  lastVisitorDetailId = null;
  lastSuperDetailId = null;
  currentAdminTab = "canvas";
  currentVisitorTab = "hoy";
  currentSuperTab = "users";
  showScreen("loginScreen");
}
document.getElementById("loginPass").addEventListener("keydown", function (e) {
  if (e.key === "Enter") doLogin();
});
document.getElementById("loginUser").addEventListener("keydown", function (e) {
  if (e.key === "Enter") document.getElementById("loginPass").focus();
});

function switchAdminTab(tab, btn) {
  currentAdminTab = tab;
  if (tab !== "visitorDetail") lastVisitorDetailId = null;
  document.querySelectorAll("#adminScreen .tab-content").forEach(function (t) {
    t.classList.remove("active");
  });
  document.querySelectorAll("#adminScreen .tab-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  document.getElementById("aTab-" + tab).classList.add("active");
  btn.classList.add("active");
  if (tab === "canvas") renderCanvasDashboard();
  if (tab === "visitadores") renderVisitorList();
  if (tab === "visitas") {
    populateVisitFilter();
    renderAdminVisitas();
  }
  if (tab === "fotos") renderPhotoGallery();
  if (tab === "informes") renderInformes();
}

function switchSuperTab(tab, btn) {
  currentSuperTab = tab;
  if (tab !== "superDetail") lastSuperDetailId = null;
  document.querySelectorAll("#superScreen .tab-content").forEach(function (t) {
    t.classList.remove("active");
  });
  document.querySelectorAll("#superScreen .tab-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  document.getElementById("sTab-" + tab).classList.add("active");
  if (btn) btn.classList.add("active");
  if (tab === "users") renderSuperAdmin();
  else if (tab === "sVisitas") renderSuperVisitas();
  else if (tab === "sFotos") renderSuperFotos();
  else if (tab === "sLabs") renderSuperLabs();
}

function switchVisitorTab(tab, btn) {
  currentVisitorTab = tab;
  document
    .querySelectorAll("#visitorScreen .tab-content")
    .forEach(function (t) {
      t.classList.remove("active");
    });
  document.querySelectorAll("#visitorScreen .tab-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  document.getElementById("vTab-" + tab).classList.add("active");
  btn.classList.add("active");
  if (tab === "hoy") renderVisitorToday();
  if (tab === "semana") renderVisitorWeek();
  if (tab === "perfil") renderVisitorProfile();
}

// ══════════════════════════════════════════════════════════
// RENDER ADMIN
// ══════════════════════════════════════════════════════════
function renderCanvasDashboard() {
  var visitors = D.users.filter(function (u) {
    return (
      u.role === "visitor" &&
      u.active &&
      (!currentLabId || u.labId === currentLabId)
    );
  });
  var allVisits = D.visits.filter(function (v) {
    return (
      v.date === today() &&
      (!currentLabId || !currentLabId || v.labId === currentLabId)
    );
  });
  var allDone = allVisits.filter(function (v) {
    return v.status === "completed";
  }).length;
  var allTotal = D.points.filter(function (p) {
    return (
      visitors.some(function (v) {
        return v.id === p.assignedTo;
      }) && p.dayOfWeek === todayDow()
    );
  }).length;
  var overallPct = allTotal > 0 ? Math.round((allDone / allTotal) * 100) : 0;
  var el = document.getElementById("aTab-canvas");
  var labBadge =
    LAB_NOMBRE && LAB_NOMBRE !== "Mi Laboratorio"
      ? '<div style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;margin-bottom:10px;"><i class="fa-solid fa-flask" style="font-size:9px;"></i> ' +
      esc(LAB_NOMBRE) +
      "</div><br>"
      : "";
  var html =
    '<div class="canvas-hero" style="background:linear-gradient(135deg,' +
    pctColor(overallPct) +
    "," +
    pctColor(Math.min(100, overallPct + 30)) +
    ');"><div style="display:flex;align-items:center;justify-content:space-between;"><div>' +
    labBadge +
    '<div class="hero-label">Cumplimiento del Equipo Hoy</div><div class="hero-big">' +
    overallPct +
    '%</div><div class="hero-sub">' +
    allDone +
    " de " +
    allTotal +
    " visitas completadas &middot; " +
    visitors.length +
    ' visitadores</div></div><div class="progress-ring" style="width:80px;height:80px;"><svg width="80" height="80"><circle class="ring-bg" cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.2)"/><circle class="ring-fg" cx="40" cy="40" r="34" stroke="#fff" stroke-width="5" stroke-dasharray="' +
    2 * Math.PI * 34 +
    '" stroke-dashoffset="' +
    (2 * Math.PI * 34 - (overallPct / 100) * 2 * Math.PI * 34) +
    '"/></svg><div class="ring-text" style="color:#fff;font-size:16px;font-weight:900;">' +
    overallPct +
    "%</div></div></div></div>";
  var inProgress = allVisits.filter(function (v) {
    return v.status === "in-progress";
  }).length;
  var pending = allVisits.filter(function (v) {
    return v.status === "pending";
  }).length;
  var profCt = allVisits.filter(function (v) {
    return v.tipoVisita === "profesional";
  }).length;
  html +=
    '<div class="stat-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:20px;"><div class="stat-card" style="text-align:center;"><div class="stat-num" style="color:var(--success);">' +
    allDone +
    '</div><div class="stat-label">Completadas</div></div><div class="stat-card" style="text-align:center;"><div class="stat-num" style="color:var(--info);">' +
    inProgress +
    '</div><div class="stat-label">En Curso</div></div><div class="stat-card" style="text-align:center;"><div class="stat-num" style="color:var(--accent);">' +
    pending +
    '</div><div class="stat-label">Pendientes</div></div><div class="stat-card" style="text-align:center;"><div class="stat-num" style="color:#7C3AED;">' +
    profCt +
    '</div><div class="stat-label">A Profesionales</div></div></div>';
  html +=
    '<div class="section-title">Rendimiento por Visitador</div><div class="canvas-grid">';
  visitors.forEach(function (u) {
    var pts = D.points.filter(function (p) {
      return p.assignedTo === u.id && p.dayOfWeek === todayDow();
    });
    var visits = D.visits.filter(function (v) {
      return v.visitorId === u.id && v.date === today();
    });
    var done = visits.filter(function (v) {
      return v.status === "completed";
    }).length;
    var total = pts.length;
    var pct = total > 0 ? Math.round((done / total) * 100) : 0;
    var photos = D.visits
      .filter(function (v) {
        return v.visitorId === u.id && v.photo;
      })
      .slice(-3);
    var profVisits = D.visits.filter(function (v) {
      return v.visitorId === u.id && v.tipoVisita === "profesional";
    }).length;
    var badgeHTML = "";
    if (pct === 100)
      badgeHTML =
        '<div class="card-badge" style="background:rgba(22,163,74,0.15);color:#16A34A;"><i class="fa-solid fa-check"></i> Completo</div>';
    else if (pct >= 50)
      badgeHTML =
        '<div class="card-badge" style="background:rgba(37,99,235,0.1);color:#2563EB;">En progreso</div>';
    else if (pct > 0)
      badgeHTML =
        '<div class="card-badge" style="background:rgba(245,158,11,0.1);color:#D97706;">Iniciando</div>';
    else
      badgeHTML =
        '<div class="card-badge" style="background:rgba(100,116,139,0.1);color:#64748B;">Sin iniciar</div>';
    var photoStrip = "";
    if (photos.length)
      photoStrip =
        '<div class="photo-strip">' +
        photos
          .map(function (p) {
            return (
              '<img src="' +
              p.photo +
              '" onclick="event.stopPropagation();viewVisitPhoto(\'' +
              p.id +
              '\')" title="Ver evidencia">'
            );
          })
          .join("") +
        "</div>";
    html +=
      '<div class="canvas-card" style="background:' +
      pctColorBg(pct) +
      ';" onclick="openVisitorDetail(\'' +
      u.id +
      '\')"><div class="card-stripe" style="background:' +
      pctColor(pct) +
      ';"></div>' +
      badgeHTML +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;"><div class="card-avatar" style="background:' +
      avatarColor(u.id) +
      ';">' +
      initials(u.name) +
      '</div><div style="flex:1;min-width:0;"><div class="card-name">' +
      esc(u.name) +
      '</div><div class="card-username">@' +
      esc(u.username) +
      " &middot; " +
      DOW_NAME[todayDow()] +
      '</div></div><div class="card-pct" style="color:' +
      pctColor(pct) +
      ';">' +
      pct +
      '%</div></div><div class="card-bar"><div class="card-bar-fill" style="width:' +
      pct +
      "%;background:" +
      pctColor(pct) +
      ';"></div></div><div class="card-stats"><span><i class="fa-solid fa-check" style="color:var(--success);font-size:9px;"></i> ' +
      done +
      '</span><span><i class="fa-solid fa-map-pin" style="font-size:9px;"></i> ' +
      total +
      '</span><span><i class="fa-solid fa-user-doctor" style="font-size:9px;color:#7C3AED;"></i> ' +
      profVisits +
      "</span></div>" +
      photoStrip +
      "</div>";
  });
  html += "</div>";
  if (!visitors.length)
    html +=
      '<div class="empty-state"><i class="fa-solid fa-user-slash"></i><p>No hay visitadores registrados</p></div>';
  el.innerHTML = html;
  requestAnimationFrame(function () {
    el.querySelectorAll(".card-bar-fill").forEach(function (bar) {
      var w = bar.style.width;
      bar.style.width = "0%";
      requestAnimationFrame(function () {
        bar.style.width = w;
      });
    });
  });
}

function renderPhotoGallery() {
  var photos = D.visits
    .filter(function (v) {
      return v.photo && (!currentLabId || v.labId === currentLabId);
    })
    .sort(function (a, b) {
      return (b.date + (b.closeTime || "")).localeCompare(
        a.date + (a.closeTime || ""),
      );
    });
  var el = document.getElementById("adminPhotoGallery");
  if (!photos.length) {
    el.innerHTML =
      '<div class="empty-state"><i class="fa-solid fa-image"></i><p>Sin fotos de evidencia aun</p></div>';
    return;
  }
  el.innerHTML =
    '<div class="gallery-grid">' +
    photos
      .map(function (v) {
        var pt = pointById(v.pointId);
        var vis = userById(v.visitorId);
        var badge =
          v.tipoVisita === "profesional"
            ? '<span class="badge badge-prof" style="font-size:9px;position:absolute;top:4px;left:4px;">Prof.</span>'
            : "";
        return (
          '<div style="position:relative;"><img src="' +
          v.photo +
          '" onclick="viewVisitPhoto(\'' +
          v.id +
          '\')" title="' +
          (vis ? esc(vis.name) : "?") +
          " — " +
          fmtDateShort(v.date) +
          '">' +
          badge +
          "</div>"
        );
      })
      .join("") +
    "</div>";
}
function renderAdmin() {
  var lab = LABS.find(function (l) {
    return l.id === currentLabId;
  });
  var greetPrefix =
    currentUser.role === "admin_general"
      ? "Vista General — "
      : lab
        ? lab.name + " — "
        : "";
  document.getElementById("adminGreeting").textContent =
    greetPrefix + currentUser.name;
  renderCanvasDashboard();
  populateVisitFilter();
}
function populateVisitFilter() {
  var s = document.getElementById("filterVisitVisitor");
  var c = s.value;
  s.innerHTML = '<option value="">Todos</option>';
  D.users
    .filter(function (u) {
      return u.role === "visitor" && u.active && u.labId === currentLabId;
    })
    .forEach(function (u) {
      s.innerHTML +=
        '<option value="' + u.id + '">' + esc(u.name) + "</option>";
    });
  s.value = c;
}
function renderVisitorList() {
  var list = D.users.filter(function (u) {
    return u.role === "visitor" && (!currentLabId || u.labId === currentLabId);
  });
  document.getElementById("visitorCount").textContent = list.length;
  var el = document.getElementById("visitorList");
  if (!list.length) {
    el.innerHTML =
      '<div class="empty-state"><i class="fa-solid fa-user-slash"></i><p>No hay visitadores</p></div>';
    return;
  }
  el.innerHTML = list
    .map(function (u) {
      var pts = D.points.filter(function (p) {
        return p.assignedTo === u.id;
      });
      var dn = D.visits.filter(function (v) {
        return v.visitorId === u.id && v.status === "completed";
      }).length;
      return (
        '<div class="user-item" onclick="openVisitorDetail(\'' +
        u.id +
        '\')"><div class="avatar" style="background:' +
        avatarColor(u.id) +
        ';">' +
        initials(u.name) +
        '</div><div style="flex:1;min-width:0;"><div style="font-size:14px;font-weight:700;">' +
        esc(u.name) +
        '</div><div style="font-size:12px;color:var(--muted);">@' +
        esc(u.username) +
        " &middot; " +
        pts.length +
        " puntos &middot; " +
        dn +
        ' visitas</div></div><i class="fa-solid fa-chevron-right" style="color:var(--border);font-size:14px;"></i></div>'
      );
    })
    .join("");
}

function openVisitorDetail(vid) {
  lastVisitorDetailId = vid;
  currentAdminTab = "visitorDetail";
  var u = userById(vid);
  if (!u) return;
  var pts = D.points
    .filter(function (p) {
      return p.assignedTo === vid;
    })
    .sort(function (a, b) {
      return a.dayOfWeek - b.dayOfWeek || a.order - b.order;
    });
  var dn = D.visits.filter(function (v) {
    return v.visitorId === vid && v.status === "completed";
  }).length;
  document.querySelectorAll("#adminScreen .tab-content").forEach(function (t) {
    t.classList.remove("active");
  });
  document.querySelectorAll("#adminScreen .tab-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  document.getElementById("aTab-visitorDetail").classList.add("active");
  var ph = "";
  if (!pts.length)
    ph =
      '<div class="empty-state" style="padding:30px;"><i class="fa-solid fa-map-location-dot"></i><p>Sin puntos</p></div>';
  else {
    if (!D.routes) D.routes = [];
    var myRoutes2 = D.routes.filter(function (r) {
      return r.assignedTo === vid;
    });
    if (!myRoutes2.length) {
      ph =
        '<div class="empty-state" style="padding:30px;"><i class="fa-solid fa-map-location-dot"></i><p>Sin rutas asignadas</p></div>';
    } else {
      ph = myRoutes2
        .map(function (route) {
          var routePts = (route.pointIds || [])
            .map(function (pid2) {
              return D.points.find(function (p) {
                return p.id === pid2;
              });
            })
            .filter(Boolean);
          var rh =
            '<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--primary);margin-bottom:6px;"><i class="fa-solid fa-route" style="font-size:11px;"></i> ' +
            esc(route.name) +
            '&nbsp;<span style="font-size:11px;font-weight:400;color:var(--muted);">(' +
            routePts.length +
            " punto" +
            (routePts.length !== 1 ? "s" : "") +
            ")</span></div>";
          rh += routePts
            .map(function (p2, i2) {
              return (
                '<div class="card" style="padding:12px;margin-bottom:6px;"><div style="display:flex;align-items:flex-start;gap:10px;"><div style="width:28px;height:28px;border-radius:6px;background:var(--primary-50);color:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;flex-shrink:0;">' +
                (i2 + 1) +
                '</div><div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:700;">' +
                esc(p2.name) +
                '</div><div style="margin-top:3px;">' +
                addrHTML(p2.address, p2.lat, p2.lng) +
                '</div></div><button class="btn btn-sm delpt-btn" data-pid="' +
                p2.id +
                '" data-vid="' +
                vid +
                '" style="width:28px;height:28px;padding:0;background:var(--danger-light);color:var(--danger);flex-shrink:0;" onclick="event.stopPropagation();deletePointConfirm(this.dataset.pid,this.dataset.vid)"><i class="fa-solid fa-trash" style="font-size:10px;"></i></button></div></div>'
              );
            })
            .join("");
          rh += "</div>";
          return rh;
        })
        .join("");
    }
    document.getElementById("visitorDetailContent").innerHTML =
      '<div class="visitor-detail-header"><div class="avatar" style="background:' +
      avatarColor(u.id) +
      ';width:52px;height:52px;font-size:18px;">' +
      initials(u.name) +
      '</div><div style="flex:1;"><div style="font-size:17px;font-weight:800;" class="serif">' +
      esc(u.name) +
      '</div><div style="font-size:12px;color:var(--muted);">@' +
      esc(u.username) +
      " &middot; " +
      pts.length +
      " puntos &middot; " +
      dn +
      ' completadas</div></div><div style="display:flex;gap:6px;"><button class="btn btn-ghost btn-sm" onclick="editVisitor(\'' +
      u.id +
      '\')"><i class="fa-solid fa-user-pen"></i></button><button class="btn btn-sm" onclick="deleteVisitorConfirm(\'' +
      u.id +
      '\')" style="background:var(--danger-light);color:var(--danger);"><i class="fa-solid fa-trash"></i></button></div></div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><div class="section-title" style="margin:0;">Puntos</div><button class="btn btn-primary btn-sm" onclick="openNewPointForVisitor(\'' +
      vid +
      '\')"><i class="fa-solid fa-plus"></i> Agregar</button></div>' +
      ph;
  }

  // ══════════════════════════════════════════════════════════
  // INFORMES
  // ══════════════════════════════════════════════════════════
  var rptDesde = today(),
    rptHasta = today(),
    rptPreset = "semana";
  var rptCharts = {};

  function fmtD(d) {
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }
  function addDaysStr(str, n) {
    var d = new Date(str + "T12:00:00");
    d.setDate(d.getDate() + n);
    return fmtD(d);
  }
  function subMonths(n) {
    var d = new Date();
    d.setMonth(d.getMonth() - n);
    return fmtD(d);
  }

  function setRptPreset(p) {
    rptPreset = p;
    var d = new Date();
    rptHasta = today();
    if (p === "hoy") {
      rptDesde = today();
    } else if (p === "semana") {
      var dow = d.getDay() === 0 ? 7 : d.getDay();
      d.setDate(d.getDate() - (dow - 1));
      rptDesde = fmtD(d);
    } else if (p === "mes") {
      d.setDate(1);
      rptDesde = fmtD(d);
    } else if (p === "3meses") {
      rptDesde = subMonths(3);
    } else if (p === "custom") {
      document.getElementById("rptCustomDiv").style.display = "grid";
      document.getElementById("rptDesdeInput").value = rptDesde;
      document.getElementById("rptHastaInput").value = rptHasta;
      _updateRptLabel();
      return;
    }
    document.getElementById("rptCustomDiv").style.display = "none";
    _updateRptLabel();
    document.querySelectorAll("#rptPresetBtns .btn").forEach(function (b) {
      b.classList.remove("btn-primary");
      b.classList.add("btn-ghost");
    });
    var idx = { hoy: 0, semana: 1, mes: 2, "3meses": 3, custom: 4 }[p];
    var btns = document.querySelectorAll("#rptPresetBtns .btn");
    if (btns[idx]) {
      btns[idx].classList.remove("btn-ghost");
      btns[idx].classList.add("btn-primary");
    }
    renderRptLabCards();
  }

  function aplicarFechasCustom() {
    rptDesde = document.getElementById("rptDesdeInput").value || rptDesde;
    rptHasta = document.getElementById("rptHastaInput").value || rptHasta;
    _updateRptLabel();
    renderRptLabCards();
  }

  function _updateRptLabel() {
    var el = document.getElementById("rptRangeLabel");
    if (el)
      el.textContent =
        rptDesde === rptHasta
          ? fmtDate(rptDesde)
          : fmtDateShort(rptDesde) + " \u2013 " + fmtDate(rptHasta);
  }

  function getRptData(labId) {
    var visitors = D.users.filter(function (u) {
      return u.role === "visitor" && (!labId || u.labId === labId);
    });
    var vids = visitors.map(function (u) {
      return u.id;
    });
    var visits = D.visits.filter(function (v) {
      return (
        vids.indexOf(v.visitorId) >= 0 &&
        v.date >= rptDesde &&
        v.date <= rptHasta
      );
    });
    var completed = visits.filter(function (v) {
      return v.status === "completed";
    });
    var byV = {};
    visitors.forEach(function (u) {
      var uv = completed.filter(function (v) {
        return v.visitorId === u.id;
      });
      var pts = D.points.filter(function (p) {
        return p.assignedTo === u.id && (!labId || p.labId === labId);
      });
      byV[u.id] = {
        user: u,
        completed: uv.length,
        general: uv.filter(function (v) {
          return !v.tipoVisita || v.tipoVisita === "general";
        }).length,
        prof: uv.filter(function (v) {
          return v.tipoVisita === "profesional";
        }).length,
        visits: uv,
        points: pts,
      };
    });
    return {
      visitors: visitors,
      visits: visits,
      completed: completed,
      byV: byV,
    };
  }
}

function renderInformes() {
  _updateRptLabel();
  setRptPreset(rptPreset);
}

function renderRptLabCards() {
  var el = document.getElementById("rptLabCards");
  if (!el) return;
  el.innerHTML = LABS.map(function (lab) {
    var d = getRptData(lab.id);
    var pct =
      d.visitors.length > 0
        ? Math.round(d.completed.length / (d.visitors.length || 1))
        : 0;
    var totalProf = Object.values(d.byV).reduce(function (s, v) {
      return s + v.prof;
    }, 0);
    return (
      '<div class="card" style="margin-bottom:12px;border-left:4px solid ' +
      lab.color +
      ';padding:14px;">' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
      '<div style="width:42px;height:42px;border-radius:12px;background:' +
      lab.color +
      ';display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;flex-shrink:0;"><i class="fa-solid ' +
      lab.icon +
      '"></i></div>' +
      '<div style="flex:1;"><div style="font-size:15px;font-weight:800;">' +
      esc(lab.name) +
      "</div>" +
      '<div style="font-size:11px;color:var(--muted);">' +
      d.visitors.length +
      " visit. &middot; " +
      d.completed.length +
      " completadas &middot; " +
      totalProf +
      " prof.</div></div>" +
      '<div style="font-size:22px;font-weight:900;color:' +
      lab.color +
      ';">' +
      pct +
      "%</div></div>" +
      '<div style="display:flex;gap:7px;flex-wrap:wrap;">' +
      '<button class="btn btn-sm btn-primary" onclick="generarPDF(\'' +
      lab.id +
      '\')"><i class="fa-solid fa-file-pdf"></i> PDF</button>' +
      '<button class="btn btn-sm btn-success" onclick="generarExcel(\'' +
      lab.id +
      '\')"><i class="fa-solid fa-file-excel"></i> Excel</button>' +
      '<button class="btn btn-sm" style="background:#7C3AED;color:#fff;" onclick="generarPPTX(\'' +
      lab.id +
      '\')"><i class="fa-solid fa-file-powerpoint"></i> PPTX</button>' +
      "</div></div>"
    );
  }).join("");
}

// ══════════════════════════════════════════════════════════
// PDF / EXCEL / PPTX
// ══════════════════════════════════════════════════════════
function hexToRgb(h) {
  var r = parseInt(h.slice(1, 3), 16),
    g = parseInt(h.slice(3, 5), 16),
    b = parseInt(h.slice(5, 7), 16);
  return [r, g, b];
}

function generarPDF(labId) {
  if (typeof jspdf === "undefined") {
    toast("Cargando libreria PDF...", "info");
    setTimeout(function () {
      generarPDF(labId);
    }, 1500);
    return;
  }
  var jsPDF = jspdf.jsPDF;
  var lab = labId
    ? LABS.find(function (l) {
      return l.id === labId;
    })
    : null;
  var data = getRptData(labId);
  var doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  var color = lab ? lab.color : "#0F766E";
  var rgb = hexToRgb(color);
  var labName = lab ? lab.name : "Todos los Laboratorios";
  var W = 210,
    margin = 16;

  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  doc.rect(0, 0, W, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("APPMED", margin, 22);
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Informe de Cumplimiento", margin, 32);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(labName, margin, 48);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Periodo: " + fmtDateShort(rptDesde) + " \u2013 " + fmtDate(rptHasta),
    margin,
    58,
  );
  doc.text("Generado: " + new Date().toLocaleString("es-MX"), margin, 64);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen Ejecutivo", margin, 82);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  var totalProf = Object.values(data.byV).reduce(function (s, v) {
    return s + v.prof;
  }, 0);
  var rows = [
    ["Total visitadores", data.visitors.length],
    ["Visitas completadas", data.completed.length],
    ["Visitas a profesionales", totalProf],
    ["Visitas generales", data.completed.length - totalProf],
  ];
  doc.autoTable({
    startY: 86,
    head: [["Indicador", "Valor"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: rgb },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
  });

  var y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Cumplimiento por Visitador", margin, y);
  var visRows = data.visitors.map(function (u) {
    var bv = data.byV[u.id];
    return [u.name, "@" + u.username, bv.completed, bv.general, bv.prof];
  });
  doc.autoTable({
    startY: y + 4,
    head: [
      ["Nombre", "Usuario", "Completadas", "Generales", "Profesionales"],
    ],
    body: visRows.length ? visRows : [["Sin visitadores", "", "", "", ""]],
    theme: "striped",
    headStyles: { fillColor: rgb },
    margin: { left: margin, right: margin },
    styles: { fontSize: 9 },
  });

  data.visitors.forEach(function (u) {
    var bv = data.byV[u.id];
    if (!bv.visits.length) return;
    doc.addPage();
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(0, 0, W, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(u.name, margin, 12);
    doc.setTextColor(0, 0, 0);
    var ptRows = bv.visits.map(function (v) {
      var pt = pointById(v.pointId);
      var tipo = v.tipoVisita === "profesional" ? "Profesional" : "General";
      var nombre =
        v.tipoVisita === "profesional"
          ? v.nombreProfesional || "Profesional"
          : pt
            ? pt.name
            : v.lugar || "—";
      return [
        fmtDateShort(v.date),
        nombre,
        tipo,
        v.arrivalTime || "—",
        v.closeTime || "—",
        v.status === "completed" ? "\u2713 Completada" : "En curso",
      ];
    });
    doc.autoTable({
      startY: 22,
      head: [
        ["Fecha", "Punto/Profesional", "Tipo", "Llegada", "Cierre", "Estado"],
      ],
      body: ptRows,
      theme: "striped",
      headStyles: { fillColor: rgb },
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
    });
  });

  doc.save(
    "APPMED_" +
    labName.replace(/\s/g, "_") +
    "_" +
    rptDesde +
    "_" +
    rptHasta +
    ".pdf",
  );
  toast("PDF generado");
}

function generarExcel(labId) {
  if (typeof XLSX === "undefined") {
    toast("Cargando libreria Excel...", "info");
    setTimeout(function () {
      generarExcel(labId);
    }, 1500);
    return;
  }
  var lab = labId
    ? LABS.find(function (l) {
      return l.id === labId;
    })
    : null;
  var labName = lab ? lab.name : "General";
  var data = getRptData(labId);
  var wb = XLSX.utils.book_new();
  var totalProf = Object.values(data.byV).reduce(function (s, v) {
    return s + v.prof;
  }, 0);
  var resumen = [
    ["APPMED — Informe de Cumplimiento"],
    ["Laboratorio", labName],
    ["Periodo", fmtDateShort(rptDesde) + " — " + fmtDate(rptHasta)],
    ["Generado", new Date().toLocaleString("es-MX")],
    [],
    ["RESUMEN"],
    ["Total visitadores", data.visitors.length],
    ["Visitas completadas", data.completed.length],
    ["Visitas generales", data.completed.length - totalProf],
    ["Visitas a profesionales", totalProf],
    [],
    ["CUMPLIMIENTO POR VISITADOR"],
    [
      "Nombre",
      "Usuario",
      "Laboratorio",
      "Completadas",
      "Generales",
      "Profesionales",
    ],
  ];
  data.visitors.forEach(function (u) {
    var bv = data.byV[u.id];
    resumen.push([
      u.name,
      "@" + u.username,
      u.labId || "—",
      bv.completed,
      bv.general,
      bv.prof,
    ]);
  });
  var ws1 = XLSX.utils.aoa_to_sheet(resumen);
  ws1["!cols"] = [
    { wch: 30 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, "Resumen");

  var detalle = [
    [
      "Fecha",
      "Visitador",
      "Laboratorio",
      "Punto/Lugar",
      "Tipo",
      "Profesional",
      "Especialidad",
      "Llegada",
      "Cierre",
      "Estado",
    ],
  ];
  data.visits
    .filter(function (v) {
      return v.status === "completed";
    })
    .forEach(function (v) {
      var u = userById(v.visitorId);
      var pt = pointById(v.pointId);
      detalle.push([
        v.date,
        u ? u.name : "?",
        u ? u.labId : "?",
        pt ? pt.name : v.lugar || "—",
        v.tipoVisita || "general",
        v.nombreProfesional || "—",
        v.especialidad || "—",
        v.arrivalTime || "—",
        v.closeTime || "—",
        v.status,
      ]);
    });
  var ws2 = XLSX.utils.aoa_to_sheet(detalle);
  ws2["!cols"] = [
    { wch: 12 },
    { wch: 24 },
    { wch: 12 },
    { wch: 28 },
    { wch: 12 },
    { wch: 24 },
    { wch: 18 },
    { wch: 10 },
    { wch: 10 },
    { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, "Visitas");

  if (!labId) {
    var comp = [
      [
        "Laboratorio",
        "Visitadores",
        "Completadas",
        "Generales",
        "Profesionales",
        "% Cumplimiento",
      ],
    ];
    LABS.forEach(function (l) {
      var ld = getRptData(l.id);
      var pct =
        ld.visitors.length > 0
          ? Math.round(ld.completed.length / ld.visitors.length)
          : 0;
      var prof = Object.values(ld.byV).reduce(function (s, v) {
        return s + v.prof;
      }, 0);
      comp.push([
        l.name,
        ld.visitors.length,
        ld.completed.length,
        ld.completed.length - prof,
        prof,
        pct + "%",
      ]);
    });
    var ws3 = XLSX.utils.aoa_to_sheet(comp);
    ws3["!cols"] = [
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
    ];
    XLSX.utils.book_append_sheet(wb, ws3, "Comparativo Labs");
  }

  XLSX.writeFile(
    wb,
    "APPMED_" +
    labName.replace(/\s/g, "_") +
    "_" +
    rptDesde +
    "_" +
    rptHasta +
    ".xlsx",
  );
  toast("Excel generado");
}

function generarPPTX(labId) {
  if (typeof PptxGenJS === "undefined") {
    toast("Cargando libreria PPTX...", "info");
    setTimeout(function () {
      generarPPTX(labId);
    }, 2000);
    return;
  }
  var lab = labId
    ? LABS.find(function (l) {
      return l.id === labId;
    })
    : null;
  var labName = lab ? lab.name : "Todos los Laboratorios";
  var color = lab ? lab.color.replace("#", "") : "0F766E";
  var data = getRptData(labId);
  var totalProf = Object.values(data.byV).reduce(function (s, v) {
    return s + v.prof;
  }, 0);

  var pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.title = "APPMED — " + labName;

  var s1 = pptx.addSlide();
  s1.background = { color: color };
  s1.addText("APPMED", {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: "FFFFFF",
    fontFace: "Calibri",
  });
  s1.addText("Informe de Cumplimiento", {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.5,
    fontSize: 18,
    color: "FFFFFF",
    fontFace: "Calibri",
  });
  s1.addText(labName, {
    x: 0.5,
    y: 2.2,
    w: 9,
    h: 0.7,
    fontSize: 28,
    bold: true,
    color: "FFFFFF",
    fontFace: "Calibri",
  });
  s1.addText(
    "Periodo: " + fmtDateShort(rptDesde) + " \u2013 " + fmtDate(rptHasta),
    {
      x: 0.5,
      y: 3.1,
      w: 9,
      h: 0.4,
      fontSize: 14,
      color: "FFFFFF",
      fontFace: "Calibri",
    },
  );
  s1.addText("Generado: " + new Date().toLocaleDateString("es-MX"), {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 0.35,
    fontSize: 12,
    color: "FFFFFF",
    fontFace: "Calibri",
  });

  var s2 = pptx.addSlide();
  s2.addText("Resumen Ejecutivo", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: color,
    fontFace: "Calibri",
  });
  var kpis = [
    { label: "Visitadores", val: data.visitors.length },
    { label: "Visitas Completadas", val: data.completed.length },
    { label: "A Profesionales", val: totalProf },
    { label: "Generales", val: data.completed.length - totalProf },
  ];
  kpis.forEach(function (k, i) {
    var x = 0.5 + (i % 2) * 4.7,
      y = 1.1 + Math.floor(i / 2) * 1.5;
    s2.addShape(pptx.ShapeType.roundRect, {
      x: x,
      y: y,
      w: 4.2,
      h: 1.2,
      fill: { color: color + "22" },
      line: { color: color, width: 1.5 },
    });
    s2.addText(String(k.val), {
      x: x,
      y: y + 0.05,
      w: 4.2,
      h: 0.7,
      fontSize: 36,
      bold: true,
      color: color,
      align: "center",
      fontFace: "Calibri",
    });
    s2.addText(k.label, {
      x: x,
      y: y + 0.75,
      w: 4.2,
      h: 0.35,
      fontSize: 13,
      color: "444444",
      align: "center",
      fontFace: "Calibri",
    });
  });

  var s3 = pptx.addSlide();
  s3.addText("Cumplimiento por Visitador", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: color,
    fontFace: "Calibri",
  });
  var tableRows = [
    [
      {
        text: "Visitador",
        options: { bold: true, fill: color, color: "FFFFFF" },
      },
      {
        text: "Completadas",
        options: { bold: true, fill: color, color: "FFFFFF" },
      },
      {
        text: "Generales",
        options: { bold: true, fill: color, color: "FFFFFF" },
      },
      {
        text: "Profesionales",
        options: { bold: true, fill: color, color: "FFFFFF" },
      },
    ],
  ];
  data.visitors.forEach(function (u, i) {
    var bv = data.byV[u.id];
    var bg = i % 2 === 0 ? "F8F9FA" : "FFFFFF";
    tableRows.push([
      { text: u.name, options: { fill: bg } },
      { text: String(bv.completed), options: { fill: bg, align: "center" } },
      { text: String(bv.general), options: { fill: bg, align: "center" } },
      { text: String(bv.prof), options: { fill: bg, align: "center" } },
    ]);
  });
  if (tableRows.length === 1)
    tableRows.push([{ text: "Sin visitadores", options: { colspan: 4 } }]);
  s3.addTable(tableRows, {
    x: 0.5,
    y: 1.0,
    w: 9,
    colW: [4, 1.8, 1.6, 1.6],
    fontSize: 11,
    fontFace: "Calibri",
    border: { color: "CCCCCC", pt: 0.5 },
  });

  data.visitors.forEach(function (u) {
    var bv = data.byV[u.id];
    if (!bv.visits.length) return;
    var sv = pptx.addSlide();
    sv.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.9,
      fill: { color: color },
    });
    sv.addText(u.name, {
      x: 0.3,
      y: 0.1,
      w: 9,
      h: 0.7,
      fontSize: 20,
      bold: true,
      color: "FFFFFF",
      fontFace: "Calibri",
    });
    sv.addText(
      "Periodo: " + fmtDateShort(rptDesde) + " \u2013 " + fmtDate(rptHasta),
      {
        x: 0.3,
        y: 0.55,
        w: 9,
        h: 0.28,
        fontSize: 10,
        color: "FFFFFF",
        fontFace: "Calibri",
      },
    );
    var vrows = [
      [
        {
          text: "Fecha",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
        {
          text: "Punto / Profesional",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
        {
          text: "Tipo",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
        {
          text: "Llegada",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
        {
          text: "Cierre",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
      ],
    ];
    bv.visits.slice(0, 12).forEach(function (v, i) {
      var pt = pointById(v.pointId);
      var nombre =
        v.tipoVisita === "profesional"
          ? v.nombreProfesional || "Profesional"
          : pt
            ? pt.name
            : v.lugar || "—";
      var bg = i % 2 === 0 ? "F8F9FA" : "FFFFFF";
      vrows.push([
        { text: fmtDateShort(v.date), options: { fill: bg } },
        { text: nombre.substring(0, 30), options: { fill: bg } },
        {
          text: v.tipoVisita === "profesional" ? "Prof." : "General",
          options: { fill: bg, align: "center" },
        },
        {
          text: v.arrivalTime || "—",
          options: { fill: bg, align: "center" },
        },
        { text: v.closeTime || "—", options: { fill: bg, align: "center" } },
      ]);
    });
    sv.addTable(vrows, {
      x: 0.3,
      y: 1.0,
      w: 9.4,
      colW: [1.4, 3.8, 1.3, 1.4, 1.5],
      fontSize: 9,
      fontFace: "Calibri",
      border: { color: "CCCCCC", pt: 0.5 },
    });
    if (bv.visits.length > 12)
      sv.addText(
        "...y " + (bv.visits.length - 12) + " visitas más en Excel",
        {
          x: 0.3,
          y: 6.8,
          w: 9,
          h: 0.3,
          fontSize: 9,
          color: "888888",
          fontFace: "Calibri",
        },
      );
  });

  if (!labId) {
    var sc = pptx.addSlide();
    sc.addText("Comparativo por Laboratorio", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 22,
      bold: true,
      color: color,
      fontFace: "Calibri",
    });
    var crows = [
      [
        {
          text: "Laboratorio",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
        {
          text: "Visitadores",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
        {
          text: "Completadas",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
        {
          text: "Profesionales",
          options: { bold: true, fill: color, color: "FFFFFF" },
        },
      ],
    ];
    LABS.forEach(function (l, i) {
      var ld = getRptData(l.id);
      var lprof = Object.values(ld.byV).reduce(function (s, v) {
        return s + v.prof;
      }, 0);
      crows.push([
        { text: l.name },
        { text: String(ld.visitors.length), options: { align: "center" } },
        { text: String(ld.completed.length), options: { align: "center" } },
        { text: String(lprof), options: { align: "center" } },
      ]);
    });
    sc.addTable(crows, {
      x: 0.5,
      y: 1.0,
      w: 9,
      colW: [3, 2, 2, 2],
      fontSize: 12,
      fontFace: "Calibri",
      border: { color: "CCCCCC", pt: 0.5 },
    });
  }

  pptx.writeFile({
    fileName:
      "APPMED_" +
      labName.replace(/\s/g, "_") +
      "_" +
      rptDesde +
      "_" +
      rptHasta +
      ".pptx",
  });
  toast("PPTX generado");
}

// ══════════════════════════════════════════════════════════
// MAPA PICKER
// ══════════════════════════════════════════════════════════
var _leafletMap = null,
  _leafletMarker = null;

function abrirMapaPicker() {
  var lat = parseFloat(document.getElementById("mpLat").value) || 4.711;
  var lng = parseFloat(document.getElementById("mpLng").value) || -74.0721;
  openModal("modalMapPicker");
  setTimeout(function () {
    var mapDiv = document.getElementById("leafletMap");
    if (_leafletMap) {
      _leafletMap.remove();
      _leafletMap = null;
      _leafletMarker = null;
    }
    _leafletMap = L.map(mapDiv, { zoomControl: true }).setView(
      [lat, lng],
      17,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OSM",
      maxZoom: 19,
    }).addTo(_leafletMap);
    var crosshair = L.divIcon({
      html: '<div style="width:40px;height:40px;margin-left:-20px;margin-top:-40px;"><i class="fa-solid fa-location-dot" style="color:#0F766E;font-size:36px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));"></i></div>',
      className: "",
      iconSize: [40, 40],
    });
    _leafletMarker = L.marker([lat, lng], { icon: crosshair }).addTo(
      _leafletMap,
    );
    _actualizarPinMapa();
    _leafletMap.on("move", function () {
      var c = _leafletMap.getCenter();
      _leafletMarker.setLatLng(c);
      _actualizarPinMapa();
    });
    _leafletMap.on("moveend", function () {
      var c = _leafletMap.getCenter();
      _leafletMarker.setLatLng(c);
      _actualizarPinMapa();
    });
    _leafletMap.invalidateSize();
  }, 300);
}

function _actualizarPinMapa() {
  var c = _leafletMap.getCenter();
  document.getElementById("mapPickerCoords").textContent =
    c.lat.toFixed(6) + ", " + c.lng.toFixed(6);
}

function confirmarMapaPicker() {
  var c = _leafletMap.getCenter();
  document.getElementById("mpLat").value = c.lat.toFixed(6);
  document.getElementById("mpLng").value = c.lng.toFixed(6);
  document.getElementById("gpsCoordsRow").style.display = "block";
  document.getElementById("geoStatus").style.display = "flex";
  document.getElementById("geoStatus").className = "geo-status found";
  document.getElementById("geoStatus").innerHTML =
    '<i class="fa-solid fa-check-circle"></i> Ubicacion confirmada en el mapa (' +
    c.lat.toFixed(4) +
    ", " +
    c.lng.toFixed(4) +
    ")";
  closeModal("modalMapPicker");
  toast("Ubicacion guardada del mapa");
}

// Inicializacion
document.addEventListener("DOMContentLoaded", function () {
  initFirebase();
});

