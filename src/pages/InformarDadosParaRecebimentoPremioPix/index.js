import React, { useState, useEffect } from 'react';
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
import { obtemTiposChavePix, gravaDadosParaRecebimentoPremioPix } from '../../servicos/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';
import CpfValido from '../../componentes/CpfValido';
import CnpjValido from '../../componentes/CnpjValido';
import CelularValido from '../../componentes/CelularValido';

export default function InformarDadosParaRecebimentoPremioPix() {
    console.log('InformarDadosParaRecebimentoPremioPix')
    const [tipoChavePix, setTipoChavePix] = useState(' Escolha tipo da chave');
    const [descricaoTipoChavePix, setDescricaoTipoChavePix] = useState([]);
    const [chavePix, setChavePix] = useState('')
    const [nomePessoaChavePix, setNomePessoaChavePix] = useState('')
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);
    const [dadosGravados, setDadosGravados] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    useEffect(() => {
        carregarTiposChavePixList();
    }, []);

    async function carregarTiposChavePixList() {
        console.log('carregarTiposChavePixList');
        setLoading(true)
        const tiposChavePixFirestore = await obtemTiposChavePix()
        console.log('tiposChavePixFirestore.length: ' + tiposChavePixFirestore.length)
        var descricaoTipoChavePixArray = []
        for (var g = 0; g < tiposChavePixFirestore.length; g++) {
            const descrTipoChavePix = tiposChavePixFirestore[g].tipo;
            descricaoTipoChavePixArray.push(descrTipoChavePix);
        }
        setDescricaoTipoChavePix(descricaoTipoChavePixArray)
        setLoading(false)
    }

    async function validarDadosChavePix() {
        console.log('validarDadosChavePix');

        if (tipoChavePix === ' Escolha tipo da chave' || typeof tipoChavePix === "undefined") {
            console.log('tipoChavePix: ' + tipoChavePix);
            setMensagemCadastro('Escolha o tipo da chave Pix')
            return;
        }

        if (tipoChavePix === 'Cpf') {
            if (!CpfValido(chavePix)) {
                setMensagemCadastro('Digite cpf válido');
                return;
            }
        }

        if (tipoChavePix === 'Cnpj') {
            if (!CnpjValido(chavePix)) {
                setMensagemCadastro('Digite cnpj válido');
                return;
            }
        }

        if (tipoChavePix === 'Celular') {
            if (!CelularValido(chavePix)) {
                setMensagemCadastro('Digite celular válido: ex: 16999999999 (ddd mais celular: somente os números');
                return;
            }
        }

        if (tipoChavePix === 'Email') {
            if (!emailRegex.test(chavePix)) {
                setMensagemCadastro('Digite email válido');
                return;
            }
        }

        if (tipoChavePix === 'Chave aleatória') {
            if (chavePix.length != 36) {
                setMensagemCadastro('Digite chave aleatória válida');
                return;
            }
        }

        if (nomePessoaChavePix == '' || nomePessoaChavePix.length === 0 || !isNaN(nomePessoaChavePix)) {
            setMensagemCadastro('Digite o nome da pessoa da chave pix');
            return;
        }
        gravarDadosParaRecebimentoPremioPix();
    }

    async function gravarDadosParaRecebimentoPremioPix() {
        console.log('gravarDadosParaRecebimentoPremioPix: ' + route.params?.rifaDisponivel.id)
        var dadosParaRecebimentoPremioPix = {
            idRifa: route.params?.rifaDisponivel.id,
            tipoChavePixGanhador: tipoChavePix,
            chavePixGanhador: chavePix,
            nomePessoaChavePixGanhador: nomePessoaChavePix
        }
        setLoading(true)
        const resultado = await gravaDadosParaRecebimentoPremioPix(dadosParaRecebimentoPremioPix);
        setLoading(false)
        console.log('resultado: ' + resultado)
        if (resultado == 'sucesso') {
            setDadosGravados(true)
            console.log('Dados para recebimento do Pix gravados com sucesso ')
            setMensagemCadastro('Dados para recebimento do Pix, gravados com sucesso.');
            return;
        }
        else {
            setDadosGravados(false)
            setMensagemCadastro('Falha gravação dados para recebimento do Pix. Tente novamente.');
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
                    <View style={styles.corpo}>
                        <Texto>
                            Olá {route.params?.rifaDisponivel.nome},
                        </Texto>
                        <Texto>
                            Você foi o ganhador desta rifa. Para receber o valor de R$ {route.params?.rifaDisponivel.vlrPremioPixSorteio}, preencha os dados abaixo:
                        </Texto>
                        <Texto> </Texto>
                        <Texto>
                            Tipo da sua chave Pix
                        </Texto>
                        <View style={styles.container}>
                            <ModalDropdown
                                options={descricaoTipoChavePix}
                                defaultValue={tipoChavePix}
                                onSelect={handleOptionSelect}
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                dropdownStyle={styles.dropdownDropdown}
                                dropdownTextStyle={styles.dropdownDropdownText}
                            />
                        </View>
                        <Texto>
                            Chave pix
                        </Texto>
                        <Input
                            autoCorrect={false}
                            autoCaptalize='none'
                            value={chavePix}
                            onChangeText={(text) => setChavePix(text)}
                        />
                        <Texto>
                            Nome da pessoa da chave pix
                        </Texto>
                        <Input
                            autoCorrect={false}
                            autoCaptalize='none'
                            value={nomePessoaChavePix}
                            onChangeText={(text) => setNomePessoaChavePix(text)}
                        />
                        <Texto>
                            O valor será depositado em até 5 dias uteis.
                        </Texto>

                    </View>
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
                                <SubmitButton onPress={validarDadosChavePix}>
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
    container: {
        justifyContent: 'top',
        alignItems: 'left',
        height: 40,
    },
    dropdown: {
        width: 300,
        height: 40,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        padding: 10,
        borderRadius: 5,
        marginLeft: 8,
    },
    dropdownText: {
        fontSize: 15,
    },
    dropdownDropdown: {
        width: 300,
        height: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginLeft: 8,
    },
    dropdownDropdownText: {
        fontSize: 15,
    },
    corpo: {
        padding: 5,
    },
}) 