(function () {
  function getQueryToken() {
    const p = new URLSearchParams(window.location.search);
    return p.get("token") || p.get("t");
  }

  window.getToken = () => getQueryToken();

  window.withToken = (url) => {
    const t = getQueryToken();
    if (!t) return url;
    return url + (url.includes("?") ? "&" : "?") + "token=" + encodeURIComponent(t);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const token = getQueryToken();
    if (!token) {
      window.location.replace("index.html");
    }
  });
})();
