/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './home.css';
import React, { useState } from 'react';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function Home(props){
  const [enteredUsername, setEnteredUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    props.handleUserSubmit(enteredUsername);
    navigate('/courses');
    props.setkey('2');
  
  };
  const resetUser = () => {
    props.handleUserSubmit('');
  };


  return (
      <div style={{height:"100vh",background:"white"}}>
        <div className='input'>
          <h1>Welcome to our experiment!</h1>
          {
            props.username === '' && (
              <>
                <p className="paragraph">This is a demo page, so there is no real login system.</p>
                <p className="paragraph">Please enter your user name. Just a few letters are ok :)</p>
                <Input
                  placeholder="Enter your username"
                  value={enteredUsername}
                  onChange={(e) => setEnteredUsername(e.target.value)}
                
                  className="username-input"
                />
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
              </>
            )
          }
          {
            props.username !== '' && (
              <>
              

              <h3 className="paragraph"> Hi, {props.username} ! You have logged in.</h3>
              <p > If you want to change account, please click the button to reset.</p>
              <Button variant="contained" onClick={resetUser}>Reset</Button>
            
                
              </>
            )
          }
          </div>
      </div>
        
  
   
   
  );
}

export default Home;