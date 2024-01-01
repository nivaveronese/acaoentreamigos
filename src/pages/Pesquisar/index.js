import React, { useState, useEffect, useContext } from 'react';
import { View, Keyboard, FlatList, StyleSheet } from 'react-native';
import {
    Input, Background, AreaBotaoPesquisa, TextoMensagemCadastro,
    ContainerPesquisa, AreaPesquisa
} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioPesquisar from '../../componentes/RadioPesquisar';
//import RifasPesquisarList from '../../componentes/RifasPesquisarList';
import {obtemGeneros, obtemParametrosApp} from '../../servicos/firestore';
import { useIsFocused } from "@react-navigation/native";
import apicep from '../../servicos/apicep';
import ModalDropdown from 'react-native-modal-dropdown';
import { AuthContext } from '../../contexts/auth';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect';

export default function Pesquisar() {
    console.log('pages/pesquisar.index.js');
    const [argPesquisa, setArgPesquisa] = useState('');
    const [selected, setSelected] = useState(0);
    const [RifasDisponiveisPesquisa, setRifasDisponiveisPesquisa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensagemError, setMensagemError] = useState('');
    const [genero, setGenero] = useState(' Escolha a categoria');
    const [descricaoGenero, setDescricaoGenero] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useContext(AuthContext);
    const focus = useIsFocused();
    const [qtdRifas, setQtdRifas] = useState(0);
    const [RifasDisponiveisPaginacao, setRifasDisponiveisPaginacao] = useState([]);
    const [ultimoRifa, setUltimoRifa] = useState(false);
    const [temRifaDisponivel, setTemRifaDisponivel] = useState(false);
    var localidade = '';
    var uf = '';

    useEffect(() => {
        async function inicioEffect() {
            console.log('inicioEffect-Pesquisar')
            if (focus == true) {
                setArgPesquisa('')
                setRifasDisponiveisPesquisa([])
                setMensagemError('');
                carregaGenerosList();
                setUltimoRifa(false)
                setTemRifaDisponivel(false)
            }
        }
        inicioEffect()
    }, [focus])

    async function carregaGenerosList() {
        console.log('carregaGenerosList');
        setLoading(true)
        const generosRifasFirestore = await obtemGeneros()
        var descricaoGeneroArray = []
        for (var g = 0; g < generosRifasFirestore.length; g++) {
            const descrGenero = generosRifasFirestore[g].genero;
            descricaoGeneroArray.push(descrGenero);
        }
        setDescricaoGenero(descricaoGeneroArray)
        setLoading(false)
    }

    async function pesquisarRifas() {
        console.log('pesquisar- pesquisarRifas: ' + selected + '-' + argPesquisa + '-' + genero);
    }

    async function carregarRifasDisponiveisCep() {
        console.log('carregarRifasDisponiveisCep');
        setLoading(true)
        try {
            const response = await apicep.get(`/${argPesquisa}/json`);
            if (response.data.erro) {
                localidade = '';
                uf = '';
                setMensagemError('Cep não localizado');
                setLoading(false)
                return;
            }
            localidade = response.data.localidade;
            uf = response.data.uf;
        } catch (error) {
            console.log('erro cep: ' + error.code);
            localidade = '';
            uf = '';
            setMensagemError('Falha consultar cep. Verifique sua conexão de internet');
            setLoading(false)
            return;
        }
    }

    async function carregarLRifasDisponiveisGenero() {
        console.log('carregarRifasDisponiveisGenero: ' + genero);
    }

    async function carregarRifasDisponiveisTitulo() {
        console.log('carregarRifasDisponiveisTitulo');
    }

    async function carregarRifasDisponiveisAutor() {
        console.log('carregarRifasDisponiveisAutor');
    }

    async function obterMaisRifas() {
        console.log('obterMaisRifas: ' )
 }

    async function refreshList() {
        console.log('home refreshList')
    }

    const handleOptionSelect = (index, value) => {
        setGenero(value);
    };

        return (
            <Background>
                <AreaPesquisa>
                    <Input
                        autoCorrect={false}
                        autoCaptalize='none'
                        value={argPesquisa}
                        onChangeText={(text) => setArgPesquisa(text)}
                        maxLength={40}
                    />
                    <AreaBotaoPesquisa onPress={pesquisarRifas}>
                        <Icon
                            name='book-search-outline' size={30} color='#333'
                        />
                    </AreaBotaoPesquisa>
                </AreaPesquisa>
                <ContainerPesquisa>
                    <RadioPesquisar
                        selected={selected}
                        options={['título', 'responsavel', 'cep', 'categoria']}
                        horizontal={true}
                        onChangeSelect={(opt, i) => {
                            setSelected(i);
                        }}
                    />
                </ContainerPesquisa>
                <View style={styles.container}>
                    <ModalDropdown
                        options={descricaoGenero}
                        defaultValue={genero}
                        onSelect={handleOptionSelect}
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownDropdown}
                        dropdownTextStyle={styles.dropdownDropdownText}
                    />
                </View>
                <TextoMensagemCadastro>
                    {mensagemError}
                </TextoMensagemCadastro>
            </Background>
        )
    }

const styles = StyleSheet.create({
    lista: {
        paddingTop: 2,
        Background: '#FFFFFF',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginTop: 20,
    },
    container: {
        justifyContent: 'top',
        alignItems: 'center',
        height: 40,
    },
    dropdown: {
        width: 200,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        padding: 5,
        borderRadius: 5,
    },
    dropdownText: {
        fontSize: 12,
    },
    dropdownDropdown: {
        width: 200,
        height: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    dropdownDropdownText: {
        fontSize: 12,
    },
});