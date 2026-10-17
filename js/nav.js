(function () {
  "use strict";
  var openBtn = document.querySelector(".menu-open");
  var dialog = document.querySelector(".nav-dialog");
  if (!openBtn || !dialog || !dialog.showModal) return;
  var closeBtn = dialog.querySelector(".menu-close");

  function focusable() {
    return Array.prototype.filter.call(dialog.querySelectorAll("a, button"), function (node) {
      return !node.disabled;
    });
  }

  openBtn.addEventListener("click", function () {
    dialog.showModal();
    openBtn.setAttribute("aria-expanded", "true");
    if (closeBtn) closeBtn.focus();
  });

  dialog.addEventListener("close", function () {
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.focus();
  });

  if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
    if (event.target.closest && event.target.closest("a")) dialog.close();
  });

  dialog.addEventListener("keydown", function (event) {
    if (event.key !== "Tab") return;
    var items = focusable();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
