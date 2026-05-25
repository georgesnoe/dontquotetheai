// Builds the language <select> from assets/translations.json so the option
// list lives in one place. To add a language: append an entry to that JSON
// file and ship your HTML — no need to touch the <select> in every file.
//
// SEO note: <link rel="alternate" hreflang> tags stay static in each HTML
// <head> on purpose. Googlebot renders JS, but Bing / Yandex / Baidu are
// less reliable about it, and we have RU + ZH translations where that
// matters. Keep hreflang in the markup; only the user-facing dropdown is
// dynamic.
//
// HTML contract:
//   <select data-lang-select></select>   — gets populated with <option>s
(function () {
  // Cloudflare serves *.html at clean URLs (e.g. /it -> it.html), so the
  // pathname's last segment may be missing the extension. Normalize so the
  // value matches the "file" entries in translations.json.
  const last = location.pathname.split("/").pop() || "";
  const here = !last
    ? "index.html"
    : last.endsWith(".html")
      ? last
      : `${last}.html`;
  const isAngry = location.pathname.includes("/angry/");
  const dataUrl = (isAngry ? "../" : "") + "assets/translations.json";

  // Variant toggle: links marked with [data-variant-toggle] flip between the
  // polite (/) and angry (/angry/) version of the *current* page, so each
  // translated file doesn't have to hardcode its counterpart href.
  const file = here === "index.html" ? "" : here;
  const toggleHref = isAngry ? `../${file}` : `angry/${file}`;
  document.querySelectorAll("[data-variant-toggle]").forEach((a) => {
    a.href = toggleHref;
  });

  fetch(dataUrl)
    .then((r) => r.json())
    .then(({ languages }) => {
      const select = document.querySelector("[data-lang-select]");
      if (!select) return;
      select.replaceChildren();

      languages.forEach(({ file, label }) => {
        const opt = document.createElement("option");
        opt.value = file;
        opt.textContent = label;
        select.appendChild(opt);
      });
      select.value = here;

      select.addEventListener("change", (e) => {
        const v = e.target.value;
        if (v && v !== here) location.href = v;
      });
    })
    .catch((err) => console.error("translations: failed to load", err));
})();
