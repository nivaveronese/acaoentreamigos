import styled from 'styled-components/native';

export const Background = styled.SafeAreaView`
    flex: 1;
    background-color: #FFFFFF;
`;
export const ContainerPesquisa = styled.View`
    flex-direction: row;   
    margin-top: 5px;
    margin-bottom: 5px;
`;
export const AreaBotaoPesquisa = styled.TouchableOpacity`
`;
export const AreaPesquisa = styled.View`
    flex-direction: row;
    margin-top: 5px;
    margin-left: 10px;
`; 
export const Input = styled.TextInput`
    width: 90%;
    height: 35px;
    border-width: 1px;
    border-color: #D3D3D3;    
    font-size: 15px;
    margin-bottom: 1px;
    border-radius: 5px;
    color: #333;
    font-family: Roboto;
    margin-left: 1px;
    padding: 5px;
`;
export const TextoArg= styled.Text`
        font-size: 15px; 
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 10px;
        color: #333;
        font-family: Roboto;
`; 
export const TextoMensagemCadastro= styled.Text`
        font-size: 12px; 
        margin-left: 10px;
        color: #FF0000;
        font-family: Roboto;
`;  
export const Loading = styled.ActivityIndicator.attrs({
    size: 'small',
    color: '#999'
  })`
    margin: 30px 0;
  `;