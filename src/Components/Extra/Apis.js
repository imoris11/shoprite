export const getDepartmentsApi = async () => {
  let response = await fetch("https://backendapi.turing.com/departments");
  return await response.json();

}

export const getCategoriesApi = async () => {
  let response = await fetch("https://backendapi.turing.com/categories");
  return await response.json();
}
