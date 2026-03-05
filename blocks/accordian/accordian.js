export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    const columns = row.querySelectorAll(':scope > div');
    if (columns.length === 2) {
      const header = columns[0];
      const content = columns[1];
      header.classList.add('accordion-header');
      content.classList.add('accordion-content');
      content.style.display = 'none'; 
      header.addEventListener('click', () => {
        const isOpen = content.style.display === 'block';
        // close all
        block.querySelectorAll('.accordion-content').forEach((c) => {
          c.style.display = 'none';
        });
        // open current
        content.style.display = isOpen ? 'none' : 'block';
      });
    }
  });
}