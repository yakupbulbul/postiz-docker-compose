/* ============================================================
   POSTIZ MOBILE — Bottom navigation bar + header overflow menu
   Injected via nginx sub_filter into every HTML page
   ============================================================ */

(function () {
  'use strict';

  var isMobile = window.innerWidth <= 768;

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
    if (!isMobile) return;
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
      setTimeout(function () { updateActive(); buildFab(); setTimeout(switchToDayView, 400); }, 50);
    };

    history.replaceState = function () {
      origReplace.apply(history, arguments);
      setTimeout(function () { updateActive(); buildFab(); setTimeout(switchToDayView, 400); }, 50);
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
     PWA / Add to Home Screen meta tags
     Commit 18 — injected unconditionally for all viewports
     ---------------------------------------------------------- */
  function injectPWAMeta() {
    var metas = [
      { name: 'theme-color',                        content: '#ffffff' },
      { name: 'apple-mobile-web-app-capable',       content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'mobile-web-app-capable',             content: 'yes' },
      { name: 'apple-mobile-web-app-title',         content: 'Postiz' }
    ];
    metas.forEach(function (m) {
      // Skip if the page already has this meta (avoid duplicates from SSR)
      if (document.querySelector('meta[name="' + m.name + '"]')) return;
      var el = document.createElement('meta');
      el.name = m.name;
      el.content = m.content;
      document.head.appendChild(el);
    });
  }

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
     Calendar: auto-switch to Day view on mobile
     Commit 17/22 — fixed selector (Postiz uses plain divs with
     class "cursor-pointer w-[74px]", NOT role="tab").
     Only fires once per session; won't override manual switches.
     ---------------------------------------------------------- */
  /* Commit 30 — Fixed: two-step switch
     1. Click the calendar-grid icon if currently in list view
     2. Then click "Day" tab (w-[74px] button group)
     Retry up to 30× to handle slow React hydration */
  function switchToDayView() {
    // Only on /launches route
    if (getActivePath().indexOf('/launches') !== 0) return;

    function trySwitch() {
      // Step 1: Find the view-type icons (w-[34px] buttons: calendar vs list)
      // The calendar grid icon is the first one; list icon is second.
      var iconBtns = Array.from(document.querySelectorAll(
        '.pt-\\[6px\\].pb-\\[5px\\].cursor-pointer.flex.justify-center.items-center'
      ));
      if (iconBtns.length >= 1) {
        var calendarIcon = iconBtns[0];
        var isCalActive = calendarIcon.classList.contains('text-textItemFocused') ||
                          calendarIcon.classList.contains('bg-boxFocused');
        if (!isCalActive) {
          calendarIcon.click();
          return false; // need to retry after click renders Day/Week/Month tabs
        }
      }

      // Step 2: Find "Day" tab among the w-[74px] text switcher buttons
      var dayBtn = Array.from(document.querySelectorAll('div, span')).find(function (el) {
        if (el.children.length > 0) return false;
        var txt = (el.textContent || '').trim();
        var isDay = txt === 'Day' || txt === 'Gün' || txt === 'يوم' || txt === 'Tag' || txt === 'Día';
        return isDay && el.offsetParent !== null;
      });
      if (!dayBtn) return false;

      var isActive = dayBtn.classList.contains('bg-boxFocused') ||
                     dayBtn.classList.contains('text-textItemFocused');
      if (!isActive) dayBtn.click();
      return true;
    }

    // Retry up to 30× (every 300ms = up to ~9s) to handle slow React hydration
    if (!trySwitch()) {
      var attempts = 0;
      var retryTimer = setInterval(function () {
        attempts++;
        if (trySwitch() || attempts > 30) clearInterval(retryTimer);
      }, 300);
    }
  }

  /* ----------------------------------------------------------
     Floating Action Button (FAB) — "Create Post"
     Commit 16
     ---------------------------------------------------------- */
  function buildFab() {
    if (!isMobile) return;
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
      // Postiz has no standalone "Create post" button in the toolbar.
      // Posts are created by clicking an empty calendar cell, which opens
      // the "add-edit-modal". Strategy:
      // 1. If the create-post overlay (bg-popup) is already open — do nothing.
      // 2. If on /launches — click the first clickable empty calendar cell.
      // 3. Otherwise — navigate to /launches (user taps an empty cell there).

      // 1. Already open?
      if (document.querySelector('.w-full.h-full.fixed.flex.left-0.top-0.bg-popup')) return;

      var dest = prefix + '/launches';

      if (window.location.pathname.indexOf('/launches') === -1) {
        // 3. Navigate to calendar
        window.location.href = dest;
        return;
      }

      // 2. On /launches: click the first empty calendar time-slot cell.
      // Day-view cells: class "min-h-full w-full p-[5px] flex items-center justify-center cursor-pointer"
      // These open the create-post modal when clicked.
      var timeSlotCells = Array.from(document.querySelectorAll(
        '[class*="min-h-full"][class*="cursor-pointer"], .cursor-pointer.min-h-full'
      )).filter(function (el) {
        // Must be a visible, reasonably large cell (time-slot, not a tiny icon)
        return el.offsetHeight > 40 && el.offsetWidth > 100 && el.offsetParent !== null;
      });

      if (timeSlotCells.length > 0) {
        timeSlotCells[0].click();
      } else {
        // Fallback: any clickable element with large dimensions (week/month view cells)
        var any = Array.from(document.querySelectorAll('.cursor-pointer')).find(function (el) {
          return el.offsetHeight > 60 && el.offsetWidth > 60 && el.offsetParent !== null &&
                 el.querySelectorAll('img').length === 0;
        });
        if (any) any.click();
        else window.location.href = dest;
      }
    });

    document.body.appendChild(btn);
  }

  function init() {
    injectPWAMeta();
    buildNav();
    buildFab();
    abbreviateDayNames();
    setTimeout(switchToDayView, 400);
    calObserver.observe(document.body, { childList: true, subtree: true });

    // Re-check viewport on resize (tablet → desktop: remove nav + fab)
    window.addEventListener('resize', function () {
      isMobile = window.innerWidth <= 768;
      var nav = document.getElementById('mobile-bottom-nav');
      var fab = document.getElementById('mobile-fab');
      if (!isMobile) {
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
