/**
 * Sherman's questions helper.
 * Topic buttons and short answers from this site. Nothing is sent anywhere.
 */
(function () {
  "use strict";

  var MAPS = "https://www.google.com/maps/search/?api=1&query=230+County+Road+263,+Niota,+TN+37826";

  function siteRoot() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src") || "";
      var at = src.indexOf("js/chat.js");
      if (at !== -1) return src.slice(0, at);
    }
    return "";
  }

  var root = siteRoot();

  function link(href, text, external) {
    var node = document.createElement("a");
    node.href = href;
    node.textContent = text;
    if (external) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    }
    return node;
  }

  function phone() {
    return link("tel:+14239203750", "423-920-3750");
  }

  function email() {
    return link("mailto:greenpea@live.com", "greenpea@live.com");
  }

  function contact() {
    return link(root + "book.html", "booking page");
  }

  function paragraph(parts) {
    var node = document.createElement("p");
    parts.forEach(function (part) {
      node.appendChild(typeof part === "string" ? document.createTextNode(part) : part);
    });
    return node;
  }

  var topics = [
    {
      id: "availability",
      label: "Availability",
      keywords: ["available", "availability", "litter", "wait list", "waitlist"],
      answer: function () {
        return [
          paragraph(["AKC registered Shih Tzu puppies: $1,600. CKC puppies: none available right now."]),
          paragraph(["Puppies are raised in the home and handled daily."]),
          paragraph([
            "Call or message us for current litter availability. Even if no puppies are available right now, you can still call to join the waitlist."
          ]),
          paragraph(["Call ", phone(), " and ask for Shannon Sherman, email ", email(), ", or use the ", contact(), "."])
        ];
      }
    },
    {
      id: "visits",
      label: "Visits",
      keywords: ["visit", "visits", "appointment"],
      answer: function () {
        var book = link(root + "book.html", "Book a visit");
        book.className = "btn btn-primary";
        return [
          paragraph(["Mon–Sat 9 AM–8 PM, Sun 12–5 PM, visits by appointment. We'll call or text to confirm."]),
          paragraph(["Kids are welcome on visits, and there is on-site parking."]),
          paragraph([
            "Schedule an appointment for a puppy showing at our home. The address is ",
            link(MAPS, "230 County Road 263, Niota, TN 37826", true),
            "."
          ]),
          paragraph(["Prefer a video visit? Call or text ", phone(), " to set up a FaceTime visit."]),
          el("p", {}, [book])
        ];
      }
    },
    {
      id: "pickup",
      label: "Pickup",
      keywords: ["pickup", "pick up", "ship", "shipping", "deliver", "delivery"],
      answer: function () {
        return [paragraph(["We do not ship. Pickup is in person only in Niota, TN."])];
      }
    },
    {
      id: "facetime",
      label: "FaceTime",
      keywords: ["facetime", "face time", "zoom", "online", "video call"],
      answer: function () {
        return [
          paragraph(["Prefer a video visit? Call or text ", phone(), " to set up a FaceTime visit."]),
          paragraph(["Call ", phone(), " and ask for Shannon Sherman."])
        ];
      }
    },
    {
      id: "contact",
      label: "Contact",
      keywords: ["contact", "phone", "call", "email", "hours", "shannon"],
      answer: function () {
        return [
          paragraph(["Call ", phone(), " and ask for Shannon Sherman, or email ", email(), "."]),
          paragraph(["Mon–Sat 9 AM–8 PM, Sun 12–5 PM, visits by appointment."]),
          paragraph(["You can also write to us on the ", contact(), "."])
        ];
      }
    },
    {
      id: "price",
      label: "Price",
      keywords: ["price", "prices", "cost", "how much", "deposit", "fee", "payment"],
      answer: function () {
        return priceAnswer();
      }
    },
    {
      id: "directions",
      label: "Directions",
      keywords: ["direction", "directions", "map", "address", "where", "knoxville", "chattanooga", "athens"],
      answer: function () {
        return [
          paragraph([
            "We are at ",
            link(MAPS, "230 County Road 263, Niota, TN 37826", true),
            ", in East Tennessee, near Athens. Knoxville and Chattanooga are a drive away."
          ]),
          paragraph(["Families are welcome from anywhere in the United States. We do not ship. Pickup is in person in Niota."])
        ];
      }
    }
  ];

  var priceWords = ["price", "prices", "cost", "how much", "deposit", "fee", "payment", "pay "];

  function topicById(id) {
    return topics.filter(function (topic) { return topic.id === id; })[0];
  }

  function findTopic(text) {
    var q = text.toLowerCase();
    var priced = priceWords.some(function (word) { return q.indexOf(word) !== -1; });
    if (priced) return "price";
    if (q.indexOf("zoom") !== -1 || q.indexOf("facetime") !== -1 || q.indexOf("face time") !== -1) return topicById("facetime");
    if (q.indexOf("ship") !== -1 || q.indexOf("deliver") !== -1) return topicById("pickup");
    var best = null;
    var bestScore = 0;
    topics.forEach(function (topic) {
      var score = 0;
      topic.keywords.forEach(function (word) {
        if (q.indexOf(word) !== -1) score += word.length;
      });
      if (score > bestScore) {
        bestScore = score;
        best = topic;
      }
    });
    return best;
  }

  function priceAnswer() {
    return [
      paragraph(["AKC registered Shih Tzu puppies: $1,600. CKC puppies: none available right now."]),
      paragraph(["Visit and meet the puppies, put down a $600 non-refundable deposit to hold your puppy, then when the puppy is old enough to go home you pick up in person and pay the remaining balance."])
    ];
  }

  function fallbackAnswer() {
    return [
      paragraph(["Please choose a topic, or call ", phone(), " and ask for Shannon Sherman. You can also email ", email(), "."])
    ];
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (key === "className") node.className = value;
        else if (key === "text") node.textContent = value;
        else if (value !== false && value != null) node.setAttribute(key, value === true ? "" : String(value));
      });
    }
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function init() {
    if (document.querySelector("[data-help]")) return;

    var live = el("p", { className: "visually-hidden", "aria-live": "polite", "aria-atomic": "true" });
    var log = el("div", { className: "help-log", tabindex: "0", "aria-label": "Answers" });
    var topicsBox = el("div", { className: "help-topics", role: "group", "aria-labelledby": "helpTopicsLabel" });
    var panel = el("div", {
      className: "help-panel",
      id: "helpPanel",
      role: "region",
      "aria-labelledby": "helpTitle",
      hidden: true
    });
    var launcher = el("button", {
      type: "button",
      className: "help-launcher",
      "aria-expanded": "false",
      "aria-controls": "helpPanel"
    }, [el("span", { text: "Questions" })]);
    var closeBtn = el("button", { type: "button", className: "help-close", "aria-label": "Close questions" }, [
      el("span", { "aria-hidden": "true", text: "Close" })
    ]);
    var input = el("input", {
      id: "helpInput",
      className: "help-input",
      type: "text",
      name: "question",
      autocomplete: "off",
      maxlength: "160"
    });
    var form = el("form", { className: "help-ask" }, [
      el("label", { className: "visually-hidden", for: "helpInput", text: "Ask a question" }),
      input,
      el("button", { type: "submit", className: "help-ask-btn", text: "Ask" })
    ]);

    panel.appendChild(el("div", { className: "help-head" }, [
      el("div", {}, [
        el("h2", { id: "helpTitle", className: "help-title", text: "Questions" }),
        el("p", { className: "help-note", text: "From this site. Not a live person." })
      ]),
      closeBtn
    ]));
    panel.appendChild(log);
    panel.appendChild(el("p", { id: "helpTopicsLabel", className: "help-topics-label", text: "Topics" }));
    panel.appendChild(topicsBox);
    panel.appendChild(form);
    panel.appendChild(el("p", { className: "help-private", text: "What you type stays in this browser." }));

    var help = el("div", { className: "help", "data-help": true }, [live, panel, launcher]);
    var slot = el("div", { className: "help-slot" }, [help]);
    var footer = document.querySelector(".site-footer");
    if (footer && footer.parentNode) footer.parentNode.insertBefore(slot, footer);
    else document.body.appendChild(slot);

    var lastFocus = null;
    var welcomed = false;

    function announce(text) {
      live.textContent = text;
    }

    function bubble(role, nodes) {
      var item = el("div", { className: "help-bubble help-bubble-" + role });
      nodes.forEach(function (node) { item.appendChild(node); });
      log.appendChild(item);
      log.scrollTop = log.scrollHeight;
    }

    function say(nodes, spoken) {
      bubble("bot", nodes);
      announce(spoken);
    }

    function welcome() {
      if (welcomed) return;
      welcomed = true;
      say(
        [paragraph(["Hello. Choose a topic for a short answer from this site."])],
        "Hello. Choose a topic for a short answer from this site."
      );
    }

    function answerFor(topic) {
      if (topic === "price") return priceAnswer();
      return topic.answer();
    }

    function spokenFor(topic) {
      var box = document.createElement("div");
      answerFor(topic).forEach(function (node) { box.appendChild(node.cloneNode(true)); });
      return box.textContent.replace(/\s+/g, " ").trim();
    }

    function ask(label, topic) {
      bubble("user", [paragraph([label])]);
      var nodes = answerFor(topic);
      say(nodes, spokenFor(topic));
    }

    function setOpen(open) {
      launcher.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      help.classList.toggle("is-open", open);
      if (open) {
        lastFocus = document.activeElement;
        welcome();
        window.setTimeout(function () { closeBtn.focus(); }, 30);
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
      } else {
        launcher.focus();
      }
    }

    topics.slice().sort(function (a, b) {
      return a.label.localeCompare(b.label, "en", { sensitivity: "base" });
    }).forEach(function (topic) {
      topicsBox.appendChild(el("button", {
        type: "button",
        className: "help-topic"
      }, [document.createTextNode(topic.label)]));
    });
    topicsBox.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button || !topicsBox.contains(button)) return;
      var topic = topics.filter(function (item) { return item.label === button.textContent; })[0];
      if (topic) ask(topic.label, topic);
    });

    launcher.addEventListener("click", function () {
      var open = panel.hidden;
      setOpen(open);
      if (open) panel.scrollIntoView({ block: "start" });
    });
    closeBtn.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) setOpen(false);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      input.value = "";
      var found = findTopic(text);
      if (!found) {
        bubble("user", [paragraph([text])]);
        var nodes = fallbackAnswer();
        say(nodes, "Please choose a topic, or call 423-920-3750 and ask for Shannon Sherman.");
        return;
      }
      ask(text, found);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
