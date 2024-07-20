const LOCAL_ENDPOINT = `http://localhost:8000`;

const output = document.querySelector('#output');
const form = document.querySelector(
  '#search-repositories-form',
) as HTMLFormElement;

interface Repository {
  name: string;
  id: number;
}

const fetchRepositories = async (e: Event): Promise<void | string> => {
  e.preventDefault();
  if (!form || !output) return;

  const formData = new FormData(form);

  const name = formData.get('name') as string;
  const id = formData.get('id') as string;

  if (!name && !id) {
    output.innerHTML = 'Please enter a search criteria';
    return 'Please enter a search a criteria';
  } else if (!id) {
    const res = await fetch(`${LOCAL_ENDPOINT}/api/repositories?name=${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.github+json',
      },
    });

    const data = await res.json();
    const repositories: Repository[] = data.items;
    output.innerHTML = '';

    if (repositories.length > 0) {
      repositories.forEach((repository) => {
        const repositoryEl = document.createElement('div');
        repositoryEl.textContent = `${repository.name}, ${repository.id}`;
        output.appendChild(repositoryEl);
      });
    } else {
      output.innerHTML = `There are no repositories with the name ${name}`;
    }
  } else if (!name) {
    const res = await fetch(
      `${LOCAL_ENDPOINT}/api/repositorydetails?id=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.github+json',
        },
      },
    );

    const data = await res.json();
    output.innerHTML = '';

    if (data.message === 'Not Found') {
      output.innerHTML = `There are no repository with the id ${id}`;
    } else {
      const repositoryEl = document.createElement('div');
      repositoryEl.textContent = `${data.name}, ${data.id}`;
      output.appendChild(repositoryEl);
    }
  }
};

// Event listeners
if (form) {
  form.addEventListener('submit', fetchRepositories);
}