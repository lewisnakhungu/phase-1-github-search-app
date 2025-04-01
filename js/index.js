document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");

    // Search for GitHub users
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            fetchUsers(query);
        }
    });

    // Fetch users from GitHub API
    function fetchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => console.error("Error fetching users:", error));
    }

    // Display user search results
    function displayUsers(users) {
        userList.innerHTML = "";
        repoList.innerHTML = ""; // Clear previous repos
        users.forEach(user => {
            const userItem = document.createElement("li");
            userItem.innerHTML = `
                <img src="${user.avatar_url}" width="50" height="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
                <button data-username="${user.login}">View Repos</button>
            `;
            userList.appendChild(userItem);

            // Add event listener to fetch repos
            userItem.querySelector("button").addEventListener("click", () => {
                fetchRepos(user.login);
            });
        });
    }

    // Fetch repositories for a selected user
    function fetchRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => displayRepos(data))
        .catch(error => console.error("Error fetching repos:", error));
    }

    // Display repositories
    function displayRepos(repos) {
        repoList.innerHTML = "";
        repos.forEach(repo => {
            const repoItem = document.createElement("li");
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            `;
            repoList.appendChild(repoItem);
        });
    }
});