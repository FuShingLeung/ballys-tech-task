import { Repository } from '../../src/interfaces/interfaces';

const LOCAL_ENDPOINT = `http://localhost:8000`;

const output = document.querySelector('#output');
const form = document.querySelector(
  '#search-repositories-form',
) as HTMLFormElement;

const fetchRepositories = async (e: Event): Promise<void | string> => {
  e.preventDefault();
  if (!form || !output) return;

  const formData = new FormData(form);

  const name = formData.get('name') as string;
  const id = formData.get('id') as string;

  if (!name && !id) {
    output.innerHTML = 'Please enter a search criteria';
    return 'Please enter a search a criteria';
  }

  let url = '';
  if (!id) {
    url = `${LOCAL_ENDPOINT}/api/repositories?name=${name}`;
  } else {
    url = `${LOCAL_ENDPOINT}/api/repositorydetails?id=${id}`;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.github+json',
    },
  });

  const data = await res.json();
  // const repositories: Repository[] = data.items;
  output.innerHTML = '';

  if (data.items && data.items.length > 0) {
    data.forEach((repository: Repository) => {
      const repositoryEl = document.createElement('div');
      repositoryEl.textContent = `${repository.name}, ${repository.id}`;
      output.appendChild(repositoryEl);
    });
  } else if (data.message === 'Not Found') {
    output.innerHTML = `There are no repositories with the ${
      id ? `id ${id}` : `name ${name}`
    }`;
  } else {
    const repositoryEl = document.createElement('div');
    repositoryEl.textContent = `${data.name}, ${data.id}`;
    output.appendChild(repositoryEl);
  }
};

// Event listeners
if (form) {
  form.addEventListener('submit', fetchRepositories);
}
