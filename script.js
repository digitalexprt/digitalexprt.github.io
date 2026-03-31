const perspectiveData = {
  boardroom: {
    kicker: "Boardroom lens",
    title: "Strategic optionality lives or dies in delivery.",
    copy:
      "DigitalExprt makes release friction, AI risk, and architectural drag visible in business terms leadership can actually act on.",
    points: [
      "Expose where maintenance cost is stealing investment capacity.",
      "Make AI adoption legible to governance and risk owners.",
      "Convert delivery chaos into clear operating priorities.",
    ],
  },
  delivery: {
    kicker: "Delivery lens",
    title: "Small, safe changes beat dramatic rewrites every time.",
    copy:
      "DigitalExprt helps teams regain confidence through test-guided change, tighter feedback loops, and operating practices that survive real production pressure.",
    points: [
      "Use TDN to steer AI in narrow, verifiable steps.",
      "Reduce blast radius before chasing headline velocity.",
      "Build a pilot team that proves the new motion in public.",
    ],
  },
  guild: {
    kicker: "Guild lens",
    title: "Professional standards are the missing layer in AI adoption.",
    copy:
      "DigitalExprt carries the posture of a craft organization: embrace innovation, insist on quality, harden safety, and protect humans from careless automation.",
    points: [
      "Treat quality as a professional obligation, not a preference.",
      "Install safety, security, and legal accountability into the workflow.",
      "Keep human agency visible as systems become more automated.",
    ],
  },
};

const pressureTiers = [
  {
    limit: 34,
    tier: "Focused diagnostic",
    title: "You need sharper visibility before you need heavier intervention.",
    copy:
      "The system shows localized stress. Start by exposing the highest-friction constraints and aligning leadership around what is actually slowing delivery.",
  },
  {
    limit: 64,
    tier: "Pilot team intervention",
    title: "You need proof in motion, not another slide deck.",
    copy:
      "Delivery risk is systemic enough to warrant hands-on work, but still narrow enough to prove change through a lighthouse team.",
  },
  {
    limit: 100,
    tier: "Executive system redesign",
    title: "The operating model itself is now the bottleneck.",
    copy:
      "The pressure is structural. A narrow team fix will not hold unless leadership, workflow, architecture, and AI governance move together.",
  },
];

const perspectiveTabs = document.querySelectorAll(".perspective-tab");
const perspectiveKicker = document.getElementById("perspective-kicker");
const perspectiveTitle = document.getElementById("perspective-title");
const perspectiveCopy = document.getElementById("perspective-copy");
const perspectivePoints = document.getElementById("perspective-points");

function renderPerspective(mode) {
  const content = perspectiveData[mode];
  if (!content) {
    return;
  }

  document.body.dataset.perspective = mode;
  perspectiveKicker.textContent = content.kicker;
  perspectiveTitle.textContent = content.title;
  perspectiveCopy.textContent = content.copy;
  perspectivePoints.innerHTML = "";

  content.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    perspectivePoints.appendChild(item);
  });

  perspectiveTabs.forEach((tab) => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

perspectiveTabs.forEach((tab) => {
  tab.addEventListener("click", () => renderPerspective(tab.dataset.mode));
});

const pressureControls = document.getElementById("pressure-controls");
const pressureOutputs = document.querySelectorAll("[data-output]");
const pressureScore = document.getElementById("pressure-score");
const pressureTier = document.getElementById("pressure-tier");
const pressureTitle = document.getElementById("pressure-title");
const pressureCopy = document.getElementById("pressure-copy");
const pressurePoints = document.getElementById("pressure-points");
const scoreDial = document.getElementById("score-dial");

function identifyPrimaryTension(values) {
  const weighted = {
    "AI speed is outrunning process discipline.":
      values.aiSurface * 2.4,
    "Release confidence is too low for the current pace of change.":
      (11 - values.releaseConfidence) * 2.8,
    "Coordination overhead is erasing the value AI promised.":
      values.handoffDrag * 2.5,
    "Architecture is too ambiguous for safe acceleration.":
      (11 - values.architecturalClarity) * 3.1,
  };

  return Object.entries(weighted).sort((left, right) => right[1] - left[1])[0][0];
}

function getRecommendedMove(score) {
  return pressureTiers.find((entry) => score <= entry.limit) ?? pressureTiers[2];
}

function updatePressureReport() {
  const formData = new FormData(pressureControls);
  const values = {
    aiSurface: Number(formData.get("aiSurface")),
    releaseConfidence: Number(formData.get("releaseConfidence")),
    handoffDrag: Number(formData.get("handoffDrag")),
    architecturalClarity: Number(formData.get("architecturalClarity")),
  };

  pressureOutputs.forEach((output) => {
    output.textContent = String(values[output.dataset.output]);
  });

  const rawScore =
    values.aiSurface * 2.4 +
    (11 - values.releaseConfidence) * 2.8 +
    values.handoffDrag * 2.5 +
    (11 - values.architecturalClarity) * 3.1;
  const score = Math.max(1, Math.min(100, Math.round(rawScore * 100 / 108)));
  const recommendation = getRecommendedMove(score);
  const primaryTension = identifyPrimaryTension(values);

  pressureScore.textContent = String(score);
  pressureTier.textContent = recommendation.tier;
  pressureTitle.textContent = recommendation.title;
  pressureCopy.textContent = recommendation.copy;
  scoreDial.style.setProperty("--score", score);

  const bestMove =
    score <= 34
      ? "Run a short diagnostic and map the real constraints before scaling effort."
      : score <= 64
        ? "Stand up a guided pilot team and shorten the feedback loop immediately."
        : "Treat this as a leadership-owned operating model problem, not a team-level inconvenience.";

  const leadershipSignal =
    score <= 34
      ? "If visibility improves, the organization can move without major structural change."
      : score <= 64
        ? "The next win must be demonstrable in production, not theoretical in planning."
        : "Executive alignment is now part of the delivery system itself.";

  pressurePoints.innerHTML = "";
  [primaryTension, bestMove, leadershipSignal].forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    pressurePoints.appendChild(item);
  });
}

pressureControls.addEventListener("input", updatePressureReport);

const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
    },
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

renderPerspective("boardroom");
updatePressureReport();
