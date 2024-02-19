import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image }
    from 'react-native';
import estilos from '../../estilos/estilos';
import {
    AreaBotao, Input, Texto, RifaText,
    RifaTextTitulo, SubmitButton, SubmitText, AreaRifa,
    ContentText
} from './styles';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { gravaDadosConfirmacaoRecebimentoPremioProduto } from '../../servicos/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CelularValido from '../../componentes/CelularValido';
 
export default function ConfirmarRecebimentoPremio() {
    console.log('ConfirmarRecebimentoPremio')
    const [codigoSeguranca, setCodigoSeguranca] = useState('')
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);
    const [dadosGravados, setDadosGravados] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
 
    async function validarDados() {
        console.log('validarDados');
        if (codigoSeguranca != route.params?.rifaDisponivel.codigoSegurancaGanhador) {
            setMensagemCadastro('Digite codigo seguranca correto');
            return;
        }
        gravarDadosConfirmacaoRecebimentoPremio();
    }

    async function gravarDadosConfirmacaoRecebimentoPremio() {
        console.log('gravarDadosConfirmacaoRecebimentoPremio: ' + route.params?.rifaDisponivel.id)
        setLoading(true)
        const resultado = await gravaDadosConfirmacaoRecebimentoPremioProduto(route.params?.rifaDisponivel.id);
        setLoading(false)
        console.log('resultado: ' + resultado)
        if (resultado == 'sucesso') {
            setDadosGravados(true)
            console.log('Dados confirmacao recebimento premio gravados com sucesso ')
            setMensagemCadastro('Dados confirmacao recebimento premio, gravados com sucesso.');
            return;
        }
        else {
            setDadosGravados(false)
            setMensagemCadastro('Falha gravação dados confirmacao recebimento premio. Tente novamente.');
            return;
        }
    }

    const handleOptionSelect = (index, value) => {
        setTipoChavePix(value);
    };

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
                        <Image source={{ uri: route.params?.rifaDisponivel.imagemCapa }}
                            style={styles.capa}
                        />
                        <AreaRifa>
                            <RifaTextTitulo> {route.params?.rifaDisponivel.titulo} </RifaTextTitulo>
                            <ContentText numberOfLines={8}>
                                {route.params?.rifaDisponivel.descricao}
                            </ContentText>
                            <RifaText> Responsável: {route.params?.rifaDisponivel.nome} </RifaText>
                            <RifaText> {route.params?.rifaDisponivel.cidade} {route.params?.rifaDisponivel.uf} {route.params?.rifaDisponivel.bairro} </RifaText>
                            <RifaText> Situação rifa: {route.params?.rifaDisponivel.situacao}</RifaText>
                        </AreaRifa>
                    </View>
                    <Texto>
                        Olá {route.params?.rifaDisponivel.nome},
                    </Texto>
                    <Texto>
                        Você foi o ganhador desta rifa.
                    </Texto>
                    <Texto>
                        Informe abaixo, o codigo de segurança, para que o responsável pelo prêmio, possa receber o valor dos bilhetes vendidos.
                    </Texto>
                    <Texto>  </Texto>
                    <Texto>
                        Codigo de segurança
                    </Texto>
                    <Input
                        autoCorrect={false}
                        autoCaptalize='none'
                        value={codigoSeguranca}
                        onChangeText={(text) => setCodigoSeguranca(text)}
                    />
                    <Texto>  </Texto>
                    <Texto>
                        Declaro para os devidos fins, que recebi o produto conforme especificado.
                    </Texto>                    
                    <View style={estilos.areaMensagemCadastro}>
                        <Text style={estilos.textoMensagemCadastro}>
                            {mensagemCadastro}
                        </Text>
                    </View>
                    {
                        dadosGravados ?
                            <AreaBotao>
                                <SubmitButton onPress={sair}>
                                    <SubmitText>
                                        Ok
                                    </SubmitText>
                                </SubmitButton>
                            </AreaBotao>
                            :
                            <AreaBotao>
                                <SubmitButton onPress={validarDados}>
                                    <SubmitText>
                                        Gravar
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