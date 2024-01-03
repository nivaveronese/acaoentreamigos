import styled from 'styled-components/native';
  
export const Container = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
`;
export const ListaRifas = styled.View`
    margin-left: 5px;
    align-items: flex-start;
`;
export const RifaTextTitulo = styled.Text`
    font-size: 15px;
    font-weight: bold; 
    font-family: roboto;
    color: #000;
`;
export const RifaText = styled.Text`
    font-size: 13px;
    font-family: roboto;
    color: #000;
`;
export const TextRecebe = styled.Text`
    font-size: 15px;
    color: #000;
    font-family: roboto;
`;
export const AreaBotaoConfirmarRecebimento = styled.TouchableOpacity`
    margin-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
`; 
export const ContentText = styled.Text`
    font-size: 13px;
    margin-left: 15px;
    font-style: italic;
    font-family: roboto;
    color: #000;
`; 