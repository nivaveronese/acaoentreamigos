import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Image }
    from 'react-native';
import { AreaBotao, SubmitButton, SubmitText, RifaText } from './styles';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function VisualizarCodigoSegurancaGanhador() {
    console.log('VisualizarCodigoSegurancaGanhador')
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();

    async function sair() {
        console.log('sair')
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }]
        })
    }

    if (loading) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator
                    color='#008080'
                    size={40}
                />
            </View>
        )
    } else {
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.container}>
                        <RifaText> Codigo segurança: {route.params?.rifaDisponivel.codigoSegurancaGanhador} </RifaText>
                        <RifaText> Seu celular informado para contato: {route.params?.rifaDisponivel.celularGanhadorPremioProduto} </RifaText>
                        <AreaBotao>
                            <SubmitButton onPress={sair}>
                                <SubmitText>
                                    Ok
                                </SubmitText>
                            </SubmitButton>
                        </AreaBotao>
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    img: {
        width: 250,
        height: 450,
        resizeMode: 'stretch'
    },
}) 