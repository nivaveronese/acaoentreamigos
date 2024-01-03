import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Alert, View, Text, ActivityIndicator, Keyboard, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Botao from '../../componentes/Botao';
import { AreaCapa, Texto, Input, TextoMensagemCadastro } from './styles';
import {
    gravaRifaALiberarTransacao, obtemGeneros, obtemParametrosApp, obtemQtdNrsRifa,
    gravaRifaDisponibilizadaTransacao
} from '../../servicos/firestore';
import estilos from '../../estilos/estilos';
import { salvaImagem } from '../../servicos/storage';
import { AuthContext } from '../../contexts/auth';
import ModalDropdown from 'react-native-modal-dropdown';
import capabranca from '../../assets/maqfotografica.png';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

export default function DisponibilizarRifas() {
    console.log('DisponibilizarRifas');
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setdescricao] = useState('');
    const [genero, setGenero] = useState(' Escolha a categoria');
    const [descricaoGenero, setDescricaoGenero] = useState([]);
    const [qtdNrsRifa, setQtdNrsRifa] = useState(' Escolha a qtd de nrs da rifa');
    const [descricaoQtdNrsRifa, setDescricaoQtdNrsRifa] = useState([]);
    const [imagemCapa, setImagemCapa] = useState('');
    const [load, setLoad] = useState(false);
    const { user: usuario } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        carregaGenerosList();
        carregaQtdNrsRifaList();
    }, []);

    async function carregaGenerosList() {
        console.log('carregaGenerosList');
        setLoad(true)
        const generosRifasFirestore = await obtemGeneros()
        var descricaoGeneroArray = []
        for (var g = 0; g < generosRifasFirestore.length; g++) {
            const descrGenero = generosRifasFirestore[g].genero;
            descricaoGeneroArray.push(descrGenero);
        }
        setDescricaoGenero(descricaoGeneroArray)
        setLoad(false)
    }

    async function carregaQtdNrsRifaList() {
        console.log('carregaQtdNrsRifaList');
        setLoad(true)
        const qtdNrsRifaFirestore = await obtemQtdNrsRifa()
        var descricaoqtdNrsRifaArray = []
        for (var g = 0; g < qtdNrsRifaFirestore.length; g++) {
            const descrQtdNrs = qtdNrsRifaFirestore[g].qtdNrs;
            descricaoqtdNrsRifaArray.push(descrQtdNrs);
        }
        setDescricaoQtdNrsRifa(descricaoqtdNrsRifaArray)
        setLoad(false)
    }

    async function disponibilizarRifa() {
        console.log('disponibilizarRifa: ' + genero);
        Keyboard.dismiss();
        setMensagemCadastro('')
        if (titulo == '' || titulo.length === 0) {
            console.log('titulo: ' + titulo);
            setMensagemCadastro('Digite o título');
        } else if (descricao == '' || descricao.length === 0) {
            console.log('descricao: ' + descricao);
            setMensagemCadastro('Digite a descricao');
        } else if (genero === ' Escolha a categoria' || typeof genero === "undefined") {
            console.log('genero: ' + genero);
            setMensagemCadastro('Escolha a categoria')
        } else if (qtdNrsRifa === ' Escolha a qtd de nrs da rifa' || typeof qtdNrsRifa === "undefined") {
            console.log('qtdNrsRifa: ' + qtdNrsRifa);
            setMensagemCadastro('Escolha a qtd nrs da rifa')
        } else {
            gravarRifa();
        }
    }

    async function gravarRifa() {
        console.log('gravarRifa')
        setMensagemCadastro('')
        if (imagemCapa == '') {
            setMensagemCadastro('Escolha uma foto da Rifa')
            return
        }
        setLoad(true)
        console.log('inicio salvar imagem')
        let nomeImagem = titulo.trim() + '-' + uuid.v4();
        const urlImagemCapa = await salvaImagem(imagemCapa, nomeImagem);
        if (!urlImagemCapa) {
            setMensagemCadastro('Ops, foto da rifa não conseguiu ser gravada. Verifique sua conecxão com a internet. Tente novamente')
            setLoad(false)
            return
        }
        console.log('fim salvar imagem')
        let dadosRifa = {
            titulo: titulo,
            descricao: descricao,
            imagemCapa: urlImagemCapa,
            genero: genero,
            uidusuario: usuario.uid,
            cep: usuario.cep,
            cidade: usuario.cidade,
            uf: usuario.uf,
            bairro: usuario.bairro,
            nome: usuario.nome,
            email: usuario.email,
            nomeCapa: nomeImagem,
            post: 'imagemRifa',
            qtdNrsRifa: qtdNrsRifa
        }
        const parametrosAppFirestore = await obtemParametrosApp();
        if (parametrosAppFirestore.exigeCuradoria || typeof parametrosAppFirestore.exigeCuradoria === "undefined") {
            const resultado = await gravaRifaALiberarTransacao(dadosRifa);
            console.log('resultado gravaRifaALiberarTransacao: ' + resultado);
            setLoad(false)
            if (resultado == 'sucesso') {
                setTitulo('')
                setImagemCapa('')
                setdescricao('')
                setGenero(' Escolha a categoria')
                navigation.navigate('Ok')
            }
            else {
                setMensagemCadastro(resultado)
                return
            }
        } else {
            console.log('sem curadoria')
            const resultado = await gravaRifaDisponibilizadaTransacao(dadosRifa);
            console.log('resultado gravaRifaDisponibilizadaTransacao: ' + resultado);
            setLoad(false)
            if (resultado == 'sucesso') {
                setTitulo('')
                setImagemCapa('')
                setdescricao('')
                setGenero(' Escolha a categoria')
                navigation.navigate('Ok')
            }
            else {
                setMensagemCadastro(resultado)
                return
            }
        }
    }

    function selecionarCapa() {
        console.log('selecionarCapa')
        Alert.alert(
            "Selecione",
            "Informe de onde você vai obter a foto",
            [
                {
                    text: "Cancelar",
                    onPress: () => cancelarSelecionarCapa(),
                    style: "cancel"
                },
                {
                    text: "Galeria",
                    onPress: () => obterImagemGaleria(),
                    style: 'default'
                },
                {
                    text: "Câmera",
                    onPress: () => obterImagemCamera(),
                    style: 'default'
                }
            ]
        );
    }

    async function cancelarSelecionarCapa() {
        return
    }

    async function obterImagemGaleria() {
        console.log('obterImagemGaleria')
        setMensagemCadastro('')
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.9
        }).then(image => {
            console.log(image);
            if (image.size > 614488) {
                setMensagemCadastro('Tamanho da foto maior que o permitido')
                return
            }
            setImagemCapa(image.path);
        })
            .catch(error => {
                console.log(error)
                setMensagemCadastro('Ops, erro ao selecionar foto da Rifa')
            });
    }

    async function obterImagemCamera() {
        console.log('obterImagemCamera')
        setMensagemCadastro('')
        ImagePicker.openCamera({
            compressImageMaxWidth: 400,
            compressImageMaxHeight: 400,
            cropping: true,
            compressImageQuality: 0.9
        }).then(image => {
            console.log(image.path);
            setImagemCapa(image.path);
        })
            .catch(error => {
                console.log(error)
                setMensagemCadastro('Ops, erro ao selecionar foto da Rifa')
            });
    }

    const handleOptionSelect = (index, value) => {
        setGenero(value);
    };

    return (
        <SafeAreaView style={estilos.safeArea}>
            <Texto>
                Título
            </Texto>
            <Input
                autoCorrect={false}
                autoCaptalize='none'
                value={titulo}
                onChangeText={(text) => setTitulo(text)}
            />
            <Texto>
                descricao
            </Texto>
            <Input
                autoCorrect={false}
                autoCaptalize='none'
                multiline={true}
                numberOfLines={8}
                maxLength={400}
                value={descricao}
                onChangeText={(text) => setdescricao(text)}
            />
            <Texto>
                Categoria
            </Texto>
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
            <Texto>
                Qtd de nrs da rifa
            </Texto>
            <View style={styles.container}>
                <ModalDropdown
                    options={descricaoQtdNrsRifa}
                    defaultValue={qtdNrsRifa}
                    onSelect={handleOptionSelect}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownDropdown}
                    dropdownTextStyle={styles.dropdownDropdownText}
                />
            </View>            
            <AreaCapa>
                <TouchableOpacity style={estilos.imagemCapa}
                    onPress={() => selecionarCapa()}>
                    <Image source={imagemCapa ? { uri: imagemCapa } : capabranca}
                        resizeMode={"cover"}
                        style={estilos.imagemCapa} />
                </TouchableOpacity>
                <Texto>
                    Foto da rifa
                </Texto>
            </AreaCapa>
            <TextoMensagemCadastro>
                {mensagemCadastro}
            </TextoMensagemCadastro>
            <Botao onPress={disponibilizarRifa}>
                {load ? (
                    <ActivityIndicator size={20} color='#FFF' />
                ) : (
                    <Text>Disponibilizar Rifa</Text>
                )
                }
            </Botao>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'top',
        alignItems: 'center',
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
});