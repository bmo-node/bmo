/* eslint-disable prefer-arrow-callback, func-names */
import { Given } from 'cucumber';
import Personas from '../support/personas';

Given(/^I am a "(\w+)"$/, function (persona) {
  // by default wait 10s before giving up on locating an element
  browser.timeouts('implicit', 10000);

  this.persona = Personas[persona](this);
  this.persona.world = this;
  this.persona.navigateToMainPage();
});
