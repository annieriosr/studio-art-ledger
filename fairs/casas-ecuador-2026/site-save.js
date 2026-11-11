/* Shared studio site save — booth, outreach, bills, catalogue drafts */
(function (global) {
  var TOKEN_KEYS = ["studioLedgerWriteToken-v1", "cosasSaleInvoice-token-v1"];
  var API = "/api/site-state";

  function getToken() {
    for (var i = 0; i < TOKEN_KEYS.length; i++) {
      try {
        var v = localStorage.getItem(TOKEN_KEYS[i]);
        if (v) return v;
      } catch (e) {}
    }
    return "";
  }

  function setToken(v) {
    try {
      localStorage.setItem(TOKEN_KEYS[0], v || "");
      localStorage.setItem(TOKEN_KEYS[1], v || "");
    } catch (e) {}
  }

  function headers() {
    var h = { "Content-Type": "application/json" };
    var t = getToken();
    if (t) h["X-Ledger-Token"] = t;
    return h;
  }

  function load(key) {
    return fetch(API + "?key=" + encodeURIComponent(key) + "&t=" + Date.now(), {
      cache: "no-store",
      headers: headers(),
    }).then(function (r) {
      return r.json().then(function (j) {
        return { ok: r.ok && j.ok, status: r.status, j: j };
      });
    });
  }

  function save(key, data) {
    return fetch(API, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ key: key, data: data }),
    }).then(function (r) {
      return r.json().then(function (j) {
        return { ok: r.ok && j.ok, status: r.status, j: j };
      });
    });
  }

  var timers = {};
  function saveDebounced(key, data, ms) {
    clearTimeout(timers[key]);
    return new Promise(function (resolve) {
      timers[key] = setTimeout(function () {
        save(key, data).then(resolve).catch(function (e) {
          resolve({ ok: false, error: e.message || String(e) });
        });
      }, ms == null ? 2500 : ms);
    });
  }

  global.StudioSiteSave = {
    getToken: getToken,
    setToken: setToken,
    load: load,
    save: save,
    saveDebounced: saveDebounced,
    API: API,
  };
})(window);
