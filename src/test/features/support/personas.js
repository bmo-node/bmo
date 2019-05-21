const DNACustomer = () => ({
  navigateToMainPage: () => {
    browser.url('/');
    $('.name-input').waitForExist();
  },

  enterYourName: () => {
    $('#visitor-name').waitForExist();
    $('#visitor-name').setValue('DNA Customer');
  },

});

export default { DNACustomer };
