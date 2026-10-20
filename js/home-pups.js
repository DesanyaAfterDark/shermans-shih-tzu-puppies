(function () {
  var root = document.querySelector("[data-pup-slider]");
  if (!root) return;
  var track = root.querySelector(".pup-track");
  var viewport = root.querySelector(".pup-viewport");
  var slides = Array.prototype.slice.call(root.querySelectorAll(".pup-slide"));
  var prev = root.querySelector(".pup-prev");
  var next = root.querySelector(".pup-next");
  var count = root.querySelector(".pup-count");
  var live = root.querySelector(".pup-live");
  var dots = root.querySelector(".pup-dots");
  var index = 0;
  var total = slides.length;
  if (!track || !viewport || !total) return;

  slides.forEach(function (_, i) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "pup-dot";
    button.setAttribute("aria-label", "Show puppy " + (i + 1) + " of " + total);
    button.addEventListener("click", function () { go(i); });
    dots.appendChild(button);
  });

  function go(nextIndex) {
    index = (nextIndex + total) % total;
    track.style.transform = "translateX(" + (-index * 100) + "%)";
    slides.forEach(function (slide, i) {
      var current = i === index;
      slide.setAttribute("aria-hidden", current ? "false" : "true");
      slide.inert = !current;
    });
    if (count) count.textContent = (index + 1) + " / " + total;
    var caption = slides[index].querySelector("figcaption");
    if (live) live.textContent = (index + 1) + " of " + total + ". " + (caption ? caption.textContent : "");
    if (dots) {
      Array.prototype.forEach.call(dots.children, function (button, i) {
        if (i === index) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      });
    }
  }

  if (prev) prev.addEventListener("click", function () { go(index - 1); });
  if (next) next.addEventListener("click", function () { go(index + 1); });

  viewport.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  });

  var startX = 0;
  var startY = 0;
  var deltaX = 0;
  var tracking = false;
  var pointerId = null;

  viewport.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    tracking = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    deltaX = 0;
  });

  viewport.addEventListener("pointermove", function (event) {
    if (!tracking || event.pointerId !== pointerId) return;
    deltaX = event.clientX - startX;
  });

  function finish(event) {
    if (!tracking || event.pointerId !== pointerId) return;
    tracking = false;
    var deltaY = event.clientY - startY;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      go(deltaX < 0 ? index + 1 : index - 1);
    }
  }

  viewport.addEventListener("pointerup", finish);
  viewport.addEventListener("pointercancel", function () { tracking = false; });

  go(0);
})();
