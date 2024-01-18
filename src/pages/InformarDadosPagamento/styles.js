import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #FFFFFF;
    align-items: center;
 `;
export const Input = styled.TextInput`
width: 100%;
border-width: 1px;
border-color: #D3D3D3;    
font-size: 15px;
margin-bottom: 2px;
padding: 5px;
border-radius: 5px;
color: #333;
font-family: Roboto;
`;
export const InputAno = styled.TextInput`
    width: 35%;
    border-width: 1px;
    border-color: #D3D3D3;    
    font-size: 15px;
    margin-bottom: 2px;
    padding: 5px;
    border-radius: 5px;
    color: #333;
    font-family: Roboto;
`;
export const AreaBotao = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #FFFFFF;
    margin-top: 10px;
`;
export const AreaBotao1 = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    margin-top: 10px;
`;
export const SubmitButton = styled.TouchableOpacity`
    height: 40px;
    width: 45%;
    align-items: center;
    justify-content: center;
    background-color: #008080;
    border-radius: 5px;
`; 
export const SubmitButton1 = styled.TouchableOpacity`
    height: 40px;
    width: 65%;
    align-items: center;
    justify-content: center;
    background-color: #008080;
    border-radius: 5px;
`; 
export const SubmitText = styled.Text`
    font-size: 15px;
    font-weight: bold;
    color: #FFFFFF;
    font-family: Roboto;
`;
export const Texto = styled.Text`
    font-size: 10px;
    font-weight: bold;
    color: #008080;
    font-family: Roboto;
    font-style: italic;
    margin-left: 5px;
    margin-top: 5px;
`;