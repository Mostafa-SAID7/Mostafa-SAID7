require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const username = process.env.GITHUB_USERNAME;
const token = process.env.GITHUB_TOKEN;

async function fetchRepos() {
  let repos = [];
  let page = 1;
  while (true) {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`, {
      headers: { Authorization: `token ${token}` }
    });
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    repos = repos.concat(data);
    page++;
  }
  return repos;
}

async function fetchCommits(repo) {
  let commits = [];
  let page = 1;
  while (true) {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=100&page=${page}`, {
      headers: { Authorization: `token ${token}` }
    });
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    commits = commits.concat(data);
    page++;
  }
  return commits;
}

app.get('/api/commits', async (req, res) => {
  try {
    const repos = await fetchRepos();
    const commitDatesCount = {};

    for (const repo of repos) {
      const commits = await fetchCommits(repo.name);
      commits.forEach(commit => {
        const date = commit.commit.author.date.split('T')[0];
        commitDatesCount[date] = (commitDatesCount[date] || 0) + 1;
      });
    }

    const today = new Date();
    const last30days = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last30days.push({ date: dateStr, count: commitDatesCount[dateStr] || 0 });
    }

    res.json(last30days);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
