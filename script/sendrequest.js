document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form.form');
  if (!form) return;
  const fields = {
    firstName: form.querySelector('[name="firstName"]'),
    lastName:  form.querySelector('[name="lastName"]'),
    address:   form.querySelector('[name="address"]'),
    gender:    form.querySelector('[name="gender"]'),
    age:       form.querySelector('[name="age"]'),
    type:      form.querySelector('[name="type"]'),
    size:      form.querySelector('[name="size"]'),
    color:     form.querySelector('[name="color"]'),
    status:    form.querySelector('[name="status"]'),
    photo:     form.querySelector('#photoInput')
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  const modal = document.getElementById('thankyouModal');
  const okBtn = document.getElementById('okHome');
  const HOME_URL = 'homepageiphone.html'; 
  form.setAttribute('novalidate', '');

  function trim(v){ return (v ?? '').toString().trim(); }
  function clearError(inputEl){
    const fieldWrap = inputEl.closest('.field');
    if (!fieldWrap) return;
    fieldWrap.classList.remove('invalid');
    const err = fieldWrap.querySelector('.error-text');
    if (err) err.remove();
    inputEl.setAttribute('aria-invalid', 'false');
  }

  function setError(inputEl, message){
    const fieldWrap = inputEl.closest('.field');
    if (!fieldWrap) return;
    clearError(inputEl);
    fieldWrap.classList.add('invalid');
    const msg = document.createElement('div');
    msg.className = 'error-text';
    msg.textContent = message;
    fieldWrap.appendChild(msg);
    inputEl.setAttribute('aria-invalid', 'true');
  }

  function isPositiveNumber(val){
    if (val === '' || val === null || val === undefined) return false;
    const n = Number(val);
    return Number.isFinite(n) && n > 0;
  }

  function validateAll(showErrors = false){
    let valid = true;
    if (trim(fields.firstName.value) === ''){
      valid = false;
      if (showErrors) setError(fields.firstName, 'Please enter first name.');
    } else { clearError(fields.firstName); }

    if (trim(fields.lastName.value) === ''){
      valid = false;
      if (showErrors) setError(fields.lastName, 'Please enter last name.');
    } else { clearError(fields.lastName); }
    if (trim(fields.address.value) === ''){
      valid = false;
      if (showErrors) setError(fields.address, 'Please enter address.');
    } else { clearError(fields.address); }

    if (trim(fields.gender.value) === ''){
      valid = false;
      if (showErrors) setError(fields.gender, 'Please enter gender.');
    } else { clearError(fields.gender); }

    if (!isPositiveNumber(fields.age.value)){
      valid = false;
      if (showErrors) setError(fields.age, 'Please enter a valid age (> 0).');
    } else { clearError(fields.age); }

    if (trim(fields.type.value) === ''){
      valid = false;
      if (showErrors) setError(fields.type, 'Please enter type.');
    } else { clearError(fields.type); }

    if (!isPositiveNumber(fields.size.value)){
      valid = false;
      if (showErrors) setError(fields.size, 'Please enter a valid size (> 0).');
    } else { clearError(fields.size); }

    if (trim(fields.color.value) === ''){
      valid = false;
      if (showErrors) setError(fields.color, 'Please enter color.');
    } else { clearError(fields.color); }

    if (trim(fields.status.value) === ''){
      valid = false;
      if (showErrors) setError(fields.status, 'Please enter status.');
    } else { clearError(fields.status); }

    const hasPhoto = fields.photo && fields.photo.files && fields.photo.files.length > 0;
    if (!hasPhoto){
      valid = false;
      if (showErrors) {
        const uploadField = fields.photo.closest('.upload').querySelector('.upload-box');
        if (uploadField){
          uploadField.classList.add('invalid');
          let msg = uploadField.parentElement.querySelector('.error-text');
          if (!msg){
            msg = document.createElement('div');
            msg.className = 'error-text';
            msg.textContent = 'Please upload a photo.';
            uploadField.parentElement.appendChild(msg);
          }
        }
      }
    } else {
      const uploadField = fields.photo.closest('.upload').querySelector('.upload-box');
      if (uploadField){
        uploadField.classList.remove('invalid');
        const msg = uploadField.parentElement.querySelector('.error-text');
        if (msg) msg.remove();
      }
    }

    return valid;
  }

  function updateSubmitState(){
    const ok = validateAll(false);
    if (submitBtn) submitBtn.disabled = !ok;
  }

  
  ['input','change','keyup','blur'].forEach(evt => {
    Object.values(fields).forEach(el => {
      if (!el) return;
      el.addEventListener(evt, updateSubmitState);
    });
  });

  updateSubmitState();


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = validateAll(true);
    if (!ok){
      const firstInvalid = form.querySelector('.field.invalid input, .upload .invalid');
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    if (modal){
      modal.classList.remove('hidden');
      setTimeout(() => {
        const focusable = document.getElementById('okHome') || modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable && focusable.focus) focusable.focus();
      }, 0);
    }
  });
  if (okBtn){
    okBtn.addEventListener('click', () => {
      window.location.href = 'homepageiphone.html';
    });
  }
});
