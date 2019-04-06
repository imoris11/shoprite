export const getTaxApi = async (url) => {
  let response = await fetch(url);
  return await response.json();
}

export const makeOrderApi = async (url, data, token) => {
  let response = await fetch(url, {
    method:'POST',
    body: JSON.stringify(data),
    headers:{
      'Accept':'application/json',
      'content-type':'application/json',
      'user-key':token
    }
  });
  return await response.json();
}

export const chargeOrderApi = async (url, data) => {
  let response = await fetch(url, {
    method:'POST',
    headers:{
      'content-type':'application/json',
      'Accept':'application/json',
    },
    body:JSON.stringify(data)
  });
  return;
}
