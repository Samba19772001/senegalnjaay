/* ---- À modifier facilement ---- */
var WHATSAPP = "221788288812";          // numéro WhatsApp, format international sans + ni espaces
var WHATSAPP_AFFICHE = "+221 78 828 88 12";

// Tes nouvelles photos : dépose l'image dans assets/images/ puis ajoute une ligne, par exemple :
//   { src: "assets/images/photo-1.jpg", alt: "Description de la photo" },
var PHOTOS = [
  { src: "assets/images/new.jpeg", alt: "Description de la photo" },
  { src: "assets/images/coumba.jpeg", alt: "Description de la photo" },
  { src: "assets/images/new1.jpeg", alt: "Description de la photo" },

  { src: "assets/images/vv.jpeg", alt: "Description de la photo" },
  { src: "assets/images/boy.jpeg", alt: "Description de la photo" },
  { src: "assets/images/groupe.jpeg", alt: "Description de la photo" },
  { src: "assets/images/bae.jpeg", alt: "Description de la photo" },
];
var EMPLACEMENTS_PHOTO = 3;             // nombre d'emplacements « Photo à venir » tant que PHOTOS est vide

// Tes nouvelles vidéos : dépose le fichier dans assets/videos/ puis ajoute une ligne, par exemple :
//   { src: "assets/videos/video-1.mp4", poster: "assets/images/video-1.jpg", titre: "Collection noire" },
// (poster est facultatif : une image de assets/images/ qui s'affiche avant la lecture)
var VIDEOS = [
  { src: "assets/videos/mia.mp4", titre: "Collection" },
  { src: "assets/videos/mannequin.mp4", titre: "Collection" },
  { src: "assets/videos/mia2.mp4", titre: "Collection" },
  { src: "assets/videos/boutique.mp4", titre: "Collection" },
  { src: "assets/videos/samba.mp4", titre: "Collection" },



];
var EMPLACEMENTS_VIDEO = 8;             // nombre d'emplacements « Vidéo à venir » tant que VIDEOS est vide

// Coloris : une ligne de plus ici (et la photo dans assets/) ajoute une carte
var COLORIS = [
  { id: "noir", nom: "Noir", hex: "#14161F", img: "assets/images/noir.jpg" },
  { id: "rouge", nom: "Rouge", hex: "#B4232C", img: "assets/images/rouge.jpg" },
  { id: "marine", nom: "Bleu marine", hex: "#1E2A5E", img: "assets/images/marine.jpg" },
  { id: "rose", nom: "Rose délavé", hex: "#E5679B", img: "assets/images/rose.jpg" },
  { id: "charbon", nom: "Gris charbon", hex: "#5A5757", img: "assets/images/charbon.jpg" },
  { id: "bleugris", nom: "Bleu-gris délavé", hex: "#7D86A6", img: "assets/images/bleugris.jpg" },
  { id: "orange", nom: "Orange", hex: "#D2762F", img: "assets/images/orange.jpg" },
  { id: "marron", nom: "Marron", hex: "#8B6652", img: "assets/images/marron.jpg" }
];
/* -------------------------------- */

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var current = COLORIS[0].id;

  function find(id) { return COLORIS.filter(function (c) { return c.id === id; })[0] || COLORIS[0]; }

  // Logo : affiche l'image si assets/images/logo.png existe, sinon garde le texte
  Array.prototype.forEach.call(document.querySelectorAll(".logo-slot"), function (slot) {
    var img = slot.querySelector("img");
    function ok() { slot.classList.add("has-img"); }
    img.addEventListener("load", ok);
    img.addEventListener("error", function () { slot.classList.remove("has-img"); });
    if (img.complete && img.naturalWidth > 0) ok();
  });

  // Photos
  var pg = $("photos-grid");
  if (PHOTOS.length) {
    PHOTOS.forEach(function (ph, i) {
      var d = document.createElement("button"); d.type = "button"; d.className = "pslot";
      d.setAttribute("aria-label", "Agrandir la photo" + (ph.alt ? " : " + ph.alt : " " + (i + 1)));
      var im = document.createElement("img");
      im.src = ph.src; im.alt = ph.alt || ""; im.loading = "lazy";
      d.appendChild(im);
      d.addEventListener("click", function () { openPhoto(i, d); });
      pg.appendChild(d);
    });
  } else {
    for (var k = 0; k < EMPLACEMENTS_PHOTO; k++) {
      var e = document.createElement("div"); e.className = "pslot empty"; e.textContent = "Photo à venir"; pg.appendChild(e);
    }
  }

  // Visionneuse : clic sur une photo pour la voir en grand
  var lb = $("lightbox"), lbImg = $("lbImg"), lbCap = $("lbCap"), lbIdx = 0, lbOpener = null, startX = null;
  function showPhoto(i) {
    lbIdx = (i + PHOTOS.length) % PHOTOS.length;
    var ph = PHOTOS[lbIdx];
    lbImg.src = ph.src; lbImg.alt = ph.alt || "";
    lbCap.textContent = (ph.alt ? ph.alt + "\n" : "") + (lbIdx + 1) + " sur " + PHOTOS.length;
  }
  function openPhoto(i, opener) {
    if (!PHOTOS.length) return;
    lbOpener = opener || null;
    showPhoto(i);
    $("lbPrev").hidden = $("lbNext").hidden = PHOTOS.length < 2;
    lb.hidden = false;
    document.documentElement.style.overflow = "hidden";
    $("lbClose").focus();
  }
  function closePhoto() {
    lb.hidden = true;
    document.documentElement.style.overflow = "";
    lbImg.removeAttribute("src");
    if (lbOpener) lbOpener.focus();
  }
  $("lbClose").addEventListener("click", closePhoto);
  $("lbPrev").addEventListener("click", function () { showPhoto(lbIdx - 1); });
  $("lbNext").addEventListener("click", function () { showPhoto(lbIdx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-fig")) closePhoto(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closePhoto();
    else if (e.key === "ArrowLeft" && PHOTOS.length > 1) showPhoto(lbIdx - 1);
    else if (e.key === "ArrowRight" && PHOTOS.length > 1) showPhoto(lbIdx + 1);
    else if (e.key === "Tab") {   // garde le focus dans la visionneuse
      var f = [].filter.call(lb.querySelectorAll("button"), function (b) { return !b.hidden; });
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  lb.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (startX === null || PHOTOS.length < 2) return;
    var dx = e.changedTouches[0].clientX - startX; startX = null;
    if (Math.abs(dx) > 50) showPhoto(lbIdx + (dx < 0 ? 1 : -1));
  });

  // Vidéos
  var vg = $("videos-grid");
  if (VIDEOS.length) {
    VIDEOS.forEach(function (v) {
      var d = document.createElement("div"); d.className = "vslot";
      var el = document.createElement("video");
      el.src = v.src; if (v.poster) el.poster = v.poster;
      el.controls = true; el.playsInline = true; el.preload = "metadata";
      if (v.titre) el.setAttribute("aria-label", v.titre);
      d.appendChild(el); vg.appendChild(d);
    });
  } else {
    for (var i = 0; i < EMPLACEMENTS_VIDEO; i++) {
      var s = document.createElement("div"); s.className = "vslot empty"; s.textContent = "Vidéo à venir"; vg.appendChild(s);
    }
  }

  // Grille des coloris
  var grid = $("grid");
  COLORIS.forEach(function (c) {
    var card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<img loading="lazy" src="' + c.img + '" alt="T-shirt SENEGAL Njaay ' + c.nom.toLowerCase() + '">' +
      '<div class="card-row"><span class="card-name"><span class="dot" style="background:' + c.hex + '"></span>' + c.nom + '</span>' +
      '<a class="btn ghost small" href="#commander" data-id="' + c.id + '">Choisir</a></div>';
    grid.appendChild(card);
  });
  grid.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-id]");
    if (a) select(a.getAttribute("data-id"));
  });

  // Choix de coloris dans le formulaire
  var box = $("colorChoices");
  COLORIS.forEach(function (c) {
    var inp = document.createElement("input");
    inp.type = "radio"; inp.name = "color"; inp.id = "c-" + c.id; inp.value = c.id;
    var lab = document.createElement("label");
    lab.htmlFor = inp.id;
    lab.innerHTML = '<span class="dot" style="background:' + c.hex + '"></span>' + c.nom;
    box.appendChild(inp); box.appendChild(lab);
  });
  box.addEventListener("change", function (e) { select(e.target.value, true); });

  function select(id, fromForm) {
    current = id;
    var c = find(id);
    if (!fromForm) $("c-" + id).checked = true;
    $("previewImg").src = c.img;
    $("previewImg").alt = "T-shirt SENEGAL Njaay " + c.nom.toLowerCase();
    $("previewDot").style.background = c.hex;
    $("previewName").textContent = c.nom;
    update();
  }

  // Panier : une ligne par coloris + taille
  var cart = [];   // { id, size, qty }

  function qtyValue() { return Math.max(1, Math.min(50, parseInt($("qty").value, 10) || 1)); }

  function renderCart() {
    var ul = $("cart");
    ul.innerHTML = "";
    $("cartEmpty").hidden = cart.length > 0;
    cart.forEach(function (it, i) {
      var c = find(it.id), li = document.createElement("li");
      li.innerHTML = '<img src="' + c.img + '" alt=""><span class="what">' + it.qty + ' × ' + c.nom + '<small>Taille ' + it.size + '</small></span>' +
        '<button type="button" data-i="' + i + '" aria-label="Retirer ' + c.nom + ', taille ' + it.size + '">Retirer</button>';
      ul.appendChild(li);
    });
  }

  $("add").addEventListener("click", function () {
    var size = $("size").value, qty = qtyValue(), hit = null, b = this;
    cart.forEach(function (it) { if (it.id === current && it.size === size) hit = it; });
    if (hit) hit.qty = Math.min(50, hit.qty + qty); else cart.push({ id: current, size: size, qty: qty });
    renderCart(); update();
    b.textContent = "Ajouté";
    setTimeout(function () { b.textContent = "Ajouter à ma commande"; }, 1400);
  });
  $("cart").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-i]");
    if (b) { cart.splice(parseInt(b.getAttribute("data-i"), 10), 1); renderCart(); update(); }
  });

  function message() {
    if (!cart.length) return "";
    var total = 0, lines = ["Bonjour SenegalNdiaye,", "je voudrais commander des t-shirts SENEGAL Njaay :"];
    cart.forEach(function (it) { total += it.qty; lines.push("- " + it.qty + " × " + find(it.id).nom.toLowerCase() + ", taille " + it.size); });
    lines.push("Total : " + total + " t-shirt" + (total > 1 ? "s" : ""));
    var name = $("name").value.trim(), city = $("city").value.trim();
    if (name) lines.push("Mon prénom : " + name);
    if (city) lines.push("Ville : " + city);
    lines.push("Merci !");
    return lines.join("\n");
  }

  function update() {
    var m = message(), wa = $("wa"), has = cart.length > 0;
    $("msg").textContent = has ? m : "Ton message apparaîtra ici dès que tu auras ajouté un t-shirt à ta commande.";
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
  $("c-" + current).checked = true;
  select(current);

  // Mouvement réduit : la vidéo d'en-tête ne démarre pas toute seule
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var v = $("heroVideo"); v.pause(); v.removeAttribute("autoplay"); v.controls = true;
    }
  } catch (e) { }
})();
