/* ============================================================
   POSTIZ MOBILE — Bottom navigation bar + header overflow menu
   Injected via nginx sub_filter into every HTML page
   ============================================================ */

(function () {
  'use strict';

  // Only activate on mobile viewports
  if (window.innerWidth > 768) return;

  /* ----------------------------------------------------------
     Nav item definitions — mirror the sidebar TopMenu order
     Paths match Next.js routes inside /[org]/
     ---------------------------------------------------------- */
  var NAV_ITEMS = [
    {
      label: 'Calendar',
      path: '/launches',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
    },
    {
      label: 'Media',
      path: '/media',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
    },
    {
      label: 'Channels',
      path: '/plugs',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    }
  ];

  /* ----------------------------------------------------------
     Resolve org prefix from current URL
     Postiz routes: /<orgId>/launches, /<orgId>/analytics, etc.
     We sniff the first path segment to build correct hrefs.
     ---------------------------------------------------------- */
  function getOrgPrefix() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    // If first segment looks like an org id (not a known top-level page), use it
    var topLevel = ['login', 'register', 'auth', 'custom', 'api', 'uploads', 'launches', 'analytics', 'media', 'plugs', 'third-party', 'settings', 'agents'];
    if (parts.length > 0 && topLevel.indexOf(parts[0]) === -1) {
      return '/' + parts[0];
    }
    return '';
  }

  /* ----------------------------------------------------------
     Determine which nav item is active based on pathname
     ---------------------------------------------------------- */
  function getActivePath() {
    var pathname = window.location.pathname;
    var prefix = getOrgPrefix();
    // Strip org prefix to get the section
    var section = prefix ? pathname.replace(prefix, '') : pathname;
    return section || '/';
  }

  function isActive(item) {
    var section = getActivePath();
    // Exact or prefix match (e.g. /launches/123 → Calendar active)
    return section === item.path || section.indexOf(item.path + '/') === 0;
  }

  /* ----------------------------------------------------------
     Build + inject the bottom nav bar
     ---------------------------------------------------------- */
  function buildNav() {
    var existing = document.getElementById('mobile-bottom-nav');
    if (existing) existing.remove();

    var prefix = getOrgPrefix();
    var nav = document.createElement('nav');
    nav.id = 'mobile-bottom-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Mobile navigation');

    NAV_ITEMS.forEach(function (item) {
      var href = prefix + item.path;
      var a = document.createElement('a');
      a.href = href;
      a.innerHTML = item.icon + '<span>' + item.label + '</span>';
      if (isActive(item)) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }

      // Intercept click for Next.js client-side navigation if router available
      a.addEventListener('click', function (e) {
        // Let the browser handle navigation normally;
        // active state update is handled by MutationObserver / popstate
      });

      nav.appendChild(a);
    });

    document.body.appendChild(nav);
  }

  /* ----------------------------------------------------------
     Update active state without re-building the entire nav
     ---------------------------------------------------------- */
  function updateActive() {
    var anchors = document.querySelectorAll('#mobile-bottom-nav a');
    var prefix = getOrgPrefix();
    anchors.forEach(function (a, i) {
      var item = NAV_ITEMS[i];
      if (!item) return;
      var active = isActive(item);
      if (active) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
        // Keep href in sync with current org prefix
        a.href = prefix + item.path;
      } else {
        a.classList.remove('active');
        a.removeAttribute('aria-current');
        a.href = prefix + item.path;
      }
    });
  }

  /* ----------------------------------------------------------
     Watch for Next.js client-side route changes
     Strategy 1: popstate (back/forward)
     Strategy 2: MutationObserver on <title> or body class
     Strategy 3: Poll pathname as a last resort (cheap, 500ms)
     ---------------------------------------------------------- */
  var lastPath = window.location.pathname;

  window.addEventListener('popstate', function () {
    updateActive();
    lastPath = window.location.pathname;
  });

  // Next.js pushes route changes; intercept history.pushState
  (function () {
    var origPush = history.pushState.bind(history);
    var origReplace = history.replaceState.bind(history);

    history.pushState = function () {
      origPush.apply(history, arguments);
      setTimeout(function () { updateActive(); buildFab(); }, 50);
    };

    history.replaceState = function () {
      origReplace.apply(history, arguments);
      setTimeout(function () { updateActive(); buildFab(); }, 50);
    };
  })();

  // Fallback poll (catches any navigation method we missed)
  setInterval(function () {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      updateActive();
    }
  }, 500);

  /* ----------------------------------------------------------
     Init — wait for DOM ready
     ---------------------------------------------------------- */
  /* ----------------------------------------------------------
     Calendar week-view: abbreviate full day names to 3 letters
     so they don't wrap in narrow columns (Mon, Tue, Wed …)
     ---------------------------------------------------------- */
  var DAY_MAP = {
    'Monday': 'Mon', 'Tuesday': 'Tue', 'Wednesday': 'Wed',
    'Thursday': 'Thu', 'Friday': 'Fri', 'Saturday': 'Sat', 'Sunday': 'Sun'
  };

  function abbreviateDayNames() {
    // Calendar week-view day header cells: .text-[14px].font-[500].text-newTableText
    var dayEls = document.querySelectorAll('.text-\\[14px\\].font-\\[500\\].text-newTableText');
    dayEls.forEach(function (el) {
      var t = el.textContent.trim();
      if (DAY_MAP[t]) el.textContent = DAY_MAP[t];
    });

    // Calendar date sub-cells: strip year from "05/04/2026" → "05/04"
    var dateEls = document.querySelectorAll('.bg-newTableHeader .text-\\[14px\\].font-\\[600\\]');
    dateEls.forEach(function (el) {
      var t = el.textContent.trim();
      var m = t.match(/^(\d{2}\/\d{2})\/\d{4}$/);
      if (m) el.textContent = m[1];
    });
  }

  var calObserver = new MutationObserver(function () {
    // Debounce slightly so we don't run on every single DOM mutation
    clearTimeout(calObserver._t);
    calObserver._t = setTimeout(abbreviateDayNames, 80);
  });

  /* ----------------------------------------------------------
     Floating Action Button (FAB) — "Create Post"
     Commit 16
     ---------------------------------------------------------- */
  function buildFab() {
    var existing = document.getElementById('mobile-fab');
    if (existing) existing.remove();

    var prefix = getOrgPrefix();
    // Skip on auth pages
    var path = window.location.pathname;
    if (/\/(login|register|auth)/.test(path)) return;

    var btn = document.createElement('button');
    btn.id = 'mobile-fab';
    btn.setAttribute('aria-label', 'Create post');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

    btn.addEventListener('click', function () {
      // Strategy 1: find a "Create post" / "New post" button and click it
      var createBtns = Array.from(document.querySelectorAll('button, [role="button"]'));
      var target = createBtns.find(function (el) {
        var txt = (el.textContent || el.innerText || '').trim().toLowerCase();
        return txt === 'create post' || txt === 'new post' || txt === '+ create post' || txt === 'add post';
      });
      if (target) {
        target.click();
        return;
      }
      // Strategy 2: navigate to launches page where the create button lives
      var dest = prefix + '/launches';
      if (window.location.pathname.indexOf('/launches') === -1) {
        window.location.href = dest;
      } else {
        // We're already on launches — try clicking the first prominent purple/primary button
        var primaryBtn = document.querySelector('[class*="bg-primary"], [class*="bg-btnPrimary"], [class*="bg-purple"]');
        if (primaryBtn) primaryBtn.click();
      }
    });

    document.body.appendChild(btn);
  }

  function init() {
    buildNav();
    buildFab();
    abbreviateDayNames();
    calObserver.observe(document.body, { childList: true, subtree: true });

    // Re-check viewport on resize (tablet → desktop: remove nav + fab)
    window.addEventListener('resize', function () {
      var nav = document.getElementById('mobile-bottom-nav');
      var fab = document.getElementById('mobile-fab');
      if (window.innerWidth > 768) {
        if (nav) nav.remove();
        if (fab) fab.remove();
        calObserver.disconnect();
      } else {
        if (!nav) buildNav();
        if (!fab) buildFab();
        calObserver.observe(document.body, { childList: true, subtree: true });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
