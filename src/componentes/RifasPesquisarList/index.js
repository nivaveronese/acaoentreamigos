import React from 'react';
import { Image, View, SafeAreaView, StyleSheet } from 'react-native';
import {
    SubmitText, RifaText, ListaRifas, AreaBotaoReservar,
    RifaTextTitulo, ContentText
} from './styles';
import { useNavigation } from '@react-navigation/native';

export default function RifasPesquisarList({ data }) {
    console.log('RifasPesquisarList');
    const navigation = useNavigation();

    function navegaReserva() {
        console.log('navegaReserva');
        //navigation.navigate('Reserva', data);
    }

    return (
        <SafeAreaView>
            <View style={styles.card}>
                <Image source={{ uri: data.imagemCapa }}
                    resizeMode={"cover"}
                    style={styles.capa}
                />
                <ListaRifas>
                    <RifaTextTitulo> {data.titulo} </RifaTextTitulo>
                    <ContentText numberOfLines={8}>
                        {data.descricao}
                    </ContentText>
                    <RifaText> Responsável: {data.nome} </RifaText>
                    <RifaText> {data.cepusuario} {data.cidade} {data.uf} {data.bairro} </RifaText>
                </ListaRifas>
                <AreaBotaoReservar onPress={navegaReserva}>
                    <SubmitText>
                    Eu quero adquirir bilhetes desta rifa
                    </SubmitText>
                </AreaBotaoReservar>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        backgroundColor: '#FFF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        margin: 15,
        shadowRadius: 5,
        borderRadius: 5,
        elevation: 3
    },
    capa: {
        width: '100%',
        height: 400,
        borderRadius: 5,
    }
})