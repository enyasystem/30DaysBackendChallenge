// Small app.js for UX: show password toggle, client validation, and entrance animations
document.addEventListener('DOMContentLoaded', function(){
  // entrance animation
  document.querySelectorAll('.fade-in').forEach(function(el, i){
    el.style.animationDelay = (i*80) + 'ms';
  });

  // show password toggles
  Array.from(document.querySelectorAll('.toggle-password')).forEach(function(btn){
    btn.addEventListener('click', function(e){
      var target = document.getElementById(btn.dataset.target);
      if (!target) return;
      if (target.type === 'password'){
        target.type = 'text';
        btn.textContent = 'Hide';
        btn.setAttribute('aria-pressed','true');
      } else {
        target.type = 'password';
        btn.textContent = 'Show';
        btn.setAttribute('aria-pressed','false');
      }
      target.focus();
    });
  });

  // simple client-side validation
  Array.from(document.querySelectorAll('form[data-validate="true"]')).forEach(function(form){
    form.addEventListener('submit', function(e){
      var valid = true;
      var errMsg = '';
      var pwd = form.querySelector('input[name="password"]');
      var confirm = form.querySelector('input[name="confirm"]');
      var username = form.querySelector('input[name="username"]');
      if (username && username.value.trim().length < 3){
        valid = false; errMsg = 'Username must be at least 3 characters.';
      }
      if (valid && pwd){
        if (pwd.value.length < 6){ valid = false; errMsg = 'Password must be at least 6 characters.'; }
      }
      if (valid && confirm){
        if (pwd.value !== confirm.value){ valid = false; errMsg = 'Passwords do not match.'; }
      }
      if (!valid){
        e.preventDefault();
        var errEl = form.querySelector('.form-error');
        if (errEl){ errEl.textContent = errMsg; errEl.style.display='block'; errEl.focus(); }
      }
    });
  });

  // skip link focus helper
  var skip = document.querySelector('.skip-link');
  if (skip){
    skip.addEventListener('click', function(e){
      var target = document.querySelector(skip.getAttribute('href'));
      if (target){ e.preventDefault(); target.tabIndex = -1; target.focus(); }
    });
  }

  // theme toggler
  var themeBtn = document.querySelector('.theme-toggle');
  function applyTheme(name){
    if (name === 'light'){
      document.documentElement.classList.add('light');
      themeBtn && themeBtn.setAttribute('aria-pressed','true');
    } else {
      document.documentElement.classList.remove('light');
      themeBtn && themeBtn.setAttribute('aria-pressed','false');
    }
  }
  // read saved
  var saved = localStorage.getItem('theme');
  if (saved) applyTheme(saved);
  if (themeBtn){
    themeBtn.addEventListener('click', function(){
      var isLight = document.documentElement.classList.contains('light');
      var next = isLight ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }
});
