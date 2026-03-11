document.getElementById("lookupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let formData = new FormData();
    formData.append("email", email);

    let response = await fetch("/check", {
        method: "POST",
        body: formData
    });

    let data = await response.json();

    // SHOW RESULTS
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("emailOut").textContent = data.email;
    document.getElementById("breachCount").textContent = data.breach_count;
    document.getElementById("riskScore").textContent = data.risk_score;

    const riskBar = document.getElementById("riskBar");
    riskBar.style.width = data.risk_score + "%";

    /* ---- RISK LABEL + COLOR GLOW ---- */
    const labelEl = document.getElementById("riskLabel");

    riskBar.classList.remove("risk-low", "risk-medium", "risk-high");

    if (data.risk_score < 20) {
        riskBar.classList.add("risk-low");
        labelEl.textContent = "Low Risk";
        labelEl.style.color = "#2ecc71";
    }
    else if (data.risk_score < 60) {
        riskBar.classList.add("risk-medium");
        labelEl.textContent = "Moderate Risk";
        labelEl.style.color = "#f1c40f";
    }
    else {
        riskBar.classList.add("risk-high");
        labelEl.textContent = "High Risk";
        labelEl.style.color = "#e74c3c";
    }

    /* ---- BREACH LIST WITH ICONS ---- */
    let breachList = document.getElementById("breachList");
    breachList.innerHTML = "";

    const icons = {
        "Adobe": "🟥",
        "LinkedIn": "🟦",
        "Dropbox": "🟪",
        "Facebook": "🟩",
        "Canva": "🟧"
    };

    if (data.breach_count === 0) {
        breachList.innerHTML = "<li>No breaches found 🎉</li>";
    } else {
        data.breaches.forEach((b) => {
            let icon = icons[b.name] || "🔐";
            let item = document.createElement("li");
            item.textContent = `${icon} ${b.name} (${b.year}) — ${b.exposed_data}`;
            breachList.appendChild(item);
        });
    }

    /* ---- CYBER PERSONA SUMMARY ---- */
    let personaBox = document.getElementById("personaBox");

    if (data.risk_score < 20) {
        personaBox.textContent =
            "Cyber Persona: The Vigilant User — Your exposure is minimal. Keep using strong passwords and MFA!";
    }
    else if (data.risk_score < 60) {
        personaBox.textContent =
            "Cyber Persona: The Cautious Explorer — Moderate exposure detected. Stay alert and consider updating old passwords.";
    }
    else {
        personaBox.textContent =
            "Cyber Persona: The High-Risk Target — Multiple breaches detected. Immediate password resets and MFA activation recommended.";
    }
});








