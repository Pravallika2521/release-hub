<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Release Readiness Dashboard</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: #f5f6fa;
        margin: 0;
        padding: 20px;
    }

 

    h1 {
        margin-bottom: 5px;
    }

 

    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

 

    .card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

 

    .full {
        grid-column: span 3;
    }

 

    .progress {
        height: 10px;
        background: #ddd;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 10px;
    }

 

    .bar {
        height: 100%;
    }

 

    .green { background: #2ecc71; }
    .blue { background: #3498db; }
    .yellow { background: #f1c40f; }
    .red { background: #e74c3c; }
    .purple { background: #9b59b6; }
    .indigo { background: #3f51b5; }

 

    .status-pass {
        color: green;
        font-weight: bold;
    }

 

    .status-fail {
        color: red;
        font-weight: bold;
    }

 

    .decision {
        font-size: 28px;
        padding: 10px 20px;
        color: white;
        border-radius: 8px;
        display: inline-block;
    }

 

    .go { background: green; }
    .conditional { background: orange; }
    .nogo { background: red; }

 

</style>
</head>

 

<body>

 

<h1>Release Readiness Dashboard (Sprint 42)</h1>
<p>Example based on Jira + GitHub data</p>

 

<div class="grid">

 

    <!-- Go / No-Go -->
<div class="card full" id="decisionCard">
<h2>Release Decision</h2>
<div id="decision" class="decision">Loading...</div>
</div>

 

    <!-- Score -->
<div class="card">
<h2>Readiness Score</h2>
<h1 id="score">88</h1>
<div class="progress">
<div id="scoreBar" class="bar green"></div>
</div>
<p>⚠️ Minor Risks</p>
</div>

 

    <!-- Gates -->
<div class="card">
<h2>Mandatory Gates</h2>
<p>Blockers: <span class="status-pass">Pass</span></p>
<p>Critical Bugs: <span class="status-pass">Pass</span></p>
<p>Open PRs: <span class="status-fail">Fail</span></p>
<p>Build Health: <span class="status-pass">Pass</span></p>
</div>

 

    <!-- Quick Stats -->
<div class="card">
<h2>Quick Stats</h2>
<p>✅ Completed: 46 / 50</p>
<p>⚠️ Spillover: 4</p>
<p>🐛 Bugs: 9</p>
<p>🔀 Merged PRs: 38</p>
<p>⛔ Open PRs: 2</p>
</div>

 

    <!-- Metrics -->
<div class="card full">
<h2>Detailed Metrics</h2>

 

        <p>Delivery Completion (92%)</p>
<div class="progress"><div class="bar green" style="width:92%"></div></div>

 

        <p>PR Hygiene (85%)</p>
<div class="progress"><div class="bar blue" style="width:85%"></div></div>

 

        <p>Scope Stability (78%)</p>
<div class="progress"><div class="bar yellow" style="width:78%"></div></div>

 

        <p>Bug Ratio (72%)</p>
<div class="progress"><div class="bar red" style="width:72%"></div></div>

 

        <p>Component Coverage (90%)</p>
<div class="progress"><div class="bar purple" style="width:90%"></div></div>

 

        <p>Velocity Predictability (84%)</p>
<div class="progress"><div class="bar indigo" style="width:84%"></div></div>
</div>

 

    <!-- AI Insights -->
<div class="card full">
<h2>AI Insights</h2>
<ul>
<li>📈 92% delivery achieved</li>
<li>⚠️ Open PRs blocking release</li>
<li>🐛 Bug ratio slightly high</li>
<li>🔄 18% unplanned work</li>
<li>✅ Action: Close PRs to achieve GO</li>
</ul>
</div>

 

</div>

 

<script>
    const score = 88;

 

    // Check gate fail
    const hasFailedGate = true; // Open PRs fail

 

    let decisionText, decisionClass;

 

    if (hasFailedGate) {
        decisionText = "NO GO";
        decisionClass = "nogo";
    } else if (score >= 90) {
        decisionText = "GO";
        decisionClass = "go";
    } else if (score >= 75) {
        decisionText = "CONDITIONAL GO";
        decisionClass = "conditional";
    } else {
        decisionText = "NO GO";
        decisionClass = "nogo";
    }

 

    document.getElementById("decision").innerText = decisionText;
    document.getElementById("decision").classList.add(decisionClass);

 

    document.getElementById("scoreBar").style.width = score + "%";
</script>

 

</body>
</html>
