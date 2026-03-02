export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;
 
  const response = await fetch(link.href);
  const data = await response.json();
 
  const form = document.createElement('form');
  form.classList.add('dynamic-form');
 
  data.data.forEach((field) => {
    if (!field.Type) return;
 
    // Submit button
    if (field.Type.toLowerCase() === 'submit') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = field.Label;
      form.appendChild(button);
      return;
    }
 
    const wrapper = document.createElement('div');
    wrapper.classList.add('form-group');
 
    const label = document.createElement('label');
    label.textContent = field.Label;
 
    let input;
 
    if (field.Type.toLowerCase() === 'message') {
      input = document.createElement('textarea');
    } else {
      input = document.createElement('input');
      input.type = field.Type.toLowerCase() === 'mobile' ? 'tel' : field.Type.toLowerCase();
    }
 
    input.name = field.Name;
    input.placeholder = field.placeholder || '';
 
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    form.appendChild(wrapper);
  });
 
  block.innerHTML = '';
  block.appendChild(form);
}