/* MultiSoft SIG - Premium UI helpers
   - Sticky/collapsible filter bar
   - Premium breadcrumb injection
   - Dynamic sticky offsets for table headers
*/
(function () {
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function findFilterPanel() {
    // Try common admin patterns: Bootstrap panels / cards
    var candidates = qsa('.panel, .card, .box, .module');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var heading = qs('.panel-heading, .card-header, .box-header, .module h2, .module caption', el);
      if (!heading) continue;
      var txt = (heading.textContent || '').trim().toLowerCase();
      if (txt.indexOf('filtros') !== -1 || txt.indexOf('filtro') !== -1) return el;
    }
    // Fallback: fieldset legend "Filtros"
    var legends = qsa('legend, h2, h3');
    for (var j = 0; j < legends.length; j++) {
      var t = (legends[j].textContent || '').trim().toLowerCase();
      if (t === 'filtros' || t.indexOf('filtros') !== -1) return legends[j].closest('.panel, .card, .box, fieldset, form') || legends[j].parentElement;
    }
    return null;
  }

  function setupFilterCollapse() {
    var panel = findFilterPanel();
    if (!panel) return;

    panel.classList.add('ms-filter-panel');

    var heading = qs('.panel-heading, .card-header, .box-header', panel);
    var body = qs('.panel-body, .card-body, .box-body', panel);

    // If no obvious body, try direct form container
    if (!body) {
      var form = qs('form', panel);
      body = form || panel;
    }

    if (heading) heading.classList.add('ms-filter-heading');
    if (body) body.classList.add('ms-filter-body');

    // Toggle button
    if (heading && !qs('.ms-filter-toggle', heading)) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ms-filter-toggle';
      btn.setAttribute('aria-label', 'Colapsar/Expandir filtros');
      btn.innerHTML = '<span class="ms-chev">▾</span>';
      btn.addEventListener('click', function () {
        document.body.classList.toggle('ms-filter-collapsed');
        updateStickyOffsets();
      });
      heading.appendChild(btn);
    }

    // Auto-collapse when scrolling down past the filter area
    var last = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var down = y > last;
      last = y;

      // If user is below filter panel, collapse; if close to top, expand
      var rect = panel.getBoundingClientRect();
      var below = rect.top < 0;

      if (down && below) {
        document.body.classList.add('ms-filter-collapsed');
        document.body.classList.add('ms-filter-is-stuck');
      } else if (y < 40) {
        document.body.classList.remove('ms-filter-collapsed');
        document.body.classList.remove('ms-filter-is-stuck');
      } else {
        // keep stuck shadow when heading is sticky
        if (below) document.body.classList.add('ms-filter-is-stuck');
        else document.body.classList.remove('ms-filter-is-stuck');
      }
      updateStickyOffsets();
    }, { passive: true });
  }

  function setupBreadcrumb() {
    // Try to detect a page title from common places
    var h1 = qs('#content h1') || qs('.content h1') || qs('.page-header h1') || qs('.page-header h2') || qs('h1');
    var pageTitle = h1 ? (h1.textContent || '').trim() : '';
    if (!pageTitle) {
      // fallback: document title without suffix
      pageTitle = (document.title || '').split('|')[0].trim();
    }
    if (!pageTitle) return;

    // Infer section from sidebar active item if available
    var section = '';
    var active = qs('.sidebar .active a') || qs('#nav-sidebar .current a') || qs('.nav .active a');
    if (active) section = (active.textContent || '').trim();
    if (!section) {
      var path = (window.location.pathname || '').toLowerCase();
      if (path.indexOf('finanzas') !== -1) section = 'Finanzas';
      else if (path.indexOf('ventas') !== -1) section = 'Ventas';
      else if (path.indexOf('admin') !== -1) section = 'Administración';
      else section = 'Inicio';
    }

    // Find or create breadcrumb container
    var bc = qs('.ms-breadcrumb');
    if (!bc) {
      bc = document.createElement('div');
      bc.className = 'ms-breadcrumb';

      var wrapper = qs('#page-wrapper') || qs('.container-fluid') || qs('#content') || document.body;
      // insert near top of wrapper
      if (wrapper.firstChild) wrapper.insertBefore(bc, wrapper.firstChild);
      else wrapper.appendChild(bc);
    }

    bc.innerHTML =
      '<span class="ms-breadcrumb__item">' + escapeHtml(section) + '</span>' +
      '<span class="ms-breadcrumb__sep">/</span>' +
      '<span class="ms-breadcrumb__item ms-breadcrumb__item--current">' + escapeHtml(pageTitle) + '</span>';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getTopbarHeight() {
    var nav = qs('.navbar, header.ms-topbar, #header');
    if (!nav) return 0;
    var r = nav.getBoundingClientRect();
    return Math.max(0, Math.round(r.height || 0));
  }

  function getFilterHeadingHeight() {
    var heading = qs('.ms-filter-heading');
    if (!heading) return 0;
    // Only count it when sticky is active or collapsed
    if (!document.body.classList.contains('ms-filter-collapsed') && !document.body.classList.contains('ms-filter-is-stuck')) return 0;
    var r = heading.getBoundingClientRect();
    return Math.max(0, Math.round(r.height || 0));
  }

  function updateStickyOffsets() {
    var top = getTopbarHeight() + getFilterHeadingHeight() + 8; // small gap
    document.documentElement.style.setProperty('--ms-sticky-top', top + 'px');
  }

  function setupTableStickyHeaders() {
    updateStickyOffsets();
    window.addEventListener('resize', updateStickyOffsets);

    // Apply a helper class to tables so CSS can make thead sticky
    qsa('table').forEach(function (t) {
      if (!t.classList.contains('ms-table')) t.classList.add('ms-table');
    });
  }

  function init() {
    setupFilterCollapse();
    setupBreadcrumb();
    setupTableStickyHeaders();
    updateStickyOffsets();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
