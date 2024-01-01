import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator,StyleSheet }
    from 'react-native';
import { Texto, TextoEmail } from '../ExcluirConta/styles'
import estilos from '../../estilos/estilos';
import Botao from '../../componentes/Botao';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import ModalDropdown from 'react-native-modal-dropdown';
import { marcaContaAExcluir, obtemMotivosExcluirConta } from '../../servicos/firestore';

export default function ExcluirConta() {
    console.log('ExcluirConta')
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [contaExcluida, setContaExcluida] = useState(false);
    const { user, signOut } = useContext(AuthContext);
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const [motivo, setMotivo] = useState(' Escolha motivo excluir conta');
    const [descricaoMotivo, setDescricaoMotivo] = useState([]);

    useEffect(() => {
        carregaMotivosList();
    }, []);

    async function carregaMotivosList() {
        console.log('carregaMotivosList');
        setLoading(true)
        const motivosExcluirContaFirestore = await obtemMotivosExcluirConta()
        var descricaoMotivoArray = []
        for (var g = 0; g < motivosExcluirContaFirestore.length; g++) {
            const descrMotivo = motivosExcluirContaFirestore[g].motivo;
            descricaoMotivoArray.push(descrMotivo);
        }
        setDescricaoMotivo(descricaoMotivoArray)
        setLoading(false)
    }

    async function validarExclusaoConta() {
        console.log('validarExclusaoConta: ' + motivo);
        if (motivo === ' Escolha motivo excluir conta' || typeof motivo === "undefined") {
            setMensagemCadastro('Escolha o motivo excluir conta')
            return
        } else {
            try {
                setLoading(true)
                const resultado = await marcaContaAExcluir(user.uid, motivo);
                if (resultado == 'sucesso') {
                    setMensagemCadastro('Obrigado por ter utilizado a plataforma Acao entre amigos.')
                    await delay(3000);
                    setLoading(false)
                    sair();
                }
            } catch (error) {
                console.log('Ops, Algo deu errado em excluiConta ' + error.message);
                setMensagemCadastro('Falha excluir conta. Verifique sua conexão de internet');
                setLoading(false)
                return;
            }
        }
    }

    async function sair() {
        console.log('sair')
        signOut();
        navigation.navigate('SignIn');
    }

    const handleOptionSelect = (index, value) => {
        setMotivo(value);
    };

    return (
        <SafeAreaView style={estilos.safeArea}>
            <TextoEmail>
                {user.email}
            </TextoEmail>
            <Texto>
                Motivo excluir sua conta
            </Texto>
            <View style={styles.container}>
                <ModalDropdown
                    options={descricaoMotivo}
                    defaultValue={motivo}
                    onSelect={handleOptionSelect}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownDropdown}
                    dropdownTextStyle={styles.dropdownDropdownText}
                />
            </View>
            <View style={estilos.areaMensagemCadastro}>
                <Text style={estilos.textoMensagemCadastro}>
                    {mensagemCadastro}
                </Text>
            </View>
            {
                contaExcluida ?
                    <Botao onPress={sair}>
                        <Text>Ok</Text>
                    </Botao>
                    :
                    <Botao onPress={validarExclusaoConta}>
                        {loading ? (
                            <ActivityIndicator size={20} color='#FFF' />
                        ) : (
                            <Text>Excluir conta</Text>
                        )
                        }
                    </Botao>
            }
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