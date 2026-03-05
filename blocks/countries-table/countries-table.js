export default async function decorate(block) {
  const url = block.querySelector('a')?.href || block.textContent.trim();
  const resp = await fetch(url);
  const json = await resp.json();
  const table = document.createElement('table');
  table.classList.add('countries-table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Country</th>
      <th>Capital</th>
      <th>Continent</th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  json.data.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.Country}</td>
      <td>${row.Capital}</td>
      <td>${row.Continent}</td>
    `;
    tbody.appendChild(tr);
  });
  table.append(thead, tbody);
  block.innerHTML = '';
  block.appendChild(table);
}
