import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Alert, View, Text, ActivityIndicator, Keyboard, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Botao from '../../componentes/Botao';
import { AreaCapa, Texto, Input, TextoMensagemCadastro, InputQtd } from './styles';
import { obtemGeneros, obtemParametrosApp, obtemQtdRifasAtivasUsuario, obtemQtdRifasALiberarUsuario } from '../../servicos/firestore';
import estilos from '../../estilos/estilos';
import { salvaImagem } from '../../servicos/storage';
import { AuthContext } from '../../contexts/auth';
import ModalDropdown from 'react-native-modal-dropdown';
import capabranca from '../../assets/maqfotografica.png';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

export default function DisponibilizarRifasPremio() {
    console.log('DisponibilizarRifasPremio');
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [titulo, setTitulo] = useState('');
    const [autorizacao, setAutorizacao] = useState('');
    const [descricao, setdescricao] = useState('');
    const [genero, setGenero] = useState(' Escolha a categoria');
    const [descricaoGenero, setDescricaoGenero] = useState([]);
    const [qtdBilhetes, setQtdBilhetes] = useState('');
    const [vlrBilhete, setVlrBilhete] = useState('');
    const [imagemCapa, setImagemCapa] = useState('');
    const [load, setLoad] = useState(false);
    const { user: usuario } = useContext(AuthContext);
    const navigation = useNavigation();
    const [percAdministracao, setPercAdministracao] = useState('');
    const [percPgtoBilhete, setPercPgtoBilhete] = useState('');
    const [qtdRifasAtivasUsuario, setQtdRifasAtivasUsuario] = useState('')
    const [qtdRifasALiberarUsuario, setQtdRifasALiberarUsuario] = useState('')
    const [qtdLimiteRifasAtivas,setQtdLimiteRifasAtivas] = useState('');
    const [vlrMinimoTotalRifa,setVlrMinimoTotalRifa] = useState('');
    var qtdBilhetesValidos = [10, 100, 1000];
    var regra = /^[0-9]+$/;
    var vlrTotalBilhetesPrevisto = 0;
    var vlrTotalTaxaAdministracaoPrevisto = 0;
    var vlrTotalTaxaBilhetesPrevisto = 0;
    var vlrLiquidoAReceberResponsavelPrevisto = 0;

    useEffect(() => {
        carregaGenerosList();
        obterParametros();
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

    async function obterParametros() {
        console.log('obterParametros');
        setLoad(true)
        const parametrosAppFirestore = await obtemParametrosApp();
        console.log('parametrosAppFirestore.qtdLimiteRifasAtivas: ' + parametrosAppFirestore.qtdLimiteRifasAtivas)
        console.log('parametrosAppFirestore.vlrMinimoTotalRifa: ' + parametrosAppFirestore.vlrMinimoTotalRifa)
        setLoad(false)
        if (!parametrosAppFirestore) {
            console.log('parametrosAppFirestore vazio')
            setQtdLimiteRifasAtivas(5);
            setPercAdministracao(10);
            setPercPgtoBilhete(1);
            setVlrMinimoTotalRifa(100);
        } else {
            setQtdLimiteRifasAtivas(parametrosAppFirestore.qtdLimiteRifasAtivas);
            setPercAdministracao(parametrosAppFirestore.percAdministracao);
            setPercPgtoBilhete(parametrosAppFirestore.percPgtoBilhete);
            setVlrMinimoTotalRifa(parametrosAppFirestore.vlrMinimoTotalRifa);
        }
        setLoad(true)
        console.log('usuario.uid: ' + usuario.uid)
        const qtdRifasAtivasUsuarioFirestore = await obtemQtdRifasAtivasUsuario(usuario.uid);
        console.log('obtemQtdRifasAtivasUsuarioFirestore: ' + qtdRifasAtivasUsuarioFirestore)
        setQtdRifasAtivasUsuario(qtdRifasAtivasUsuarioFirestore)
        const qtdRifasALiberarUsuarioFirestore = await obtemQtdRifasALiberarUsuario(usuario.uid);
        console.log('qtdRifasALiberarUsuarioFirestore: ' + qtdRifasALiberarUsuarioFirestore)
        setQtdRifasALiberarUsuario(qtdRifasALiberarUsuarioFirestore)
        setLoad(false)
    }

    async function disponibilizarRifa() {
        console.log('disponibilizarRifa: ' + genero + '-' + qtdBilhetes);
        Keyboard.dismiss();
        setMensagemCadastro('')
        if (titulo == '' || titulo.length === 0) {
            console.log('titulo: ' + titulo);
            setMensagemCadastro('Digite o título do premio');
            return;
        } else if (descricao == '' || descricao.length === 0) {
            console.log('descricao: ' + descricao);
            setMensagemCadastro('Digite a descricao do premio');
            return;
        } else if (genero === ' Escolha a categoria' || typeof genero === "undefined" || genero === 'Pix') {
            console.log('genero: ' + genero);
            setMensagemCadastro('Escolha uma categoria valida')
            return;
        } else if (typeof qtdBilhetes === "undefined" || !qtdBilhetesValidos.includes(parseInt(qtdBilhetes))) {
            setMensagemCadastro('Informe uma quantidade valida de bilhetes da rifa (10,100 ou 1000')
            return;
        } else if (typeof vlrBilhete === "undefined" || isNaN(vlrBilhete) || vlrBilhete == 0 || vlrBilhete < 0 || !vlrBilhete.match(regra)) {
            setMensagemCadastro('Informe valor do bilhete (somente inteiros. Ex: 10, 25, 50')
            return;
        }
        let vlrTotRifa = (parseInt(qtdBilhetes) * parseInt(vlrBilhete));
        console.log('vlrTotRifa - vlrMinimoTotalRifa: ' + vlrTotRifa + ' - ' + vlrMinimoTotalRifa)
        if (vlrTotRifa < vlrMinimoTotalRifa){
            setMensagemCadastro('Valor total da rifa: ' + vlrTotRifa + ' , esta menor que o valor minimo aceito: ' + vlrMinimoTotalRifa);
            return;
        }
        let qtdRifasTotalUsuario = qtdRifasAtivasUsuario + qtdRifasALiberarUsuario
        console.log('qtdRifasTotalUsuario: ' + qtdRifasTotalUsuario)
        if (qtdRifasTotalUsuario == qtdLimiteRifasAtivas) {
            setMensagemCadastro('Voce ja atingiu o limite de rifas ativas ' + qtdLimiteRifasAtivas);
            return;
        }      
        gravarRifa();
    }

    async function gravarRifa() {
        console.log('gravarRifa')
        setMensagemCadastro('')
            if (imagemCapa == '') {
                setMensagemCadastro('Escolha uma foto do premio')
                return
            } else {
                setLoad(true)
                console.log('inicio salvar imagem-imagemCapa: ' + imagemCapa)
                var nomeImagem = titulo.trim() + '-' + uuid.v4();
                var urlImagemCapa = await salvaImagem(imagemCapa, nomeImagem);
                setLoad(false)
                if (!urlImagemCapa) {
                    setMensagemCadastro('Ops, foto do premio não conseguiu ser gravada. Verifique sua conecxão com a internet. Tente novamente')
                    return
                }
                console.log('fim salvar imagem')
            }

        console.log('percAdministracao: ' + percAdministracao)
        console.log('percPgtoBilhete: ' + percPgtoBilhete)
        vlrTotalBilhetesPrevisto = qtdBilhetes * vlrBilhete;
        console.log('vlrTotalBilhetesPrevisto: ' + vlrTotalBilhetesPrevisto)
        vlrTotalTaxaAdministracaoPrevisto = vlrTotalBilhetesPrevisto * percAdministracao / 100;
        console.log('vlrTotalTaxaAdministracaoPrevisto: ' + vlrTotalTaxaAdministracaoPrevisto)
        vlrTotalTaxaBilhetesPrevisto = vlrTotalBilhetesPrevisto * percPgtoBilhete / 100;
        console.log('vlrTotalTaxaBilhetesPrevisto: ' + vlrTotalTaxaBilhetesPrevisto)  
        vlrLiquidoAReceberResponsavelPrevisto = vlrTotalBilhetesPrevisto - vlrTotalTaxaAdministracaoPrevisto - vlrTotalTaxaBilhetesPrevisto;
        console.log('vlrLiquidoAReceberResponsavelPrevisto: ' + vlrLiquidoAReceberResponsavelPrevisto);
        let dadosRifa = {
            titulo: titulo,
            descricao: descricao,
            imagemCapa: urlImagemCapa,
            genero: genero,
            uid: usuario.uid,
            cep: usuario.cep,
            cidade: usuario.cidade,
            uf: usuario.uf,
            bairro: usuario.bairro,
            nome: usuario.nome,
            email: usuario.email,
            nomeCapa: nomeImagem,
            post: 'imagemRifa',
            qtdBilhetes: parseInt(qtdBilhetes),
            vlrBilhete: parseInt(vlrBilhete),
            autorizacao: autorizacao,
            vlrPremioPix: 0,
            percAdministracao: percAdministracao,
            percPgtoBilhete: percPgtoBilhete,
            vlrTotalBilhetesPrevisto: vlrTotalBilhetesPrevisto,
            vlrTotalTaxaAdministracaoPrevisto: vlrTotalTaxaAdministracaoPrevisto,
            vlrTotalTaxaBilhetesPrevisto: vlrTotalTaxaBilhetesPrevisto,
            vlrLiquidoAReceberResponsavelPrevisto: vlrLiquidoAReceberResponsavelPrevisto
        }
        console.log('ir para informar validar disponibilizacao')
        navigation.navigate('ValidarDisponibilizacao', dadosRifa);
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
                setMensagemCadastro('Ops, erro ao selecionar foto do premio')
            });
    }

    const handleOptionSelect = (index, value) => {
        setGenero(value);
    };

    return (
        <SafeAreaView style={estilos.safeArea}>
            <Texto>
                Título do prêmio
            </Texto>
            <Input
                autoCorrect={false}
                autoCaptalize='none'
                value={titulo}
                onChangeText={(text) => setTitulo(text)}
            />
            <Texto>
                Descricao do prêmio
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
                Qtd de bilhetes da rifa (10, 100 ou 1000)
            </Texto>
            <InputQtd
                autoCorrect={false}
                keyboardType="numeric"
                value={qtdBilhetes}
                onChangeText={(text) => setQtdBilhetes(text)}
            />
            <Texto>
                Valor do bilhete R$
            </Texto>
            <InputQtd
                autoCorrect={false}
                keyboardType="numeric"
                value={vlrBilhete}
                onChangeText={(text) => setVlrBilhete(text)}
            />
            <Texto>
                Autorização
            </Texto>
            <InputQtd
                autoCorrect={false}
                autoCaptalize='none'
                value={autorizacao}
                onChangeText={(text) => setAutorizacao(text)}
            />
            <AreaCapa>
                <TouchableOpacity style={estilos.imagemCapa}
                    onPress={() => selecionarCapa()}>
                    <Image source={imagemCapa ? { uri: imagemCapa } : capabranca}
                        resizeMode={"cover"}
                        style={estilos.imagemCapa} />
                </TouchableOpacity>
                <Texto>
                    Foto do prêmio
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