import React, { useContext, useEffect, useState } from 'react';
import { Texto, AreaAvatar, Container, Nome, Sugestoes, AreaBotao, AreaPerfil, SubmitButton, SubmitText }
    from './styles';
import { AuthContext } from '../../contexts/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import estilos from '../../estilos/estilos';
import avatar from '../../assets/avatar.jpg';

export default function Perfil() {
    console.log('Perfil');
    const { user, signOut } = useContext(AuthContext);
    const navigation = useNavigation();
    const [imagemAvatar, setImagemAvatar] = useState('');

    useEffect(() => {
        async function carregarDadosConta() {
            console.log('carregarDadosConta')
            if (user) {
                //                //console.log('user: ' + user.imagemAvatar)
                setImagemAvatar(user.imagemAvatar)
            }
        }
        carregarDadosConta()
    }, [])
  
    function sair() {
        console.log('sair')
        signOut();
    }

    function liberarRifas() {
        console.log('liberarRifas')
        //navigation.navigate('LiberarRifas')
    }

    function alterarDadosConta() {
        console.log('alterarDadosConta')
        navigation.navigate('AlterarConta')
    }

    function excluirConta() {
        console.log('excluirConta')
        //navigation.navigate('ExcluirConta')
    }

    function excluirRifaDisponibilizada() {
        console.log('excluirRifaDisponibilizada')
        //navigation.navigate('ExcluirRifaDisponibilizada')
    }

    return (
        <Container>
            <AreaAvatar>
                <TouchableOpacity style={estilos.imagemAvatar}
                    onPress={() => alterarDadosConta()}>
                    <Image source={imagemAvatar ? { uri: imagemAvatar } : avatar}
                        resizeMode={"cover"}
                        style={estilos.imagemAvatar} />
                </TouchableOpacity>
                <TouchableOpacity style={estilos.imagemAvatar}
                    onPress={() => alterarDadosConta()}>
                    <Texto>
                        Editar perfil
                        </Texto>
                </TouchableOpacity>
            </AreaAvatar>
            <AreaPerfil>
                <Nome>
                    {user && user.nome}
                </Nome>
                <Nome>
                    {user && user.email}
                </Nome>
                <Nome>
                    {user && user.cep} {user && user.cidade} {user && user.uf} {user && user.bairro}
                </Nome>
                <Nome>
                    Número da sorte: {user && user.numeroSorte}
                </Nome>                
            </AreaPerfil>
            <AreaBotao>
                <SubmitButton onPress={sair}>
                    <SubmitText>
                        Bora tomar um café ?
                        </SubmitText>
                </SubmitButton>
                <Icon
                    name='coffee-to-go-outline' size={30} color='#FFFFFF' style={styles.icon}
                />
            </AreaBotao>
            {user && user.perfil == 'adm' ?
                <AreaBotao>
                    <SubmitButton onPress={liberarRifas}>
                        <SubmitText>
                            Liberar Rifas
                        </SubmitText>
                    </SubmitButton>
                    <Icon
                        name='book-check-outline' size={30} color='#FFFFFF' style={styles.icon}
                    />
                </AreaBotao>
                :
                null
            }
            <Sugestoes>
                Tem uma sugestão, crítica ou denúncia? Envie email para veronesedigital@gmail.com
            </Sugestoes>
            <View style={{ marginTop: 5 }}>
                <TouchableOpacity style={estilos.link} onPress={() => excluirRifaDisponibilizada()}>
                    <Text style={estilos.linkText}>Excluir rifa disponibilizada</Text>
                </TouchableOpacity>
            </View> 
            <View style={{ marginTop: 5 }}>
                <TouchableOpacity style={estilos.link} onPress={() => excluirConta()}>
                    <Text style={estilos.linkText}>Excluir minha conta</Text>
                </TouchableOpacity>
            </View>
          
        </Container>
    )
}
const styles = StyleSheet.create({
    icon: {
        marginLeft: -50,
    },
});