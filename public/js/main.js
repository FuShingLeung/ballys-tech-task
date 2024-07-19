const LOCAL_ENDPOINT = `http://localhost:8000`;

const output = document.querySelector('#output');
const form = document.querySelector('#search-repositories-form');

const fetchRepositories = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');

  const res = await fetch(`${LOCAL_ENDPOINT}/api/repositories?name=${name}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
    },
  });

  const data = await res.json();
  const repositories = data.items;
  output.innerHTML = '';

  if (repositories.length > 0) {
    repositories.forEach((repository) => {
      const repositoryEl = document.createElement('div');
      repositoryEl.textContent = repository.name;
      output.appendChild(repositoryEl);
    });
  } else {
    output.innerHTML = `There are no repositories with the name ${name}`;
  }
};

// Event listeners
form.addEventListener('submit', fetchRepositories);
