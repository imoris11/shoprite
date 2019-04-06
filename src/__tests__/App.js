import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import App from '../App';

describe('Tests app mounts', () => {
   it('renders without crashing', () => {
      mount(<App />);
    });
});
