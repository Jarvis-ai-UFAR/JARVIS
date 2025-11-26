// auth.js — super simple demo auth with localStorage (NOT for real production)

const USERS_KEY = 'jarwis_users';
const CURRENT_USER_KEY = 'jarwis_current_user';

// --- Helpers ---

function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Could not parse users from localStorage', e);
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,   // ⚠️ stored in plain text – demo only
    createdAt: user.createdAt
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
}

function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Could not parse current user', e);
    return null;
  }
}

// --- Core actions ---

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
  }
}

function jarvisLogout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = 'login.html';
}

// expose for inline buttons
window.logout = jarvisLogout;
window.goToProfile = function () {
  window.location.href = 'profile.html';
};

// Registration
function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regPasswordConfirm').value;
  const msg = document.getElementById('authMessage');

  if (!name || !email || !password || !confirm) {
    if (msg) {
      msg.textContent = 'Լրացրու բոլոր դաշտերը։';
      msg.style.color = 'salmon';
    }
    return;
  }

  if (password !== confirm) {
    if (msg) {
      msg.textContent = 'Գաղտնաբառերը տարբեր են։';
      msg.style.color = 'salmon';
    }
    return;
  }

  if (password.length < 6) {
    if (msg) {
      msg.textContent = 'Գաղտնաբառը պետք է լինի առնվազն 6 նշան։';
      msg.style.color = 'salmon';
    }
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    if (msg) {
      msg.textContent = 'Այս email-ով օգտատեր արդեն կա։';
      msg.style.color = 'salmon';
    }
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  if (msg) {
    msg.textContent = 'Գրանցումը հաջողվեց, տեղափոխվում ես դեշբորդ։';
    msg.style.color = '#4ade80';
  }

  setTimeout(() => {
    window.location.href = 'jarwis.html';
  }, 700);
}

// Login
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('logEmail').value.trim().toLowerCase();
  const password = document.getElementById('logPassword').value;
  const msg = document.getElementById('authMessage');

  if (!email || !password) {
    if (msg) {
      msg.textContent = 'Լրացրու email-ը և գաղտնաբառը։';
      msg.style.color = 'salmon';
    }
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    if (msg) {
      msg.textContent = 'Սխալ email կամ գաղտնաբառ։';
      msg.style.color = 'salmon';
    }
    return;
  }

  setCurrentUser(user);

  if (msg) {
    msg.textContent = 'Մուտքը հաջողվեց, տեղափոխվում ես դեշբորդ։';
    msg.style.color = '#4ade80';
  }

  setTimeout(() => {
    window.location.href = 'jarwis.html';
  }, 700);
}

// --- DOM wiring: runs on every page that includes auth.js ---

document.addEventListener('DOMContentLoaded', function () {
  // Protect pages with data-protected="true"
  if (document.body && document.body.dataset.protected === 'true') {
    requireAuth();
  }

  const currentUser = getCurrentUser();

  // Register / login forms
  const regForm = document.getElementById('registerForm');
  if (regForm) regForm.addEventListener('submit', handleRegister);

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Logout elements
  document.querySelectorAll('[data-logout]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      jarvisLogout();
    });
  });

  // Show user name / email if placeholders exist
  const nameSpan = document.querySelector('[data-current-user-name]');
  const emailSpan = document.querySelector('[data-current-user-email]');
  if (currentUser) {
    if (nameSpan) nameSpan.textContent = currentUser.name || currentUser.email;
    if (emailSpan) emailSpan.textContent = currentUser.email;
  }

  // ----- PROFILE PAGE -----
  const profileNameInput = document.getElementById('profileName');
  const profileEmailInput = document.getElementById('profileEmail');
  const createdAtSpan = document.getElementById('userCreatedAt');
  const profileInfoForm = document.getElementById('profileInfoForm');
  const profileMessage = document.getElementById('profileMessage');

  const passwordForm = document.getElementById('passwordForm');
  const pwdCurrent = document.getElementById('currentPassword');
  const pwdNew = document.getElementById('newPassword');
  const pwdConfirm = document.getElementById('confirmNewPassword');
  const passwordMessage = document.getElementById('passwordMessage');

  // Fill profile info
  if (profileNameInput && profileEmailInput && currentUser) {
    profileNameInput.value = currentUser.name || '';
    profileEmailInput.value = currentUser.email || '';
    if (createdAtSpan && currentUser.createdAt) {
      try {
        const dt = new Date(currentUser.createdAt);
        createdAtSpan.textContent = dt.toLocaleString();
      } catch (e) {
        createdAtSpan.textContent = currentUser.createdAt;
      }
    }
  }

  // Save profile (name)
  if (profileInfoForm) {
    profileInfoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const user = getCurrentUser();
      if (!user) {
        requireAuth();
        return;
      }

      const newName = profileNameInput.value.trim();
      if (!newName) {
        if (profileMessage) {
          profileMessage.textContent = 'Անունը չի կարող դատարկ լինել։';
          profileMessage.style.color = 'salmon';
        }
        return;
      }

      const users = getUsers();
      const idx = users.findIndex(u => u.email === user.email);
      if (idx === -1) {
        if (profileMessage) {
          profileMessage.textContent = 'Օգտատերը չի գտնվել։';
          profileMessage.style.color = 'salmon';
        }
        return;
      }

      users[idx].name = newName;
      saveUsers(users);
      setCurrentUser(users[idx]);

      if (profileMessage) {
        profileMessage.textContent = 'Պրոֆիլը թարմացվեց։';
        profileMessage.style.color = '#4ade80';
      }
    });
  }

  // Change password
  if (passwordForm) {
    passwordForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const user = getCurrentUser();
      if (!user) {
        requireAuth();
        return;
      }

      const current = pwdCurrent.value;
      const next = pwdNew.value;
      const confirm = pwdConfirm.value;

      if (!current || !next || !confirm) {
        if (passwordMessage) {
          passwordMessage.textContent = 'Լրացրու բոլոր դաշտերը։';
          passwordMessage.style.color = 'salmon';
        }
        return;
      }

      if (current !== user.password) {
        if (passwordMessage) {
          passwordMessage.textContent = 'Սխալ ընթացիկ գաղտնաբառ։';
          passwordMessage.style.color = 'salmon';
        }
        return;
      }

      if (next.length < 6) {
        if (passwordMessage) {
          passwordMessage.textContent = 'Նոր գաղտնաբառը պետք է լինի առնվազն 6 նշան։';
          passwordMessage.style.color = 'salmon';
        }
        return;
      }

      if (next !== confirm) {
        if (passwordMessage) {
          passwordMessage.textContent = 'Գաղտնաբառերը տարբեր են։';
          passwordMessage.style.color = 'salmon';
        }
        return;
      }

      const users = getUsers();
      const idx = users.findIndex(u => u.email === user.email);
      if (idx === -1) {
        if (passwordMessage) {
          passwordMessage.textContent = 'Օգտատերը չի գտնվել։';
          passwordMessage.style.color = 'salmon';
        }
        return;
      }

      users[idx].password = next;
      saveUsers(users);
      setCurrentUser(users[idx]);

      pwdCurrent.value = '';
      pwdNew.value = '';
      pwdConfirm.value = '';

      if (passwordMessage) {
        passwordMessage.textContent = 'Գաղտնաբառը հաջողությամբ փոխվեց։';
        passwordMessage.style.color = '#4ade80';
      }
    });
  }
});
