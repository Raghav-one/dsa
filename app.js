(function () {
  var TRACK_ORDER = ["foundations", "structures", "advanced-structures", "patterns", "graphs", "dynamic-programming"];

  var TRACK_DESC = {
    "foundations": "Learn how to estimate time and memory, reason about loops, and use input limits to reject an approach before you code it.",
    "structures": "Learn what each structure stores, which operation is cheap, and when arrays, maps, lists, stacks, queues, trees, heaps, or tries are the right choice.",
    "advanced-structures": "Use specialized structures when ordinary arrays and maps are too slow for repeated range queries, ordered lookup, caching, or compact membership tests.",
    "patterns": "Recognize the recurring moves behind common problems: ordered pointers, moving windows, binary search, sorting, recursion, greedy choices, ranges, and bits.",
    "graphs": "Turn relationships into vertices and edges, then choose the traversal or path algorithm whose guarantees match the problem.",
    "dynamic-programming": "Define a subproblem precisely, reuse its answer, and choose an evaluation order that makes every needed state available."
  };

  function content() {
    return window.SITE_CONTENT || {};
  }

  function buildSidebar() {
    var nav = document.getElementById("sidebar-nav");
    nav.innerHTML = "";
    TRACK_ORDER.forEach(function (key) {
      var data = content()[key];
      if (!data) return;

      var track = document.createElement("section");
      track.className = "track collapsed";
      track.dataset.track = key;

      var title = document.createElement("button");
      title.type = "button";
      title.className = "track-title";
      title.textContent = data.track;
      title.setAttribute("aria-expanded", "false");
      title.setAttribute("aria-controls", "track-" + key);
      title.addEventListener("click", function () {
        setTrackExpanded(track, track.classList.contains("collapsed"));
      });
      track.appendChild(title);

      var list = document.createElement("ul");
      list.className = "step-list";
      list.id = "track-" + key;
      data.steps.forEach(function (step, i) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + key + "/" + step.id;
        a.dataset.track = key;
        a.dataset.step = step.id;
        var badge = document.createElement("span");
        badge.className = "step-num-badge";
        badge.textContent = (i + 1) + ".";
        a.appendChild(badge);
        a.appendChild(document.createTextNode(" " + step.title));
        li.appendChild(a);
        list.appendChild(li);
      });
      track.appendChild(list);
      nav.appendChild(track);
    });
  }

  function setTrackExpanded(track, expanded) {
    track.classList.toggle("collapsed", !expanded);
    var title = track.querySelector(".track-title");
    if (title) title.setAttribute("aria-expanded", String(expanded));
  }

  function renderHome() {
    var pane = document.getElementById("content-pane");
    var html = '<h1>Data Structures and Algorithms</h1>';
    html += '<p class="subtitle">Start with the data you have and the operation you need. Each lesson explains what the concept is, why it helps, how it works, when it is the wrong tool, and the mistake that usually breaks an implementation.</p>';
    html += '<div class="landing-cards">';
    TRACK_ORDER.forEach(function (key) {
      var data = content()[key];
      if (!data) return;
      html += '<a class="landing-card" href="#' + key + '">' +
        '<span class="title">' + data.track + '</span>' +
        '<span class="desc">' + TRACK_DESC[key] + '</span>' +
        '</a>';
    });
    html += '</div>';
    pane.innerHTML = html;
  }

  function renderStep(trackKey, stepId) {
    var data = content()[trackKey];
    if (!data) { renderHome(); return; }

    var idx = data.steps.findIndex(function (s) { return s.id === stepId; });
    if (idx === -1) idx = 0;
    var step = data.steps[idx];

    var pane = document.getElementById("content-pane");
    var html = '<div class="crumb"><a href="#">DSA, from First Principles</a><span class="sep">&rsaquo;</span><a href="#' + trackKey + '">' + data.track + '</a><span class="sep">&rsaquo;</span>Step ' + (idx + 1) + ' of ' + data.steps.length + '</div>';
    html += '<h1>' + step.title + '</h1>';
    html += step.body;

    html += '<div class="step-nav">';
    if (idx > 0) {
      var prev = data.steps[idx - 1];
      html += '<a class="prev" href="#' + trackKey + '/' + prev.id + '"><span class="dir">Previous</span>' + prev.title + '</a>';
    } else {
      html += '<span class="placeholder"></span>';
    }
    if (idx < data.steps.length - 1) {
      var next = data.steps[idx + 1];
      html += '<a class="next" href="#' + trackKey + '/' + next.id + '"><span class="dir">Next</span>' + next.title + '</a>';
    } else {
      html += '<span class="placeholder"></span>';
    }
    html += '</div>';

    pane.innerHTML = html;
    highlightActive(trackKey, step.id);
    window.scrollTo(0, 0);
    document.getElementById("content-pane").scrollTo && document.getElementById("content-pane").scrollTo(0, 0);
  }

  function highlightActive(trackKey, stepId) {
    var links = document.querySelectorAll(".step-list a");
    links.forEach(function (a) {
      a.classList.toggle("active", a.dataset.track === trackKey && a.dataset.step === stepId);
    });
    if (trackKey) {
      var currentTrack = document.querySelector('.track[data-track="' + trackKey + '"]');
      if (currentTrack) setTrackExpanded(currentTrack, true);
    }
  }

  function route() {
    var hash = location.hash.replace(/^#/, "");
    if (!hash) { renderHome(); highlightActive(null, null); return; }
    var parts = hash.split("/");
    var trackKey = parts[0];
    var stepId = parts[1];
    if (!content()[trackKey]) { renderHome(); return; }
    if (!stepId) {
      renderStep(trackKey, content()[trackKey].steps[0].id);
    } else {
      renderStep(trackKey, stepId);
    }
    closeSidebarMobile();
  }

  function closeSidebarMobile() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebar-overlay");
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildSidebar();
    route();

    var toggle = document.getElementById("sidebar-toggle");
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebar-overlay");
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");
    });
    overlay.addEventListener("click", closeSidebarMobile);
  });

  window.addEventListener("hashchange", route);
})();
