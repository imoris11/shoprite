import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Products from '../Components/Products';

describe('Test Header Component', () => {

   it('renders without crashing', () => {
      shallow(<Products />);
    });

    it('renders correctly', ()=> {
      const component = shallow(<Products />);
      expect(component).toMatchSnapshot();
    });

});
