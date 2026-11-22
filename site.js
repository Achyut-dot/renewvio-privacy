// Highlights the section being read in the side navigation.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (!links.length || !("IntersectionObserver" in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var current = null;
  function set(id) {
    if (id === current || !byId[id]) return;
    if (current && byId[current]) byId[current].classList.remove("active");
    byId[id].classList.add("active");
    current = id;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) set(e.target.id); });
  }, { rootMargin: "-20% 0px -70% 0px" });
  Object.keys(byId).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) io.observe(el);
  });
  set(Object.keys(byId)[0]);
})();
