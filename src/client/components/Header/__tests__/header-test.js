import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import HeaderComponent from '../Header';

describe('Header', () => {
  it('Correctly renders the header', () => {
    const visitorName = 'test-name';
    const headerWrapper = shallow(<HeaderComponent visitorName={visitorName} />);

    // Check that the text renders correctly
    expect(headerWrapper.text()).to.equal(`Welcome to DNA, ${visitorName}!`);

    // Check that we render an header, img, and h1
    expect(headerWrapper.find('img').length).to.equal(1);
    expect(headerWrapper.find('h1').length).to.equal(1);
    expect(headerWrapper.find('header').length).to.equal(1);

    // Check that the image returns an alt
    expect(headerWrapper.find('.app-logo').props().alt).to.equal('logo');
  });
});
