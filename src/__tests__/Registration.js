import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Registration from '../Components/Registration';
import Register from '../Components/Registration/Register';
import SignIn from '../Components/Registration/SignIn';
describe('Test Registration Component', () => {

   it('renders without crashing', () => {
      shallow(<Registration showDialog={true} handleClose={()=>console.log("Here")} />);
    });

    it('renders correctly', ()=> {
      const component = shallow(<Registration showDialog={true} handleClose={()=>console.log("Here")} />);
      expect(component).toMatchSnapshot();
    });

    it('shows register form button', ()=>{
       mount(<Register />);
    });

    it('shows signin form button', ()=>{
       mount(<SignIn />);
    });
});
