// The invitation page. The code arrives after the "#" of the address, which
// a browser never sends to the server, and is only ever written to the page
// as text.
(function () {
  var PLAY = "https://play.google.com/store/apps/details?id=com.renewvio";

  function fromAddress() {
    var raw = (location.hash || "").slice(1);
    if (!raw) {
      try { raw = new URLSearchParams(location.search).get("code") || ""; } catch (e) { raw = ""; }
    }
    try { raw = decodeURIComponent(raw); } catch (e) { /* read it as it came */ }
    var hex = raw.replace(/[^0-9a-fA-F]/g, "");
    if (hex.length !== 32) return null;
    return hex.toUpperCase().match(/.{4}/g).join("-");
  }

  function show() {
    var code = fromAddress();
    var withCode = document.getElementById("with-code");
    var noCode = document.getElementById("no-code");
    withCode.hidden = !code;
    noCode.hidden = !!code;
    if (!code) return;

    document.getElementById("code").textContent = code;

    var open = document.getElementById("open");
    var android = /Android/i.test(navigator.userAgent || "");
    if (android) {
      // Opens the app when it is installed; otherwise the browser goes to
      // Google Play.
      open.href = "intent://join/" + code +
        "#Intent;scheme=renewvio;package=com.renewvio;" +
        "S.browser_fallback_url=" + encodeURIComponent(PLAY) + ";end";
    } else {
      open.hidden = true;
      document.getElementById("not-android").hidden = false;
    }

    var copy = document.getElementById("copy");
    copy.addEventListener("click", function () {
      function done() {
        copy.textContent = "Copied";
        setTimeout(function () { copy.textContent = "Copy code"; }, 2500);
      }
      function fallback() {
        var range = document.createRange();
        range.selectNodeContents(document.getElementById("code"));
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try { if (document.execCommand("copy")) done(); } catch (e) { /* left selected to copy by hand */ }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, fallback);
      } else {
        fallback();
      }
    });
  }

  show();
  // The same page opened with another invitation.
  window.addEventListener("hashchange", function () { location.reload(); });
})();
