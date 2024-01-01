import { StyleSheet } from "react-native"; 

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  carrosselArea: {
    height: 100,
    marginLeft: -30,
  },
  areaMedica: {

  },
  areaTexto: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  medicaImg: {
    width: '100%',
    height: 200,
    marginTop: 50,
  },
  areaDetalhes: {
    flex: 1,
    marginLeft: 10,
  },
  titulo: {
    fontFamily: "Roboto",
    fontSize: 25,
    color: '#464646',
  },
  subTitulo: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 14,
    color: '#464646',
    marginBottom: 15,
    marginLeft: 70
  },
  texto: {
    fontSize: 12,
    marginTop: 10,
    marginLeft: 5,
    fontFamily: "Roboto",
    color: '#464646',
  }, 
  botao: {
    height: 40,
    width: "90%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#008080',
    marginVertical: 20,
    marginLeft: 15
  },
  botaoTexto: {
    fontWeight: "500",
    fontFamily: "Roboto",
    fontSize: 16,
    color: '#FFFFFF',
  },
  viewCabecalho: {
    height: 50,
    marginTop: 20,
    alignContent: "center",
    alignItems: "center"
  },
});