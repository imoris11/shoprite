export const searcApi = async (url, page) =>{
  let response = await fetch(url+'&page='+page);
  let results = await response.json();
  let products = []
  for (let i=0; i<results.rows.length; i++) {
    let attributeResponse = await fetch('https://backendapi.turing.com/attributes/inProduct/'+results.rows[i].product_id);
    let attributes = await attributeResponse.json();
    let sizes = attributes.filter((att => att.attribute_name === 'Size'));
    let colors = attributes.filter((att => att.attribute_name === 'Color'));
    let item = results.rows[i];
    item['sizes'] = sizes;
    item['colors'] = colors;
    products.push(item);
  }
  return {products:products, count:results.count};
}
