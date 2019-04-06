import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Home from '../Components/Home';

describe('Test Home Component', () => {

   it('renders without crashing', () => {
      shallow(<Home />);
    });

    it('renders correctly', ()=> {
      const component = shallow(<Home />);
      expect(component).toMatchSnapshot();
    });

});
