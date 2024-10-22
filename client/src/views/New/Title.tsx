import styled from 'styled-components'
import TypeIt from 'typeit-react'

const WelcomeTypeIt = styled(TypeIt)`
font-weight: 400;
color: #fff;
text-align: left; 
margin-bottom: 12px;
text-transform: uppercase; 
font-size: 28px; 
@media (min-width: 768px) {
  font-size: 48px; 
}
`;


const Title: React.FC = () => {
  return (
    <>
    <WelcomeTypeIt 
        options={{
          cursorChar:" ", 
          cursorSpeed:1000000, speed: 50, 
        }}
        speed={10}
        getBeforeInit={(instance) => {
      instance

          .type("You new around here?", {speed: 50})
          ;
      return instance;
       }}> 
    </WelcomeTypeIt>
    <TypeIt 
     options={{
       cursorChar:" ", 
       cursorSpeed:1000000, speed: 75, 
     }}
     speed={10}
     getBeforeInit={(instance) => {
   instance

       .type("", {speed: 5000})
       ;
   return instance;
    }}> 
    </TypeIt>
</>
    )
}

export default Title
