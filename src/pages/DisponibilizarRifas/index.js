import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native';
import { Texto, TextoNome, AreaBotao, SubmitButtonPremio, SubmitButtonPix, 
         SubmitTextPremio, SubmitTextPix } from './styles';
import estilos from '../../estilos/estilos';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';

export default function DisponibilizarRifas() {
    console.log('DisponibilizarRifas');
    const { user: usuario } = useContext(AuthContext);
    const navigation = useNavigation();

    async function sortearPremio() {
        console.log('sortearPremio')
        navigation.navigate('DisponibilizarRifasPremio');
    }
 
    async function sortearPix() {
        console.log('sortearPix')
        navigation.navigate('DisponibilizarRifasPix');
    }

    return (
        <SafeAreaView style={estilos.safeArea}>
            <TextoNome>{usuario.nome},</TextoNome>
            <Texto> </Texto>
            <Texto>
                O que voce vai sortear nesta rifa?
            </Texto>
            <Texto> </Texto>
            <AreaBotao>
                <SubmitButtonPremio onPress={sortearPremio}>
                    <SubmitTextPremio>
                        Prêmio
                    </SubmitTextPremio>
                </SubmitButtonPremio>
                <Texto> </Texto>
                <SubmitButtonPix onPress={sortearPix}>
                    <SubmitTextPix>
                        Pix
                    </SubmitTextPix>
                </SubmitButtonPix>
            </AreaBotao>
        </SafeAreaView>
    );
}
