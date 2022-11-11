import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {  useLocation } from 'react-router-dom';



const HeaderBackground = styled.div`
margin: 0px;
background: #AB4237;
height: 100px;
width: 100%;
border-radius: 0px;
border-color: #000000;
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
display: flex;
flex-flow: column;
justify-content: center;
align-items: center;
padding: 5px 5px 5px 5px;
position: sticky;
`;

const Title = styled.p` 
color: white;
font-size: 30px;
margin: 10px 0px;
font-weight: bold;
`;

const BackButton = styled.button`
background-color: #AB4237;
color: white;
font-size: 30px;
padding: 10px 10px;
border-radius: 0px;
margin: 0px 0px;
width: 50px;
height: 50px;
text-align: center;
position: absolute;
left: 0;
border: 0px solid #AB4237;
backgroundImage:{require('./backIcon.jpeg')};
font-weight: bold;
`;




function AppHeader() {

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname)  

  const handleBackButton = () => {

    if (location.pathname === "/Messagecenter" ) 
    {
      navigate(-1);
    } else if (location.pathname === "/MessageCenterDetails") {
      navigate(-1,{ replace: false});
    } 
    else  {
      navigate("/");
    }

  }

    return (
      ///<ButtonIcon src={require('./backIcon.jpeg')}></ButtonIcon>
        <HeaderBackground>
          { location.pathname != "/" ? <BackButton disabled={location.pathname == "/"} onClick={handleBackButton}> &lt;</BackButton>: null}
          <Title>Sample App</Title>
      </HeaderBackground>
    )
  }
  
  export default AppHeader