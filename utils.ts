export const objectToQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]),
    )
    .join('&');
};
