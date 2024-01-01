import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const RadioPesquisar = ({options=[], horizontal=false, onChangeSelect, selected}) => {

    return(
            <View style={horizontal ? styles.horizontal : styles.vertical}>
               {options.map((opt,index) => (
                   <TouchableOpacity 
                        onPress= {() => onChangeSelect(opt,index)} 
                        style={styles.optContainer}>
                            <View style={styles.outlineCircle}>
                                {selected == index && <View style={styles.innerCircle}/>}
                            </View>    
                            <Text style={[styles.txt,{color: selected == index ? '#444' : '#777'}]}> {opt} </Text>
                   </TouchableOpacity>
               ))}                  
            </View>
    );
};

const styles = StyleSheet.create({
    horizontal:{
        flexDirection: 'row'
    },
    vertical:{
    },
    optContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    outlineCircle:{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: '#777',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:10   
    },
    innerCircle:{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#444'
    },
    txt: {
        fontSize: 14,
        marginLeft: 7,
        fontFamily: 'roboto',
        color: '#333',
    }, 
});
export default RadioPesquisar;