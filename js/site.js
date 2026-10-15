(function () {
  var dialog = document.querySelector("#viewer");
  if (!dialog || !dialog.showModal) return;
  var img = dialog.querySelector("img");
  var caption = dialog.querySelector("p");
  document.querySelectorAll(".shot").forEach(function (button) {
    button.addEventListener("click", function () {
      var source = button.querySelector("img");
      img.src = source.src;
      img.alt = source.alt;
      img.width = source.naturalWidth || source.width;
      img.height = source.naturalHeight || source.height;
      caption.textContent = source.alt;
      dialog.showModal();
    });
  });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
})();
