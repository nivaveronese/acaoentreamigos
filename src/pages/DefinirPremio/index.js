import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image }
    from 'react-native';
import estilos from '../../estilos/estilos';
import { 
    AreaBotao, Texto,
    RifaTextTitulo, RifaText, SubmitButton, SubmitText, AreaRifa,
    ContentText
} from './styles';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { gravaConfirmacaoPremio } from '../../servicos/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DefinirPremio() {
    console.log('DefinirPremio')
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);
    const [premioDefinido,setPremioDefinido] = useState(false)
    const route = useRoute();
    const navigation = useNavigation();

    const confirmarPremio = () => {
        console.log('confirmarPremio');
        Alert.alert(
            "Olá,",
            "Você confirma o sorteio do premio?",
            [
                {
                    text: "Hum, ainda não. Vou analisar melhor",
                    onPress: () => naoConfirma(),
                    style: "cancel"
                },
                {
                    text: "Sim. Vou sortear o premio.",
                    onPress: () => confirmaPremio(),
                    style: 'default'
                }
            ]
        );
    }

    const confirmarPix = () => {
        console.log('confirmarPix');
        Alert.alert(
            "Olá,",
            "Você confirma o sorteio do PIX?",
            [
                {
                    text: "Hum, ainda não. Vou analisar melhor",
                    onPress: () => naoConfirma(),
                    style: "cancel"
                },
                {
                    text: "Sim. Vou sortear o PIX.",
                    onPress: () => confirmaPix(),
                    style: 'default'
                }
            ]
        );
    }

    function naoConfirma() {
        console.log('naoConfirma');
        return;
    }
 
    async function confirmaPremio() {
        console.log('confirmaPremio');
        let premio = 'premio';
        setMensagemCadastro('')
        setLoading(true);
        const resultado = await gravaConfirmacaoPremio(route.params?.id,premio);
        console.log('resultado gravaConfirmacaoPremio-premio: ' + resultado);
        if (resultado == 'sucesso') {
            setMensagemCadastro('Premio definido com sucesso')
            setLoading(false);
            setPremioDefinido(true)
            return;
        } else {
            setMensagemCadastro(resultado)
            setLoading(false);
            setPremioDefinido(false)
            return;
        }
    }

    async function confirmaPix() {
        console.log('confirmaPix');
        let premio = 'pix';
        setMensagemCadastro('')
        setLoading(true);
        const resultado = await gravaConfirmacaoPremio(route.params?.id,premio);
        console.log('resultado gravaConfirmacaoPremio-pix: ' + resultado);
        if (resultado == 'sucesso') {
            setMensagemCadastro('Premio definido com sucesso')
            setLoading(false);
            return;
        } else {
            setMensagemCadastro(resultado)
            setLoading(false);
            return;
        }
    }
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
                    <View style={styles.card}>
                        <Image source={{ uri: route.params?.imagemCapa }}
                            style={styles.capa}
                        />
                        <AreaRifa>
                            <RifaTextTitulo> {route.params?.titulo} </RifaTextTitulo>
                            <ContentText numberOfLines={8}>
                                {route.params?.descricao}
                            </ContentText>
                            <RifaText> Qtd bilhetes: {route.params?.qtdBilhetes} Vlr bilhete: {route.params?.vlrBilhete}</RifaText>
                            <RifaText> Qtd bilhetes pagos: {route.params?.qtdBilhetesPagos} Vlr total bilhetes pagos: {route.params?.vlrTotalBilhetesPagos} </RifaText>
                        </AreaRifa>
                    </View>
                    <Texto>
                        Olá {route.params?.usuarioNome},
                    </Texto>
                    <Texto>
                        Como a rifa atingiu a data limite de vendas, voce precisa definir o que sera sorteado.
                    </Texto>
                    <Texto>
                        Se voce optar por sortear o premio {route.params?.titulo}, voce vai receber:
                    </Texto>
                    <Texto>
                        (+) Vlr total bilhetes pagos R$: {route.params?.vlrTotalBilhetesPagos}
                        (-) Vlr taxa de administracao R$: {route.params?.vlrTaxaAdministracao}
                        (-) Vlr taxa bilhetes pagos R$: {route.params?.vlrTaxaBilhetesPagos}
                        (=) Vlr liquido a receber R$: {route.params?.vlrLiquidoAReceberPremio}
                    </Texto>                    
                    <Texto>

                    </Texto>
                    <Texto>
                        Se voce optar por sortear PIX, o ganhador vai receber R$ {vlrAReceberGanhadorPix}
                    </Texto>
                    <Texto>
                        E voce vai receber:
                    </Texto>                    
                    <Texto>
                        (+) Vlr 50% do vlr total bilhetes pagos R$: {route.params?.vlr50PcTotalBilhetesPagos}
                        (-) Vlr taxa de administracao R$: {route.params?.vlrTaxaAdministracao}
                        (-) Vlr taxa bilhetes pagos R$: {route.params?.vlrTaxaBilhetesPagos}
                        (=) Vlr liquido a receber R$: {route.params?.vlrLiquidoAReceberPremio}
                    </Texto>                     
                    <Texto>
                       
                    </Texto>
                    <Texto>
                        Atencao: voce tem ate o dia {route.params?.dataFinalDefinirPremio} para definir o premio.
                    </Texto>                    
                    <Texto>
                        Caso voce nao defina, o premio sera automaticamente definido como PIX.
                    </Texto>  
                    <Texto>
                        
                    </Texto>  
                    <View style={estilos.areaMensagemCadastro}>
                        <Text style={estilos.textoMensagemCadastro}>
                            {mensagemCadastro}
                        </Text>
                    </View>                                        
                   { premioDefinido ?
                            <AreaBotao>
                                <SubmitButton onPress={sair}>
                                    <SubmitText>
                                        Ok
                                    </SubmitText>
                                </SubmitButton>
                            </AreaBotao>
                            :
                            <AreaBotao>
                                <SubmitButton onPress={confirmarPremio}>
                                    <SubmitText>
                                        Premio
                                    </SubmitText>
                                </SubmitButton>
                                <SubmitButton onPress={confirmarPix}>
                                    <SubmitText>
                                        PIX
                                    </SubmitText>
                                </SubmitButton>                                
                                <TouchableOpacity style={styles.botao} onPress={() => sair()}>
                                    <Text style={estilos.linkText}>Voltar</Text>
                                </TouchableOpacity>
                            </AreaBotao>
    }
                </ScrollView>
            </GestureHandlerRootView>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        margin: 15,
        shadowRadius: 5,
        borderRadius: 5,
        elevation: 3
    },
    capa: {
        width: '100%',
        height: 350,
        borderRadius: 5
    },
    botao: {
        marginTop: 15,
        marginLeft: 10,
    },
}) 