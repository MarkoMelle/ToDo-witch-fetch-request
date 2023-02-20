

export default async function fetchRequest(url, URLSearchParam, method, headers) {
   
   function handleErrors(response) {
      if (!response.ok) {
         throw Error(response.statusText);
      }
      return response;
   }
   
   const response = await fetch(url + new URLSearchParams(URLSearchParam) , { method, headers })
      .then(handleErrors)
      .then((response) =>  response.json())
      .catch((error) => console.log(error));
   return await response;
}


