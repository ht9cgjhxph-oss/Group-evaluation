const USERNAME = "ht9cgjhxph-oss"; 
const REPO = "Group-evaluation";
const FILE_PATH = "votes.json";

async function getVotes() {
    const res = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/${FILE_PATH}`);
    const data = await res.json();
    return {
        sha: data.sha,
        votes: JSON.parse(atob(data.content))
    };
}

async function sendUpdateRequest(updatedVotes, sha) {
    await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/dispatches`, {
        method: "POST",
        headers: {
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            event_type: "update_votes",
            client_payload: {
                votes: updatedVotes,
                sha: sha
            }
        })
    });
}

document.querySelectorAll(".vote-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        let group = btn.dataset.group;

        let file = await getVotes();
        let votes = file.votes;

        votes[group]++;

        await sendUpdateRequest(votes, file.sha);

        updateBars(votes);
        alert("✔ تم تسجيل صوتك بنجاح");
    });
});

function updateBars(votes) {
    for (let g in votes) {
        let max = Math.max(...Object.values(votes));
        let percent = max === 0 ? 0 : (votes[g] / max) * 100;
        let bar = document.getElementById("bar-" + g);
        if (bar) bar.style.width = percent + "%";
    }
}

document.getElementById("show-winners").addEventListener("click", async () => {
    let file = await getVotes();
    let votes = file.votes;

    let sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);

    let rankDiv = document.getElementById("ranking");
    rankDiv.innerHTML = sorted.map((g, i) =>
        `${i + 1} — ${g[0]} (${g[1]} نقاط)`
    ).join("<br>");
});
