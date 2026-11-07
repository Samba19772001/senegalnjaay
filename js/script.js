/* ---- À modifier facilement ---- */
var WHATSAPP = "221788288812";          // numéro WhatsApp, format international sans + ni espaces
var WHATSAPP_AFFICHE = "+221 78 828 88 12";

// Tes nouvelles photos : dépose l'image dans assets/images/ puis ajoute une ligne, par exemple :
//   { src: "assets/images/photo-1.jpg", alt: "Description de la photo" },
var PHOTOS = [
  { src: "assets/images/coumba.jpeg", alt: "coumba" },
  { src: "assets/images/bae.jpeg", alt: "Description de la photo" },
  { src: "assets/images/boy.jpeg", alt: "Description de la photo" },
  { src: "assets/images/groupe.jpeg", alt: "Description de la photo" },
  { src: "assets/images/vv.jpeg", alt: "Description de la photo" },
];
var EMPLACEMENTS_PHOTO = 3;             // nombre d'emplacements « Photo à venir » tant que PHOTOS est vide

// Tes nouvelles vidéos : dépose le fichier dans assets/videos/ puis ajoute une ligne, par exemple :
//   { src: "assets/videos/video-1.mp4", poster: "assets/images/video-1.jpg", titre: "Collection noire" },
// (poster est facultatif : une image de assets/images/ qui s'affiche avant la lecture)
var VIDEOS = [
  { src: "assets/videos/mia.mp4", poster: "assets/images/mia-poster.webp", titre: "Collection noire" },
  { src: "assets/videos/mannequin.mp4", poster: "assets/images/mannequin-poster.webp", titre: "Collection noire" },
  { src: "assets/videos/mia2.mp4", poster: "assets/images/mia2-poster.webp", titre: "Collection noire" },
  { src: "assets/videos/samba.mp4", poster: "assets/images/samba-poster.webp", titre: "Collection noire" },
];
var EMPLACEMENTS_VIDEO = 3;             // nombre d'emplacements « Vidéo à venir » tant que VIDEOS est vide

// Défilement automatique des bandes (produits, photos, vidéos)
var DEFILEMENT_AUTO = true;             // false pour le couper
var DELAI_DEFILEMENT = 3500;            // millisecondes entre deux défilements

// Produits : une entrée par produit. Coloris sans « img » : l'affiche du produit sert d'image.
// tailles: null = pas de taille (ex. les sacs).
var PRODUITS = [
  {
    id: "tshirt", nom: "T-shirt", pluriel: "T-shirts", img: "assets/images/produit-tshirt.jpg",
    texte: "Le classique SENEGAL Njaay, en 100 % coton pur .",
    tailles: ["S", "M", "L", "XL", "XXL"],
    coloris: [
      { id: "noir", nom: "Noir", hex: "#14161F" },
      { id: "blanc", nom: "Blanc", hex: "#FEFEFF" },
      { id: "vert", nom: "Vert", hex: "#61E777" },
      { id: "rouge", nom: "Rouge", hex: "#B4232C" },
      { id: "marine", nom: "Bleu marine", hex: "#1E2A5E" },
      { id: "rose", nom: "Rose délavé", hex: "#E5679B" },
      { id: "charbon", nom: "Gris charbon", hex: "#5A5757" },
      { id: "bleugris", nom: "Bleu-gris délavé", hex: "#7D86A6" },

      { id: "marron", nom: "Marron", hex: "#8B6652" }
    ]
  },
  {
    id: "pull", nom: "Pull", pluriel: "Pulls", img: "assets/images/produit-pull.jpg",
    texte: "Des pulls à capuche de qualité exceptionnelle.",
    tailles: ["S", "M", "L", "XL", "XXL"],
    coloris: [
      { id: "noir", nom: "Noir", hex: "#14161F" },
      { id: "blanc", nom: "Blanc", hex: "#FEFEFF" },
      { id: "vert", nom: "Vert", hex: "#61E777" },
      { id: "rouge", nom: "Rouge", hex: "#B4232C" },
      { id: "marine", nom: "Bleu marine", hex: "#1E2A5E" },
      { id: "rose", nom: "Rose délavé", hex: "#E5679B" },
      { id: "charbon", nom: "Gris charbon", hex: "#5A5757" },
      { id: "bleugris", nom: "Bleu-gris délavé", hex: "#7D86A6" },

      { id: "marron", nom: "Marron", hex: "#8B6652" }
    ]
  },
  {
    id: "sac", nom: "Sac", pluriel: "Sacs", img: "assets/images/produit-sac.jpg",
    texte: "Le Sénégal au bout des épaules.",
    tailles: null,
    coloris: [
      { id: "noir", nom: "Noir", hex: "#14161F" },

      { id: "blanc", nom: "Blanc", hex: "#FEFEFF" },
      { id: "vert", nom: "Vert", hex: "#61E777" },
      { id: "rouge", nom: "Rouge", hex: "#B4232C" },
      { id: "marine", nom: "Bleu marine", hex: "#1E2A5E" },
      { id: "rose", nom: "Rose délavé", hex: "#E5679B" },
      { id: "charbon", nom: "Gris charbon", hex: "#5A5757" },
      { id: "bleugris", nom: "Bleu-gris délavé", hex: "#7D86A6" },

      { id: "marron", nom: "Marron", hex: "#8B6652" }
    ]
  }
];
/* -------------------------------- */

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { }

  function prod(id) { return PRODUITS.filter(function (p) { return p.id === id; })[0] || PRODUITS[0]; }
  function colorOf(p, id) { return p.coloris.filter(function (c) { return c.id === id; })[0] || p.coloris[0]; }
  function imgOf(p, c) { return c.img || p.img; }

  var PLAY_ICON = '<span class="vplay" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>';

  // Logo : affiche l'image si assets/images/logo.png existe, sinon garde le texte
  Array.prototype.forEach.call(document.querySelectorAll(".logo-slot"), function (slot) {
    var img = slot.querySelector("img");
    function ok() { slot.classList.add("has-img"); }
    img.addEventListener("load", ok);
    img.addEventListener("error", function () { slot.classList.remove("has-img"); });
    if (img.complete && img.naturalWidth > 0) ok();
  });

  /* ---------- Visionneuse (affiches, photos et vidéos en grand) ---------- */
  var lb = $("lightbox"), lbImg = $("lbImg"), lbVid = $("lbVid"), lbCap = $("lbCap");
  var lbList = [], lbIdx = 0, lbOpener = null, startX = null;

  function stopVideo() { lbVid.pause(); lbVid.removeAttribute("src"); lbVid.removeAttribute("poster"); lbVid.load(); }
  function showItem(i) {
    lbIdx = (i + lbList.length) % lbList.length;
    var it = lbList[lbIdx], isVideo = it.type === "video";
    lbImg.hidden = isVideo; lbVid.hidden = !isVideo;
    if (isVideo) {
      lbImg.removeAttribute("src");
      lbVid.src = it.src;
      if (it.poster) lbVid.poster = it.poster;
      var p = lbVid.play(); if (p && p.catch) p.catch(function () { });
    } else {
      stopVideo();
      lbImg.src = it.src; lbImg.alt = it.label || "";
    }
    lbCap.textContent = (it.label ? it.label + "\n" : "") + (lbIdx + 1) + " sur " + lbList.length;
  }
  function openViewer(list, i, opener) {
    if (!list.length) return;
    lbList = list; lbOpener = opener || null;
    showItem(i);
    $("lbPrev").hidden = $("lbNext").hidden = list.length < 2;
    lb.hidden = false;
    document.documentElement.style.overflow = "hidden";
    $("lbClose").focus();
  }
  function closeViewer() {
    lb.hidden = true;
    document.documentElement.style.overflow = "";
    stopVideo(); lbImg.removeAttribute("src");
    if (lbOpener) lbOpener.focus();
  }
  $("lbClose").addEventListener("click", closeViewer);
  $("lbPrev").addEventListener("click", function () { showItem(lbIdx - 1); });
  $("lbNext").addEventListener("click", function () { showItem(lbIdx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-fig")) closeViewer(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeViewer();
    else if (e.key === "ArrowLeft" && lbList.length > 1) showItem(lbIdx - 1);
    else if (e.key === "ArrowRight" && lbList.length > 1) showItem(lbIdx + 1);
    else if (e.key === "Tab") {   // garde le focus dans la visionneuse
      var f = [].filter.call(lb.querySelectorAll("button, video[controls]"), function (b) { return !b.hidden; });
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  lb.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (startX === null || lbList.length < 2) return;
    var dx = e.changedTouches[0].clientX - startX; startX = null;
    if (Math.abs(dx) > 60) showItem(lbIdx + (dx < 0 ? 1 : -1));
  });

  /* ---------- Produits (bande horizontale) ---------- */
  var productItems = PRODUITS.map(function (p) { return { type: "image", src: p.img, label: p.pluriel }; });
  var pt = $("produits-track");
  PRODUITS.forEach(function (p, i) {
    var a = document.createElement("article");
    a.className = "slide product";
    a.innerHTML =
      '<button class="pimg" type="button" aria-label="Agrandir l\'affiche : ' + p.pluriel + '"><img loading="lazy" src="' + p.img + '" alt="Affiche ' + p.pluriel + ' SENEGAL Njaay"></button>' +
      '<div class="pbody"><h3>' + p.pluriel + '</h3><p>' + p.texte + '</p>' +
      '<a class="btn small" href="#commander" data-produit="' + p.id + '">Commander</a></div>';
    a.querySelector(".pimg").addEventListener("click", function (e) { openViewer(productItems, i, e.currentTarget); });
    pt.appendChild(a);
  });
  pt.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-produit]");
    if (a) setProduct(a.getAttribute("data-produit"));
  });

  /* ---------- Photos (bande horizontale) ---------- */
  var photoItems = PHOTOS.map(function (ph) { return { type: "image", src: ph.src, label: ph.alt || "" }; });
  var pg = $("photos-track");
  if (PHOTOS.length) {
    PHOTOS.forEach(function (ph, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "slide photo";
      b.setAttribute("aria-label", "Agrandir la photo" + (ph.alt ? " : " + ph.alt : " " + (i + 1)));
      var im = document.createElement("img");
      im.src = ph.src; im.alt = ph.alt || ""; im.loading = "lazy";
      b.appendChild(im);
      b.addEventListener("click", function () { openViewer(photoItems, i, b); });
      pg.appendChild(b);
    });
  } else {
    for (var k = 0; k < EMPLACEMENTS_PHOTO; k++) {
      var e1 = document.createElement("div"); e1.className = "slide photo empty"; e1.textContent = "Photo à venir"; pg.appendChild(e1);
    }
  }

  /* ---------- Vidéos (bande horizontale) ---------- */
  var videoItems = VIDEOS.map(function (v) { return { type: "video", src: v.src, poster: v.poster, label: v.titre || "" }; });
  var vg = $("videos-track");
  if (VIDEOS.length) {
    VIDEOS.forEach(function (v, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "slide video";
      b.setAttribute("aria-label", "Voir la vidéo" + (v.titre ? " : " + v.titre : " " + (i + 1)));
      var el = document.createElement("video");
      el.muted = true; el.setAttribute("muted", "");   // muette : obligatoire pour démarrer toute seule
      el.loop = true; el.playsInline = true; el.setAttribute("playsinline", ""); el.preload = "metadata";
      el.src = v.src + (v.src.indexOf("#") < 0 ? "#t=0.1" : "");   // #t=0.1 : affiche une image avant la lecture
      if (v.poster) el.poster = v.poster;
      el.tabIndex = -1; el.setAttribute("aria-hidden", "true");
      b.appendChild(el);
      b.insertAdjacentHTML("beforeend", PLAY_ICON);
      b.addEventListener("click", function () { openViewer(videoItems, i, b); });
      vg.appendChild(b);
    });
  } else {
    for (var j = 0; j < EMPLACEMENTS_VIDEO; j++) {
      var e2 = document.createElement("div"); e2.className = "slide video empty"; e2.textContent = "Vidéo à venir"; vg.appendChild(e2);
    }
  }

  // Les vidéos muettes se lancent quand elles sont visibles à l'écran et s'arrêtent sinon
  if (!reduce && "IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var p = en.target.play(); if (p && p.catch) p.catch(function () { }); }
        else en.target.pause();
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(document.querySelectorAll(".slide.video video, .shop-video video"), function (v) { vio.observe(v); });
  }

  /* ---------- Bandes horizontales : défilement automatique + à la main ---------- */
  function setupCarousel(root) {
    var track = root.querySelector(".track"), last = 0, hover = false, inView = false;
    var prev = document.createElement("button"), next = document.createElement("button");
    prev.type = next.type = "button";
    prev.className = "car-btn car-prev"; next.className = "car-btn car-next";
    prev.setAttribute("aria-label", "Faire défiler vers la gauche"); next.setAttribute("aria-label", "Faire défiler vers la droite");
    prev.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    next.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    root.appendChild(prev); root.appendChild(next);

    function max() { return track.scrollWidth - track.clientWidth; }
    function step() {
      var s = track.querySelector(".slide"), gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return s ? s.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    }
    function go(dir) {
      var t = track.scrollLeft + dir * step();
      if (dir > 0 && track.scrollLeft >= max() - 4) t = 0;          // fin de bande : retour au début
      if (dir < 0 && track.scrollLeft <= 4) t = max();
      track.scrollTo({ left: t, behavior: reduce ? "auto" : "smooth" });
    }
    function refresh() { root.classList.toggle("has-overflow", max() > 8); }
    function touch() { last = Date.now(); }                          // le visiteur a la main : on laisse 5 s avant de reprendre

    prev.addEventListener("click", function () { touch(); go(-1); });
    next.addEventListener("click", function () { touch(); go(1); });
    ["pointerdown", "touchstart", "touchend", "wheel", "keydown", "focusin"].forEach(function (ev) {
      track.addEventListener(ev, touch, { passive: true });
    });
    root.addEventListener("mouseenter", function () { hover = true; });
    root.addEventListener("mouseleave", function () { hover = false; touch(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: 0.3 }).observe(root);
    } else { inView = true; }
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);
    refresh();

    if (DEFILEMENT_AUTO && !reduce) {
      setInterval(function () {
        if (hover || !inView || !lb.hidden || max() <= 8 || Date.now() - last < 5000) return;
        go(1);
      }, DELAI_DEFILEMENT);
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-carousel]"), setupCarousel);

  /* ---------- Coloris du t-shirt (grille) ---------- */
  var grid = $("grid");
  if (grid) PRODUITS[0].coloris.forEach(function (c) {
    var card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<img loading="lazy" src="' + c.img + '" alt="T-shirt SENEGAL Njaay ' + c.nom.toLowerCase() + '">' +
      '<div class="card-row"><span class="card-name"><span class="dot" style="background:' + c.hex + '"></span>' + c.nom + '</span>' +
      '<a class="btn ghost small" href="#commander" data-id="' + c.id + '">Choisir</a></div>';
    grid.appendChild(card);
  });
  if (grid) grid.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-id]");
    if (a) { setProduct(PRODUITS[0].id); setColor(a.getAttribute("data-id")); }
  });

  /* ---------- Commande : produit, coloris, taille, panier ---------- */
  var curP = PRODUITS[0].id, curC = PRODUITS[0].coloris[0].id;
  var customColor = "";
  var cart = [];

  var pbox = $("prodChoices"), cbox = $("colorChoices");
  PRODUITS.forEach(function (p) {
    var inp = document.createElement("input");
    inp.type = "radio"; inp.name = "prod"; inp.id = "p-" + p.id; inp.value = p.id;
    var lab = document.createElement("label");
    lab.htmlFor = inp.id; lab.textContent = p.nom;
    pbox.appendChild(inp); pbox.appendChild(lab);
  });
  pbox.addEventListener("change", function (e) { setProduct(e.target.value); });
  cbox.addEventListener("change", function (e) { setColor(e.target.value); });
  $("customColor").addEventListener("input", function () {
    customColor = this.value.trim();

    if (curC === "autre") {
      showPreview();
    }
  });

  function renderColors() {
    var p = prod(curP);
    cbox.innerHTML = "";
    p.coloris.forEach(function (c) {
      var inp = document.createElement("input");
      inp.type = "radio"; inp.name = "color"; inp.id = "c-" + c.id; inp.value = c.id;
      var lab = document.createElement("label");
      lab.htmlFor = inp.id;
      lab.innerHTML = '<span class="dot" style="background:' + c.hex + '"></span>' + c.nom;
      cbox.appendChild(inp); cbox.appendChild(lab);
    });
    // Option autre couleur
    var other = document.createElement("input");
    other.type = "radio";
    other.name = "color";
    other.id = "c-autre";
    other.value = "autre";

    var otherLabel = document.createElement("label");
    otherLabel.htmlFor = "c-autre";
    otherLabel.textContent = "Autre couleur";

    cbox.appendChild(other);
    cbox.appendChild(otherLabel);
  }
  function renderSizes() {
    var p = prod(curP), sel = $("size");
    $("sizeWrap").hidden = !p.tailles;
    sel.innerHTML = "";
    (p.tailles || []).forEach(function (t) { var o = document.createElement("option"); o.textContent = t; sel.appendChild(o); });
    if (p.tailles) sel.value = p.tailles.indexOf("L") >= 0 ? "L" : p.tailles[0];
  }
  function showPreview() {
    var p = prod(curP), im = $("previewImg");

    if (curC === "autre") {
      im.src = p.img;
      im.classList.add("poster");
      im.alt = p.nom + " SENEGAL Njaay, couleur personnalisée";
      $("previewDot").style.background = "#888888";
      $("previewName").textContent =
        p.nom + " " + (customColor || "couleur personnalisée");
      return;
    }

    var c = colorOf(p, curC);
    im.src = imgOf(p, c);
    im.classList.toggle("poster", !c.img);
    im.alt = p.nom + " SENEGAL Njaay " + c.nom.toLowerCase();
    $("previewDot").style.background = c.hex;
    $("previewName").textContent = p.nom + " " + c.nom.toLowerCase();
  }
  function setProduct(pid) {
    curP = prod(pid).id;
    $("p-" + curP).checked = true;
    curC = prod(curP).coloris[0].id;

    customColor = "";
    $("customColor").value = "";
    $("customColorWrap").hidden = true;

    renderColors();
    renderSizes();
    $("c-" + curC).checked = true;
    showPreview();
  }
  function setColor(cid) {
    curC = cid === "autre" ? "autre" : colorOf(prod(curP), cid).id;

    $("customColorWrap").hidden = curC !== "autre";

    if (curC !== "autre") {
      customColor = "";
      $("customColor").value = "";
    }

    var el = $("c-" + curC);
    if (el) el.checked = true;

    showPreview();
    update();

    if (curC === "autre") $("customColor").focus();
  }

  function qtyValue() { return Math.max(1, Math.min(50, parseInt($("qty").value, 10) || 1)); }
  function label(it) {
    var p = prod(it.pid);

    if (it.cid === "autre") {
      var custom = it.customColor || "couleur à préciser";

      return {
        p: p,
        c: { nom: custom, hex: "#888888" },
        detail: custom + (it.size ? ", taille " + it.size : "")
      };
    }

    var c = colorOf(p, it.cid);

    return {
      p: p,
      c: c,
      detail: c.nom + (it.size ? ", taille " + it.size : "")
    };
  }

  function renderCart() {
    var ul = $("cart");
    ul.innerHTML = "";
    $("cartEmpty").hidden = cart.length > 0;
    cart.forEach(function (it, i) {
      var l = label(it), li = document.createElement("li");
      li.innerHTML = '<img src="' + imgOf(l.p, l.c) + '" alt=""><span class="what">' + it.qty + ' × ' + l.p.nom + '<small>' + l.detail + '</small></span>' +
        '<button type="button" data-i="' + i + '" aria-label="Retirer ' + l.p.nom + ', ' + l.detail + '">Retirer</button>';
      ul.appendChild(li);
    });
  }

  $("add").addEventListener("click", function () {
    $("add").addEventListener("click", function () {
      var p = prod(curP);
      var size = p.tailles ? $("size").value : "";
      var qty = qtyValue();
      var hit = null;
      var b = this;

      // Récupérer la couleur personnalisée
      var selectedCustomColor = "";

      if (curC === "autre") {
        selectedCustomColor = $("customColor").value.trim();

        if (!selectedCustomColor) {
          $("customColor").focus();
          $("customColor").setCustomValidity("Veuillez saisir la couleur souhaitée.");
          $("customColor").reportValidity();
          return;
        }

        $("customColor").setCustomValidity("");
      }

      // Vérifier si le même article existe déjà dans le panier
      cart.forEach(function (it) {
        if (
          it.pid === curP &&
          it.cid === curC &&
          it.size === size &&
          it.customColor === selectedCustomColor
        ) {
          hit = it;
        }
      });

      // Ajouter ou augmenter la quantité
      if (hit) {
        hit.qty = Math.min(50, hit.qty + qty);
      } else {
        cart.push({
          pid: curP,
          cid: curC,
          size: size,
          qty: qty,
          customColor: selectedCustomColor
        });
      }

      renderCart();
      update();

      b.textContent = "Ajouté";

      setTimeout(function () {
        b.textContent = "Ajouter à ma commande";
      }, 1400);
    });
  });
  $("cart").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-i]");
    if (b) { cart.splice(parseInt(b.getAttribute("data-i"), 10), 1); renderCart(); update(); }
  });

  function message() {
    if (!cart.length) return "";
    var total = 0, lines = ["Bonjour SenegalNdiaye,", "je voudrais commander :"];
    cart.forEach(function (it) {
      var l = label(it); total += it.qty;
      lines.push("- " + it.qty + " × " + l.p.nom.toLowerCase() + " " + l.c.nom.toLowerCase() + (it.size ? ", taille " + it.size : ""));
    });
    lines.push("Total : " + total + " article" + (total > 1 ? "s" : ""));
    var name = $("name").value.trim(), city = $("city").value.trim();
    if (name) lines.push("Mon prénom : " + name);
    if (city) lines.push("Ville : " + city);
    lines.push("Merci !");
    return lines.join("\n");
  }

  function update() {
    var m = message(), wa = $("wa"), has = cart.length > 0;
    $("msg").textContent = has ? m : "Ton message apparaîtra ici dès que tu auras ajouté un article à ta commande.";
    wa.href = has ? "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(m) : "#commander";
    if (has) { wa.removeAttribute("aria-disabled"); wa.target = "_blank"; }
    else { wa.setAttribute("aria-disabled", "true"); wa.removeAttribute("target"); }
    $("copy").disabled = !has;
  }
  $("wa").addEventListener("click", function (e) { if (this.getAttribute("aria-disabled") === "true") e.preventDefault(); });
  ["name", "city"].forEach(function (id) { $(id).addEventListener("input", update); });
  $("orderForm").addEventListener("submit", function (e) { e.preventDefault(); });

  $("copy").addEventListener("click", function () {
    var btn = this, text = message();
    function done(ok) {
      btn.textContent = ok ? "Message copié" : "Sélectionne le message pour le copier";
      if (!ok) { var r = document.createRange(); r.selectNodeContents($("msg")); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      setTimeout(function () { btn.textContent = "Copier le message"; }, 2200);
    }
    try { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); }
    catch (err) { done(false); }
  });

  $("waNumber").textContent = WHATSAPP_AFFICHE;
  setProduct(curP);
  renderCart();
  update();

  // Mouvement réduit : la vidéo d'en-tête ne démarre pas toute seule
  if (reduce) { var hv = $("heroVideo"); hv.pause(); hv.removeAttribute("autoplay"); hv.controls = true; }
})();
