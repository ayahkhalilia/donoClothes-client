    function goToDonationPage(request) {
      window.location.href = `donationDetails.html?request=${request}`;
    }
    const params = new URLSearchParams(window.location.search);
    const requestType = params.get('request');

   document.addEventListener('DOMContentLoaded', () => {
  const addRequestBtn = document.querySelector('.floating-btn');
  if (!addRequestBtn) return;

  addRequestBtn.addEventListener('click', (e) => {
    e.preventDefault();

    window.location.href = 'donationform.html';
  });
});
 
