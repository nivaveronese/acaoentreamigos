import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import styles from './styles';

export default function Progresso({value,onMoveTop}) {
    const widthContainer = useSharedValue(200)
    const endReach = value >= 95;
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: widthContainer.value
        }
    })

    useEffect(() => {
        widthContainer.value = withSpring(endReach ? 350 : 200, {mass: 0.4});
    },[value]);

    return (
        <Animated.View style={[styles.container,animatedStyle]}>
            { 
                endReach ? 
                    <TouchableOpacity onPress={onMoveTop}>
                        <Text style={styles.texto}> Eu concordo com os termos de uso</Text>
                    </TouchableOpacity>
                :
                <>
                    <Text style={styles.value}>
                        {value.toFixed(0)}%
                    </Text>
                    <View style={styles.tracker}>
                        <View style={[styles.progress,{width: `${value}%`}]}/>
                    </View>
                </>
             }
        </Animated.View>
    );
}