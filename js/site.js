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
  if (!dialog || !dialog.showModal) return;
  var img = dialog.querySelector("img");
  var caption = dialog.querySelector("p");
  document.querySelectorAll(".shot").forEach(function (button) {
    button.addEventListener("click", function () {
      var source = button.querySelector("img");
      var full = button.getAttribute("data-full");
      img.alt = source.alt;
      caption.textContent = source.alt;
      img.onload = function () {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
      };
      img.src = full || source.currentSrc || source.src;
      dialog.showModal();
    });
  });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
})();
