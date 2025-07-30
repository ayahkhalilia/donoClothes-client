    function goToDonationPage(request) {
      window.location.href = `donationDetails.html?request=${request}`;
    }
    const params = new URLSearchParams(window.location.search);
    const requestType = params.get('request');

