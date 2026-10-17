(function () {
  document.querySelectorAll(".video-play").forEach(function (button) {
    button.addEventListener("click", function () {
      var src = button.getAttribute("data-src");
      if (!src) return;
      var iframe = document.createElement("iframe");
      iframe.src = src + (src.indexOf("?") === -1 ? "?" : "&") + "autoplay=1";
      iframe.title = button.getAttribute("data-title") || "Sherman's Shih Tzu Puppies video";
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.setAttribute("allowfullscreen", "");
      button.replaceWith(iframe);
    });
  });

  var dialog = document.querySelector("#viewer");
  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  if (!dialog || !dialog.showModal || !shots.length) return;
  var img = dialog.querySelector("img");
  var caption = dialog.querySelector("#viewer-caption") || dialog.querySelector("p");
  var count = dialog.querySelector(".viewer-count");
  var index = 0;
  var opener = null;
  var startX = 0;
  var startY = 0;

  function show(next) {
    index = (next + shots.length) % shots.length;
    var button = shots[index];
    var source = button.querySelector("img");
    var full = button.getAttribute("data-full");
    img.alt = source ? source.alt : "";
    caption.textContent = source ? source.alt : "";
    if (count) count.textContent = (index + 1) + " of " + shots.length;
    img.src = full || (source && (source.currentSrc || source.src)) || "";
  }

  shots.forEach(function (button, i) {
    button.addEventListener("click", function () {
      opener = button;
      show(i);
      dialog.showModal();
    });
  });

  dialog.addEventListener("close", function () {
    if (opener && opener.focus) opener.focus();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  var prev = dialog.querySelector(".viewer-prev");
  var next = dialog.querySelector(".viewer-next");
  if (prev) prev.addEventListener("click", function () { show(index - 1); });
  if (next) next.addEventListener("click", function () { show(index + 1); });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") { event.preventDefault(); show(index - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); show(index + 1); }
  });

  dialog.addEventListener("pointerdown", function (event) {
    if (event.target.closest && event.target.closest("button")) return;
    startX = event.clientX;
    startY = event.clientY;
  });
  dialog.addEventListener("pointerup", function (event) {
    if (event.target.closest && event.target.closest("button")) return;
    var dx = event.clientX - startX;
    var dy = event.clientY - startY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    show(dx < 0 ? index + 1 : index - 1);
  });
})();
