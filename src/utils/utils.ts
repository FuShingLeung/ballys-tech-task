export const objectToQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]),
    )
    .join('&');
};

// const repos = listOfRepositories.map(mapToCustomFormat)

// function mapToCustomFormat(repository) {
//  saveToRedis
//   return your custom format;
// }

// const repositories = [];

// listOfRepositories.items.forEach((repository) => {
//   repositories.push({
//     id: repository.id,
//     full_name: repository.full_name,
//     html_url: repository.html_url,
//   });
// });
