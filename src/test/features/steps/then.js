/* eslint-disable prefer-arrow-callback, func-names */
import { expect } from 'chai';
import { Then } from 'cucumber';

Then(
  /^I am prompted for my name$/,
  function () {
    expect($('#visitor-name').isExisting()).to.equal(true, "visitor name input field doesn't exist");
  },
);

Then(
  /^My name is displayed in the main message$/,
  function () {
    expect($('#id-message').getText()).to.include('DNA Customer');
  },
);
