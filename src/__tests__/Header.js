import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Header from '../Components/Header';

describe('Test Header Component', () => {

   it('renders without crashing', () => {
      shallow(<Header />);
    });

    it('renders correctly', ()=> {
      const header = shallow(<Header />);
      expect(header).toMatchSnapshot();
    });

});
