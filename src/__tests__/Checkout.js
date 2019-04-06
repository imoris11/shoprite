import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Checkout from '../Components/Checkout';

describe('Test checkout component', () => {

   it('renders without crashing', () => {
      shallow(<Checkout />);
    });

    it('renders correctly', ()=> {
      const component = shallow(<Checkout />);
      expect(component).toMatchSnapshot();
    });

});
