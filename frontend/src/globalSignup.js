// src/globalSignup.js
if (!window.openSignupOverlay) {
  window.openSignupOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'signup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const content = document.createElement('div');
    content.style.width = '90%';
    content.style.maxWidth = '500px';
    content.style.backgroundColor = '#fff';
    content.style.padding = '2rem';
    content.style.borderRadius = '0.5rem';
    content.innerHTML =
      '<h2 class="text-2xl font-bold mb-4">Signup Form</h2><p>Insert your signup form component here</p>';

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style.marginTop = '1rem';
    closeBtn.style.padding = '0.5rem 1rem';
    closeBtn.style.backgroundColor = '#ee6983';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '0.25rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    content.appendChild(closeBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
  };
}
