export const getDataApi = async (url) => {
  let response = await fetch(url);
  return await response.json();
}

export const saveCustomerApi = async (url, user, token) => {
  let response = await fetch(url, {
        method:'PUT',
        body:JSON.stringify(user),
        headers:{
          'Accept':'application/json',
          'content-type':'application/json',
          'user-key': token
        }
      });
  return
}

export const updateAddressApi = async (url, address, token) => {
  let response = await fetch(url, {
        method:'PUT',
        body:JSON.stringify(address),
        headers:{
          'Accept':'application/json',
          'content-type':'application/json',
          'user-key': token
        }
      });
  return
}

export const getOrdersApi = async (url, token) => {
  let response = await fetch(url, {
    headers:{
      'user-key':token
    }
  });
  return await response.json();
}
