(function () {
  var thanks = document.getElementById("review-thanks");
  if (thanks && /(?:\?|&)review=thanks(?:&|$)/.test(location.search)) {
    thanks.hidden = false;
    if (thanks.focus) thanks.focus();
  }

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
  var lastX = 0;
  var lastY = 0;

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

  var tracking = false;
  var pointerId = null;

  function onButton(target) {
    return target && target.closest && target.closest("button");
  }

  function arm(x, y) {
    tracking = true;
    startX = lastX = x;
    startY = lastY = y;
  }

  function note(x, y) {
    if (!tracking) return;
    lastX = x;
    lastY = y;
  }

  function finish() {
    if (!tracking) return;
    tracking = false;
    pointerId = null;
    var dx = lastX - startX;
    var dy = lastY - startY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    show(dx < 0 ? index + 1 : index - 1);
  }

  dialog.addEventListener("touchstart", function (event) {
    if (event.touches.length !== 1 || onButton(event.target)) return;
    var touch = event.touches[0];
    arm(touch.clientX, touch.clientY);
  }, { passive: true });

  dialog.addEventListener("touchmove", function (event) {
    if (!tracking || event.touches.length !== 1) return;
    note(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });

  dialog.addEventListener("touchend", function (event) {
    if (event.changedTouches && event.changedTouches.length) {
      note(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    }
    finish();
  }, { passive: true });

  dialog.addEventListener("touchcancel", function (event) {
    if (event.changedTouches && event.changedTouches.length) {
      note(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    }
    finish();
  }, { passive: true });

  dialog.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "touch" || onButton(event.target)) return;
    pointerId = event.pointerId;
    arm(event.clientX, event.clientY);
    if (dialog.setPointerCapture) dialog.setPointerCapture(event.pointerId);
  });

  dialog.addEventListener("pointermove", function (event) {
    if (!tracking || event.pointerId !== pointerId) return;
    note(event.clientX, event.clientY);
  });

  dialog.addEventListener("pointerup", function (event) {
    if (event.pointerType === "touch" || event.pointerId !== pointerId) return;
    note(event.clientX, event.clientY);
    finish();
  });

  dialog.addEventListener("pointercancel", function (event) {
    if (event.pointerType === "touch" || event.pointerId !== pointerId) return;
    finish();
  });
})();
