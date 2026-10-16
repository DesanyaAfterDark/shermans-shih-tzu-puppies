/* Puppy announcement. This is the only place to change it.
   Set enabled to false when there are no puppies.
   Change text to reword the bar. It links to the Book a visit page. */
var SHERMAN_ANNOUNCE = {
  enabled: true,
  text: "New puppies available now for purchase!"
};

(function () {
  "use strict";
  var setting = window.SHERMAN_ANNOUNCE || {};
  if (!setting.enabled || !setting.text) return;

  function siteRoot() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src") || "";
      var at = src.indexOf("js/announce.js");
      if (at !== -1) return src.slice(0, at);
    }
    return "";
  }

  function sprig(flip) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", flip ? "sprig flip" : "sprig");
    svg.setAttribute("width", "34");
    svg.setAttribute("height", "16");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#sprig");
    svg.appendChild(use);
    return svg;
  }

  function mount() {
    var bar = document.createElement("a");
    bar.className = "announce";
    bar.href = siteRoot() + "book.html";
    var label = document.createElement("span");
    label.textContent = setting.text;
    bar.appendChild(sprig(true));
    bar.appendChild(label);
    bar.appendChild(sprig(false));
    var header = document.querySelector(".site-header");
    if (header) header.insertBefore(bar, header.firstChild);
    else {
      var banner = document.querySelector(".banner");
      var parent = banner ? banner.parentNode : document.body;
      parent.insertBefore(bar, banner || parent.firstChild);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
