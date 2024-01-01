import React from "react";
import { View, Image,StyleSheet,SafeAreaView } from "react-native";
import shimmerGif from '../../assets/shimmer.gif';
import {ListaRifas} from '../RifasDisponiveisList/styles';

export function RifasDisponiveisListShimmerEffect() {
  return (
    <SafeAreaView>
      <View style={styles.card}>
        <Image source={shimmerGif} style={styles.capa} />
        <ListaRifas>
          <Image source={shimmerGif} style={{ width: 300, height: 20, marginTop: 5 }} />
          <Image source={shimmerGif} style={{ width: 200, height: 20, marginTop: 5 }} />
          <Image source={shimmerGif} style={{ width: 150, height: 20, marginTop: 5 }} />
          <Image source={shimmerGif} style={{ width: 180, height: 20, marginTop: 5 }} />
          <Image source={shimmerGif} style={{ width: 20, height: 20, marginTop: 5 }} />
        </ListaRifas>
      </View>
      <View style={styles.card}>
        <Image source={shimmerGif} style={styles.capa} />
        <ListaRifas>
          <Image source={shimmerGif} style={{ width: 300, height: 20, marginTop: 5 }} />
          <Image source={shimmerGif} style={{ width: 200, height: 20, marginTop: 5 }} />
          <Image source={shimmerGif} style={{ width: 150, height: 20, marginTop: 5 }} />
          <Image source={shimmerGif} style={{ width: 180, height: 20, marginTop: 5 }} />
          <Image source={shimmerGif} style={{ width: 20, height: 20, marginTop: 5 }} />
        </ListaRifas>
      </View>      
    </SafeAreaView>
  );
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
    elevation: 3
  },
  capa: {
    width: '100%',
    height: 300,
    borderRadius: 5,
  }
})