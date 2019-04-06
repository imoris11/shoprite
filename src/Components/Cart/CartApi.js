export const createCartIdApi = async (url) => {
  let response = await fetch(url);
  return await response.json();
}

export const addItemToCartApi = async (url, data) => {
  let response = await fetch(url, {
    method:'POST',
    body:JSON.stringify(data),
    headers:{
      'Accept':'application/json',
      'content-type':'application/json'
    }
  });
  return await response.json();
}
