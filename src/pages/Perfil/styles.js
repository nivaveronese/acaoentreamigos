import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #FFFFFF;
    align-items: center;
 `;

export const Nome = styled.Text`
    font-size: 17px;
    margin-top: 5px;
    margin-bottom: 5px;
    color: #000;
    margin-left: 15px;
    font-family: Roboto;
`; 
export const AreaPerfil = styled.View`
    margin-top: 20px;
    justify-content: center;
    align-items: center;
 `;
export const AreaBotao = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    margin-top: 20px;
    margin-right: 30px;
`;
export const SubmitButton = styled.TouchableOpacity`
    height: 40px;
    width: 80%;
    align-items: center;
    justify-content: center;
    background-color: #008080;
    border-radius: 5px;
`; 
export const SubmitText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #FFFFFF;
    font-family: Roboto;
`;
export const AreaAvatar= styled.View`
    align-items: center;
    justify-content: center;
    width: 350px;
    height: 100px;
    margin-top: 50px;
`; 
export const Texto = styled.Text`
    font-size: 12px;
    font-weight: bold;
    color: #008080;
    font-family: Roboto;
    font-style: italic;
    margin-left: 20px;
    margin-top: 15px;
`;
export const Sugestoes = styled.Text`
    font-size: 15px;
    margin-top: 25px;
    margin-bottom: 5px;
    color: #000;
    margin-left: 15px;
    font-family: Roboto;

`;