import React, { Component } from 'react';
import auth from './../services/authservice';
class Logout extends Component {
    componentDidMount(){
        auth.logout();
        window.location = '/';
    }
    render() { 
        return null;
    }
}
 
export default Logout;