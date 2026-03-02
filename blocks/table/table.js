export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const url = link.href;

  const response = await fetch(url);
  const json = await response.json();

  const data = json.data;

  // Clear block
  block.innerHTML = '';

  // Create table
  const table = document.createElement('table');
  table.className = 'country-table';

  // Create header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  Object.keys(data[0]).forEach((key) => {
    const th = document.createElement('th');
    th.textContent = key.toUpperCase();
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create body
  const tbody = document.createElement('tbody');

  data.forEach((row) => {
    const tr = document.createElement('tr');

    Object.values(row).forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  block.appendChild(table);
}