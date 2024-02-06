import React, { useState, useEffect } from 'react';
import { Animated, View, SafeAreaView, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import {
    BotaoSaiNet,
    Small, Original, SubmitText, RifaText, ListaRifas, AreaBotaoReservar,
    RifaTextTitulo, ContentText, TextoBotaoSaiNet
} from './styles';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import IconR from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RifasDisponiveisList({ data, shouldLoad = false }) {
    console.log('RifasDisponiveisList');
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false);
    const [paused, setPaused] = useState(true);
    const [mute, setMute] = useState(false);
    const [videoVolume, setVideoVolume] = useState(1.0);
    const opacity = new Animated.Value(0);
    const AnimatedOriginal = Animated.createAnimatedComponent(Original);

    useEffect(() => {
        if (shouldLoad) {
            setLoaded(true);
            setPaused(false)
        }
    }, [shouldLoad])

    function handleAnimate() {
        Animated.timing(opacity, {
            duration: 500,
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }

    function navegaAquisicao() {
        console.log('navegaAquisicao')
        navigation.navigate('ValidarAquisicao', data);
    }

    function sairNet() {
        console.log('saidaNet')
        navigation.navigate('SaidaNet', data);
    }

    function controlarVolume() {
        console.log('controlarVolume')
        if (mute) {
            setMute(false);
            setVideoVolume(1.0);
        } else {
            setMute(true);
            setVideoVolume(0.0);
        }
    }

    return (
        <SafeAreaView>
            {data.post == 'imagemRifa' ?
                (<View style={styles.card}>
                    <AnimatedOriginal
                        onLoadEnd={handleAnimate}
                        source={{ uri: data.imagemCapa }}
                        resizeMode="cover"
                        style={styles.capa}
                    />
                    <ListaRifas>
                        <RifaTextTitulo> {data.titulo} </RifaTextTitulo>
                        <ContentText numberOfLines={8}>
                            {data.descricao}
                        </ContentText>
                        <RifaText> Responsável: {data.nome} </RifaText>
                        <RifaText> {data.cidade} {data.uf} {data.bairro} </RifaText>
                        <RifaText> Data final vendas: {data.dataFinalVendas} </RifaText>
                        <RifaText> Qtd nrs: {data.qtdNrs} Vlr bilhete: {data.vlrBilhete}</RifaText>
                        <RifaText> Autorizacao: {data.autorizacao} </RifaText>
                    </ListaRifas>
                    <AreaBotaoReservar onPress={navegaAquisicao}>
                        <SubmitText>
                            Eu quero adquirir bilhetes desta rifa
                        </SubmitText>
                    </AreaBotaoReservar>
                </View>
                )
                : data.post == 'imagemAdvertising' ? (
                    <View style={styles.card}>
                        <AnimatedOriginal
                            onLoadEnd={handleAnimate}
                            source={{ uri: data.url }}
                            resizeMode="cover"
                            style={styles.capa}
                        />
                        <BotaoSaiNet>
                            <TouchableWithoutFeedback onPress={sairNet}>
                                <TextoBotaoSaiNet>
                                    {data.texto}
                                </TextoBotaoSaiNet>
                            </TouchableWithoutFeedback>
                            <View style={{ marginTop: -20, marginLeft: 350 }}>
                                <IconR name='chevron-right' size={20} color='#000' />
                            </View>
                        </BotaoSaiNet>
                    </View>
                )
                    :
                    (<View style={styles.card}>
                        <Small
                            source={{ uri: data.logo }}
                            resizeMode="cover"
                        >
                            {loaded && (
                                <Video source={{ uri: data.url }}
                                    resizeMode={"cover"}
                                    paused={paused}
                                    style={styles.capa}
                                    volume={videoVolume}
                                />
                            )}
                        </Small>
                        <View style={styles.dot}>
                            <TouchableOpacity onPress={controlarVolume}>
                                {mute ? (
                                    <Icon name='volume-mute-outline' size={20} color='#FFFFFF' />
                                ) : (
                                    <Icon name='volume-high-outline' size={20} color='#FFFFFF' />
                                )
                                }
                            </TouchableOpacity>
                        </View>
                        <BotaoSaiNet>
                            <TouchableWithoutFeedback onPress={sairNet}>
                                <TextoBotaoSaiNet>
                                    {data.texto}
                                </TextoBotaoSaiNet>
                            </TouchableWithoutFeedback>
                        </BotaoSaiNet>
                        <View style={{ marginTop: -25, marginLeft: 350 }}>
                            <IconR name='chevron-right' size={20} color='#000' />
                        </View>
                    </View>
                    )
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        backgroundColor: '#FFF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        margin: 15,
        shadowRadius: 5,
        borderRadius: 5,
        elevation: 3,
    },
    capa: {
        width: '100%',
        height: 400,
        borderRadius: 5,
    },
    dot: {
        backgroundColor: '#000',
        width: 20,
        height: 20,
        borderRadius: 10,
        marginTop: -40,
        marginLeft: 325,
    },

})