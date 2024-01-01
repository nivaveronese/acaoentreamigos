import React from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { Carrossel } from '../../componentes/Carrossel';
import itens from './cards';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';

export default function Apresentacao({ navigation }) {

    function avancar() {
        navigation.navigate('SignIn');
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#131313' barStyle='light-content' />
            <View style={styles.carrosselArea}>
                <Carrossel data={itens} tempoAnimacao={2000} />
            </View>
            <View style={styles.areaMedica}>
                <Image
                    source={require('../../assets/acaoentreamigos2.jpg')}
                    style={styles.medicaImg}
                />
            </View>
            <View style={styles.areaDetalhes}>
                <Text style={styles.subTitulo}>Entre agora! Só falta você.</Text>
                <View style={styles.areaTexto}>
                    <Feather
                        name='user-check'
                        size={15}
                        color='#008080'
                    />
                    <Text style={styles.texto}>
                        Crie sua Rifa, e convide seus amigos para adquirir bilhetes
                    </Text>
                </View>
                <View style={styles.areaTexto}>
                    <Feather
                        name='user-check'
                        size={15}
                        color='#008080'
                    />
                    <Text style={styles.texto}>
                        Adquira bilhetes de Rifas de seus amigos
                    </Text>
                </View>
                <View style={styles.areaTexto}>
                    <Feather
                        name='user-check'
                        size={15}
                        color='#008080'
                    />
                    <Text style={styles.texto}>
                        Os sorteios das Rifas são pela Loteria Federal
                    </Text>
                </View>
                <TouchableOpacity style={styles.botao} onPress={avancar}>
                    <Text style={styles.botaoTexto}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}