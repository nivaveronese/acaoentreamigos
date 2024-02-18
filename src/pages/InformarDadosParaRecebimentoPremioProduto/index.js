import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image }
    from 'react-native';
import estilos from '../../estilos/estilos';
import {
    AreaBotao, InputCel, Texto, RifaText,
    RifaTextTitulo, SubmitButton, SubmitText, AreaRifa,
    ContentText
} from './styles';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { gravaDadosParaRecebimentoPremioProduto } from '../../servicos/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CelularValido from '../../componentes/CelularValido';
import { TextInputMask } from 'react-native-masked-text'
 
export default function InformarDadosParaRecebimentoPremioProduto() {
    console.log('InformarDadosParaRecebimentoPremioProduto')
    const [celularGanhador, setCelularGanhador] = useState('')
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);
    const [dadosGravados, setDadosGravados] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
 
    async function validarDados() {
        console.log('validarDados');
        if (!CelularValido(celularGanhador)) {
            setMensagemCadastro('Digite celular válido: ddd mais número do celular');
            return;
        }
        console.log('celularGanhador: ' + celularGanhador)
        gravarDadosParaRecebimentoPremioProduto();
    }

    async function gravarDadosParaRecebimentoPremioProduto() {
        console.log('gravarDadosParaRecebimentoPremioProduto: ' + route.params?.rifaDisponivel.id)
        var dadosParaRecebimentoPremioProduto = {
            idRifa: route.params?.rifaDisponivel.id,
            celularGanhadorPremioProduto: celularGanhador
        }
        setLoading(true)
        const resultado = await gravaDadosParaRecebimentoPremioProduto(dadosParaRecebimentoPremioProduto);
        setLoading(false)
        console.log('resultado: ' + resultado)
        if (resultado == 'sucesso') {
            setDadosGravados(true)
            console.log('Dados para recebimento do premio produto gravados com sucesso ')
            setMensagemCadastro('Dados para recebimento do premio produto, gravados com sucesso.');
            return;
        }
        else {
            setDadosGravados(false)
            setMensagemCadastro('Falha gravação dados para recebimento do premio produto. Tente novamente.');
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
                        Informe abaixo, o seu celular, para que o responsável pelo prêmio, entre em contato com você, para a entrega do produto.
                    </Texto>
                    <Texto>
                        Quando o responsável ligar para você, informe a ele o código de segurança: {route.params?.rifaDisponivel.codigoSegurancaGanhador}
                    </Texto>
                    <Texto>
                        Seu número de celular
                    </Texto>
                    <TextInputMask
                        style={styles.input}
                        type={'cel-phone'}
                        options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99)'
                        }}
                        value={celularGanhador}
                        onChangeText={text => setCelularGanhador(text)}
                    />
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
    input: {
        width: '50%',
        borderRadius: 5,
        borderColor: '#D3D3D3',
        borderWidth: 1,
        fontSize: 15,
        padding: 5,
        fontFamily: 'Roboto',
        color: '#333',
        marginLeft: 5,
    },
}) 