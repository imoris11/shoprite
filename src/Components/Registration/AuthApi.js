export const loginApi = async (url, data) => {
  let response = await fetch(url, {
    method:'POST',
    body: JSON.stringify(data),
    headers:{'content-type': 'application/json'}
  })
  let result =  await response.json();
  if (result.error) {
      return result;
    }else{
      localStorage.setItem('token', result.accessToken);
      localStorage.setItem('customer_id', result.user.customer_id)
      result.user.firstName = result.user.name.split(" ")[0];
      result.user.lastName = result.user.name.split(" ")[1];
      localStorage.setItem('customer', JSON.stringify(result.user));
      window.location.reload();
    }
}

export const registerApi = async (url, data) => {
  let response = await fetch(url, {
    method:'POST',
    body: JSON.stringify(data),
    headers:{'content-type': 'application/json'}
    })
  let result = await response.json();
  if (result.error){
    return result;
  }else{
    localStorage.setItem('token', result.accessToken);
    localStorage.setItem('customer_id', result.customer.customer_id)
    result.customer.firstName = result.customer.name.split(" ")[0];
    result.customer.lastName = result.customer.name.split(" ")[1];
    localStorage.setItem('customer', JSON.stringify(result.customer));
    window.location.reload();
  }
}
