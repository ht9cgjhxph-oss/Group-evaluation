const username = "AishaAlmutairi";
const repo = "class-evaluation";
const filePath = "results.json";

async function getFile() {
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`);
    const data = await response.json();
    return data;
}

async function updateVotes(votes, sha) {
    await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer YOUR_TOKEN_HERE",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "update votes",
            content: btoa(JSON.stringify(votes)),
            sha: sha
        })
    });
}

document.querySelectorAll(".vote-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        let group = btn.dataset.group;

        let file = await getFile();
        let votes = JSON.parse(atob(file.content));

        votes[group]++;

        let sha = file.sha;
        await updateVotes(votes, sha);

        updateBars(votes);
    });
});

function updateBars(votes) {
    for (let g in votes) {
        let percent = (votes[g] / Math.max(...Object.values(votes))) * 100;
        document.getElementById("bar-" + g).style.width = percent + "%";
    }
}

document.getElementById("show-winners").addEventListener("click", async () => {
    let file = await getFile();
    let votes = JSON.parse(atob(file.content));

    let sorted = Object.entries(votes).sort((a,b) => b[1] - a[1]);

    let rankDiv = document.getElementById("ranking");
    rankDiv.innerHTML = sorted.map((g,i) =>
        `${i+1} — ${g[0]} (${g[1]} نقاط)`
    ).join("<br>");
});