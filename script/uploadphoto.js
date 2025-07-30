 document.addEventListener('DOMContentLoaded', function () {
  const input  = document.getElementById('photoInput');
  const preview = document.getElementById('photoPreview');
  const box    = document.getElementById('uploadBox');

  if (!input || !preview || !box) return;


  input.addEventListener('change', function () {
    const file = this.files && this.files[0];

    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      preview.onload = () => URL.revokeObjectURL(url); 
      preview.src = url;
      preview.hidden = false;
      box.classList.add('has-image');
    } else {

      preview.src = '';
      preview.hidden = true;
      box.classList.remove('has-image');
    }
  });
});
