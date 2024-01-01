import styled from 'styled-components/native';
 
export const Background = styled.SafeAreaView`
    flex: 1;
    background-color: #FFFFFF;
`;
export const Loading = styled.ActivityIndicator.attrs({
    size: 'small',
    color: '#999'
  })`
    margin: 30px 0;
  `;