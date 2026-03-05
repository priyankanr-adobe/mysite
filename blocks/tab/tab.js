export default function decorate(block) {
  const rows = [...block.children];
  const tabList = document.createElement('div');
  tabList.className = 'tab-list';
  const tabContentContainer = document.createElement('div');
  tabContentContainer.className = 'tab-content-container';
  rows.forEach((row, index) => {
    const columns = row.querySelectorAll(':scope > div');
    if (columns.length !== 2) return;
    const title = columns[0].textContent;
    const content = columns[1].innerHTML;
    // Create Tab Button
    const tabButton = document.createElement('button');
    tabButton.textContent = title;
    tabButton.className = 'tab-button';
    if (index === 0) tabButton.classList.add('active');
    // Create Content Panel
    const tabPanel = document.createElement('div');
    tabPanel.className = 'tab-panel';
    tabPanel.innerHTML = content;
    if (index !== 0) tabPanel.style.display = 'none';
    tabButton.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach((btn) => btn.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.style.display = 'none';
      });
      tabButton.classList.add('active');
      tabPanel.style.display = 'block';
    });
    tabList.appendChild(tabButton);
    tabContentContainer.appendChild(tabPanel);
  });
  block.innerHTML = '';
  block.appendChild(tabList);
  block.appendChild(tabContentContainer);
}
