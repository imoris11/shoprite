import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Payment from '../Components/Checkout/Payment';

describe('Test Payment Component', () => {

   it('renders without crashing', () => {
      shallow(<Payment />);
    });

    it('renders correctly', ()=> {
      const component = shallow(<Payment />);
      expect(component).toMatchSnapshot();
    });

});
