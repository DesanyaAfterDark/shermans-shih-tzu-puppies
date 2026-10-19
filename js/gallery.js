(function () {
  var root = document.querySelector("[data-gallery]");
  if (!root || typeof Swiper === "undefined") return;

  var filters = root.querySelector(".gallery-filters");
  var countEl = root.querySelector(".gal-count");
  var live = root.querySelector(".gallery-live");
  var status = root.querySelector(".gallery-status");
  var pauseBtn = root.querySelector(".gal-pause");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var photos = [];
  var view = [];
  var main;
  var thumbs;
  var playing = !reduceMotion;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function label(category) {
    if (!category) return "Other";
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  function renderMain(photo) {
    return (
      '<div class="swiper-slide">' +
      '<img src="' + esc(photo.src) + '" alt="' + esc(photo.alt) + '" width="' + Number(photo.w) + '" height="' + Number(photo.h) + '" decoding="async">' +
      "</div>"
    );
  }

  function renderThumb(photo) {
    return (
      '<div class="swiper-slide">' +
      '<button class="thumb-btn" type="button" aria-label="Show photo: ' + esc(photo.alt) + '">' +
      '<img src="' + esc(photo.thumb) + '" alt="" width="' + Number(photo.w) + '" height="' + Number(photo.h) + '" loading="lazy" decoding="async">' +
      "</button></div>"
    );
  }

  function updateMeta() {
    var total = view.length;
    var index = main && total ? main.activeIndex + 1 : 0;
    if (index < 1) index = total ? 1 : 0;
    if (countEl) countEl.textContent = total ? index + " / " + total : "0 / 0";
    var photo = view[index - 1];
    if (live) live.textContent = photo ? index + " / " + total + ". " + photo.alt : "";
  }

  function setPlaying(next) {
    playing = next && !!(main && main.autoplay);
    if (!main || !main.autoplay) playing = false;
    if (playing) {
      main.autoplay.start();
      pauseBtn.textContent = "Pause";
      pauseBtn.setAttribute("aria-label", "Pause slideshow");
      pauseBtn.setAttribute("aria-pressed", "true");
    } else if (main && main.autoplay) {
      main.autoplay.stop();
      pauseBtn.textContent = "Play";
      pauseBtn.setAttribute("aria-label", "Play slideshow");
      pauseBtn.setAttribute("aria-pressed", "false");
    }
  }

  function replaceSlides(swiper, slides) {
    swiper.virtual.removeAllSlides();
    if (slides.length) swiper.virtual.appendSlide(slides);
    swiper.slideTo(0, 0);
  }

  function show(list) {
    view = list.slice();
    replaceSlides(main, view);
    replaceSlides(thumbs, view);
    updateMeta();
    if (status) {
      status.hidden = view.length > 0;
      status.textContent = view.length ? "" : "No photographs in this category.";
    }
  }

  function buildFilters() {
    var seen = {};
    photos.forEach(function (photo) {
      if (photo.category) seen[photo.category] = true;
    });
    var names = Object.keys(seen).sort(function (a, b) {
      return a.localeCompare(b, "en", { sensitivity: "base" });
    });
    if (names.length < 2) {
      filters.hidden = true;
      filters.innerHTML = "";
      return;
    }
    filters.hidden = false;
    var html = '<button class="gallery-chip" type="button" aria-pressed="true" data-category="">All</button>';
    names.forEach(function (name) {
      html += '<button class="gallery-chip" type="button" aria-pressed="false" data-category="' + esc(name) + '">' + esc(label(name)) + "</button>";
    });
    filters.innerHTML = html;
    filters.addEventListener("click", function (event) {
      var chip = event.target.closest(".gallery-chip");
      if (!chip) return;
      var category = chip.getAttribute("data-category");
      filters.querySelectorAll(".gallery-chip").forEach(function (button) {
        button.setAttribute("aria-pressed", button === chip ? "true" : "false");
      });
      show(category ? photos.filter(function (photo) { return photo.category === category; }) : photos);
    });
  }

  function start(list) {
    photos = list.filter(function (photo) {
      return photo && photo.src && photo.alt;
    });
    view = photos.slice();
    buildFilters();

    thumbs = new Swiper(root.querySelector(".gallery-thumbs"), {
      slidesPerView: 4.4,
      spaceBetween: 8,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
      centerInsufficientSlides: true,
      mousewheel: false,
      a11y: {
        enabled: true,
        slideRole: "group"
      },
      breakpoints: {
        720: { slidesPerView: 8, spaceBetween: 10 },
        1100: { slidesPerView: 10, spaceBetween: 10 }
      },
      virtual: {
        enabled: true,
        slides: view,
        renderSlide: renderThumb,
        addSlidesBefore: 4,
        addSlidesAfter: 4
      }
    });

    main = new Swiper(root.querySelector(".gallery-main"), {
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: reduceMotion ? 0 : 700,
      rewind: true,
      keyboard: { enabled: true, onlyInViewport: true },
      mousewheel: false,
      navigation: {
        nextEl: root.querySelector(".gal-next"),
        prevEl: root.querySelector(".gal-prev")
      },
      thumbs: { swiper: thumbs },
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous photo",
        nextSlideMessage: "Next photo",
        slideLabelMessage: "{{index}} / {{slidesLength}}"
      },
      virtual: {
        enabled: true,
        slides: view,
        renderSlide: renderMain,
        addSlidesBefore: 1,
        addSlidesAfter: 1
      },
      on: {
        slideChange: function () {
          updateMeta();
        }
      }
    });

    if (reduceMotion) main.autoplay.stop();

    pauseBtn.addEventListener("click", function () {
      setPlaying(!main.autoplay.running);
    });

    setPlaying(!reduceMotion);
    updateMeta();
  }

  fetch("gallery/photos.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Could not load photographs.");
      return response.json();
    })
    .then(start)
    .catch(function () {
      if (status) {
        status.hidden = false;
        status.textContent = "Photographs could not be loaded.";
      }
    });
})();
