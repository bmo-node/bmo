/* eslint-disable prefer-arrow-callback, func-names */
import { When } from 'cucumber';

When(
  /^I go to the front page of the application$/,
  function () { this.persona.navigateToMainPage(); },
);

When(
  /^I enter my name$/,
  function () { this.persona.enterYourName(); },
);
