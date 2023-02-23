export default async function fetchRequest(url, URLSearchParam, method, headers) {
  function handleErrors(response) {
    if (!response.ok) {
      return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
    }
    return response;
  }

  const response = await fetch(url + new URLSearchParams(URLSearchParam), { method, headers })
    .then(handleErrors)
    .then((res) => res.json())
    .catch((error) => Promise.reject(new Error(`${error.status}: ${error.statusText}`)));
  return response;
}
