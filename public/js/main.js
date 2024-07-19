// const { GITHUB_ENDPOINT, GITHUB_API_TOKEN } = process.env;
// const GITHUB_ENDPOINT = process.env.GITHUB_ENDPOINT;
// const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

const GITHUB_ENDPOINT = 'https://api.github.com';

const output = document.querySelector('#output');
const form = document.querySelector('#search-repositories-form');

const fetchRepositories = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');
  try {
    const res = await fetch(
      `${GITHUB_ENDPOINT}/search/repositories?q=${name}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.github+json',
        },
      },
    );

    if (!res.ok) {
      throw new Error(`The repository with the name ${name} does not exist`);
    }

    const data = await res.json();
    const repositories = data.items;
    output.innerHTML = '';

    repositories.forEach((repository) => {
      const repositoryEl = document.createElement('div');
      repositoryEl.textContent = repository.name;
      output.appendChild(repositoryEl);
    });
  } catch (error) {
    console.log('Error fetching repositories');
  }
};

// Event listeners
form.addEventListener('submit', fetchRepositories);
