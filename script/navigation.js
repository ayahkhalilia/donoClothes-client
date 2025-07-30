
function getRoleFromToken() {
  try {
    const t = getToken();  
    const payload = JSON.parse(atob(t.split('.')[1]));
    return payload.role || null;     
  } catch (e) {
    return null;
  }
}

function homeRouteByRole() {
  const role = getRoleFromToken();
  return role === 'worker' ? 'homepage.html' : 'homepageiphone.html';
}

function navigate(page) {
  let base;
  switch (page) {
    case 'home':     base = homeRouteByRole();      break;
    case 'donate':   base = 'donatephone.html';     break;
    case 'history':  base = 'historyphone.html';    break;
    case 'requests': base = 'requestsphone.html';   break;
    default:         base = homeRouteByRole();
  }
  window.location.href = withToken(base);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#sidebar .nav-links a').forEach(a => {
    const raw = a.getAttribute('href');
    if (!raw || raw === '#' || raw.startsWith('http') || raw.startsWith('mailto:')) return;
    const isHome = a.textContent.trim().toLowerCase().startsWith('home');
    if (isHome) {
      a.addEventListener('click', e => {
        e.preventDefault();
        navigate('home');
      });
    } else {
      a.setAttribute('href', withToken(raw));
    }
  });
  const homeBtns = document.querySelectorAll('[data-go-home="true"]');
  homeBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      navigate('home');
    });
  });
});

window.navigate = navigate;

