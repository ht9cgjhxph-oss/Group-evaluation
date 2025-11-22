// -------------- تسجيل التصويت --------------
document.querySelectorAll(".vote-btn").forEach(btn => {
    btn.addEventListener("click", async () => {

        const group = btn.dataset.group;

        const res = await fetch("/api/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group })
        });

        if (res.ok) {
            alert("✔ تم تسجيل صوتك بنجاح");
        } else {
            alert("❌ فشل تسجيل التصويت — شيّكي Vercel functions");
        }
    });
});


// -------------- جلب النتائج من GitHub --------------
async function fetchVotes() {
    const res = await fetch("https://raw.githubusercontent.com/ht9cgjhxph-oss/Group-evaluation/main/votes.json");
    return await res.json();
}

// -------------- عرض النتائج في صفحة results.html --------------
if (window.location.pathname.includes("results.html")) {

    async function updateResults() {
        let votes = await fetchVotes();

        const groups = Object.entries(votes)
            .sort((a, b) => b[1] - a[1]);

        groups.forEach((g, i) => {
            const row = document.getElementById(g[0]);
            if (row) {
                row.querySelector(".score").innerText = g[1];
                row.querySelector(".rank").innerText = "#" + (i+1);
            }
        });
    }

    updateResults();

    document.getElementById("refresh").addEventListener("click", updateResults);
}
