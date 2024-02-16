import { db } from '../config/firebase';
import {
  collection, getDocs, getDoc, doc, query, runTransaction,
  where, orderBy, limit, increment, writeBatch, Timestamp, getCountFromServer
} from "firebase/firestore"
import { subHours, format, addDays } from 'date-fns';

export async function desgravaPreReservaTransacao(idRifa, idBilhete) {
  console.log('firestore-desgravaPreReservaTransacao: ' + idRifa + ' - ' + idBilhete)
  var resultado = 'sucesso';
  const refNomeColecaoNrsBilhetesRifaDisponivel = 'nrsBilhetesRifaDisponivel-' + `${idRifa}`;
  const sfDocRef = doc(db, refNomeColecaoNrsBilhetesRifaDisponivel, `${idBilhete}`)
  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (sfDoc.exists) {
        if (sfDoc.data().situacao == 'pre-adquirido') {
          console.log('firestore-desgravaPreReservaTransacao: ' + sfDoc.data().idBilhete);
          transaction.update(sfDocRef, {
            situacao: 'livre',
            uidAdquiriu: '',
            dataAdquiriu: ''
          })
          console.log('firestore-desgravaPreReservaTransacao-bilhete desgravado com sucesso')
          resultado = 'sucesso'
          console.log('firestore-resultado: ' + resultado)
        }
        else {
          console.log('firestore-desgravaPreReservaTransacao-bilhete nao esta na situacao de pre-adquirido')
          resultado = 'firestore-desgravaPreReservaTransacao-bilhete nao esta na situacao de pre-adquirido';
          console.log('firestore-resultado: ' + resultado)
        }
      }
      else {
        console.log('firestore-desgravaPreReservaTransacaos-fDoc nao existe ')
        resultado = 'firestore-desgravaPreReservaTransacao-sfDoc nao existe '
        console.log('firestore-resultado: ' + resultado)
      }
    })
  }
  catch (error) {
    console.log('firestore-erro desgravaPreReservaTransacao-runTransaction: ' + error.code)
    resultado = 'firestore-erro desgravaPreReservaTransacao-runTransaction'
    return resultado;
  }
  console.log('firestore-resultado final: ' + resultado)
  return resultado;
}

export async function excluiRifaNaoLiberadaTransacao(idRifa) {
  console.log('firestore-excluiRifaNaoLiberadaTransacao: ' + idRifa)
  const batch = writeBatch(db);
  const rifaRef = doc(db, "rifasNaoLiberadas", idRifa);
  try {
    batch.delete(rifaRef);
    await batch.commit();
    return 'sucesso';
  } catch (error) {
    console.log('Ops, Algo deu errado em excluiRifaNaoLiberadaTransacao ' + error.code);
    return 'Falha em excluiRifaNaoLiberadaTransacao. Tente novamente'
  }
}
 
export async function gravaDadosParaRecebimentoPremioPix(dadosParaRecebimentoPremioPix) {
  console.log('firestore-gravaDadosParaRecebimentoPremioPix: ' + ' - ' + dadosParaRecebimentoPremioPix.idRifa)
  const resultDate = subHours(new Date(), 0);
  const dataGravacaoDadosParaRecebimentoPremioPix = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  const batch = writeBatch(db);
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("id", "==", dadosParaRecebimentoPremioPix.idRifa));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let docRef = doc.ref;
      batch.update(docRef, {
        situacao: 'dados para recebimento prêmio pix gravado',
        dataGravacaoDadosParaRecebimentoPremioPix: dataGravacaoDadosParaRecebimentoPremioPix,
        tipoChavePixGanhador: dadosParaRecebimentoPremioPix.tipoChavePixGanhador,
        chavePixGanhador: dadosParaRecebimentoPremioPix.chavePixGanhador,
        nomePessoaChavePixGanhador: dadosParaRecebimentoPremioPix.nomePessoaChavePixGanhador
      })
    });
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    return 'Falha em gravaDadosParaRecebimentoPremioPix'
  }
}

export async function gravaConfirmacaoPremio(id, premio) {
  console.log('firestore-gravaConfirmacaoPremio ' + id + ' - ' + premio)
  const resultDate = subHours(new Date(), 0);
  const dataConfirmacaoPremio = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  const batch = writeBatch(db);
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let docRef = doc.ref;
      batch.update(docRef, {
        situacao: 'a definir data sorteio',
        dataConfirmacaoPremio: dataConfirmacaoPremio,
        premioDefinido: premio,
        quemDefiniuPremio: 'responsavel'
      })
    });
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    return 'Falha em gravaConfirmacaoPremio'
  }
}

export async function gravaPagamentoPreReservaTransacao(data) {
  console.log('firestore-gravaPagamentoPreReservaTransacao ')
  console.log(data)
  const batch = writeBatch(db);
  const refNomeColecaoRifa = 'pagamentosPreReservaRifa-' + `${data.id}`;
  console.log('firestore-refNomeColecaoRifa: ' + refNomeColecaoRifa)
  const pgtoRifaRef = doc(collection(db, refNomeColecaoRifa));
  var idPgto = pgtoRifaRef.id;
  console.log('firestore-pgtoRifaRef.id: ' + pgtoRifaRef.id)
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 0);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  try {
    batch.set(pgtoRifaRef, {
      idRifa: data.id,
      idPgto: idPgto,
      vlrBilhete: data.vlrBilhete,
      vlrTotalBilhetes: data.vlrTotalBilhetes,
      usuarioUid: data.usuarioUid,
      usuarioQtdBilhetes: data.usuarioQtdBilhetes,
      bilhetesPreReservados: data.bilhetesPreReservados,
      nrsBilhetesPreReservados: data.nrsBilhetesPreReservados,
      numeroCartaoCredito: data.numeroCartaoCredito,
      nomeCartaoCredito: data.nomeCartaoCredito,
      mesValidadeCartaoCredito: data.mesValidadeCartaoCredito,
      anoValidadeCartaoCredito: data.anoValidadeCartaoCredito,
      cvvCartaoCredito: data.cvvCartaoCredito,
      cpfCartaoCredito: data.cpfCartaoCredito,
      dataPagamento: dataCadastro,
      dataPagamentoSeq: dataCadastroSeq
    });
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaPagamentoPreReservaTransacao-pagamentosPreReservaRifa ' + error.code);
    return 'Falha em gravaPagamentoPreReservaTransacao-pagamentoPreReservaRifa. Tente novamente'
  }
  try {
    const refNomeColecaoUsuario = 'pagamentosPreReservaUsuario-' + `${data.usuarioUid}`;
    console.log('firestore-refNomeColecaoUsuario: ' + refNomeColecaoUsuario)
    const pgtoUsuarioRef = doc(collection(db, refNomeColecaoUsuario));
    batch.set(pgtoUsuarioRef, {
      idRifa: data.id,
      idPgto: idPgto,
      dataPagamentoSeq: dataCadastroSeq,
      dataPagamento: dataCadastro,
      qtdBilhetes: data.usuarioQtdBilhetes,
      vlrBilhete: data.vlrBilhete,
      vlrTotalBilhetes: data.vlrTotalBilhetes,
      nrsBilhetesPreReservadosFormatados: data.nrsBilhetesPreReservadosFormatados
    })
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaPagamentoPreReservaTransacao-pagamentosPreReservaUsuario ' + error.code);
    return 'Falha em gravaPagamentoPreReservaTransacao-pagamentosPreReservaUsuario. Tente novamente'
  }
  try {
    const refNomeColecaoB = 'nrsBilhetesRifaDisponivel-' + `${data.id}`;
    console.log('firestore-refNomeColecaoB: ' + refNomeColecaoB)
    let qtdBilhetesPreReservados = 0;
    while (qtdBilhetesPreReservados < data.bilhetesPreReservados.length) {
      const nrsBilhetesRef = doc(db, refNomeColecaoB, `${data.bilhetesPreReservados[qtdBilhetesPreReservados]}`);
      batch.update(nrsBilhetesRef, {
        idPgto: idPgto,
        dataPgto: dataCadastro,
        cpfPgto: data.cpfCartaoCredito,
        situacao: 'pago'
      });
      qtdBilhetesPreReservados = qtdBilhetesPreReservados + 1;
    }
    await batch.commit();
    return 'sucesso'
  }
  catch (error) {
    console.log('Ops, Algo deu errado em gravaPagamentoPreReservaTransacao-nrsBilhetesRifaDisponivel ' + error.code);
    return 'Falha em gravaPagamentoPreReservaTransacao-nrsBilhetesRifaDisponivel. Tente novamente'
  }
}

export async function gravaPreReservaTransacao(dadosPreReserva, dadosBilhetePreReserva) {
  console.log('firestore-gravaPreReservaTransacao ')
  console.log(dadosPreReserva)
  console.log(dadosBilhetePreReserva)
  var resultado = 'sucesso'
  const refNomeColecaoNrsBilhetesRifaDisponivel = 'nrsBilhetesRifaDisponivel-' + `${dadosPreReserva.id}`;
  const sfDocRef = doc(db, refNomeColecaoNrsBilhetesRifaDisponivel, `${dadosBilhetePreReserva.idBilhete}`)
  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (sfDoc.exists) {
        if (sfDoc.data().situacao == 'livre') {
          console.log('firestore-bilhete pre-adquirido: ' + sfDoc.data().idBilhete);
          transaction.update(sfDocRef, {
            situacao: 'pre-adquirido',
            uidAdquiriu: dadosPreReserva.usuarioUid,
            dataAdquiriu: dadosPreReserva.dataPreReserva
          })
          console.log('firestore-bilhete pre-adquirido com sucesso')
          resultado = 'sucesso';
        }
        else {
          console.log('firestore-bilhete ja pre-adquirido')
          resultado = 'firestore-bilhete ja pre-adquirido';
        }
      }
      else {
        console.log('firestore-sfDoc nao existe ')
        resultado = 'firestore-sfDoc nao existe';
      }
    })
  }
  catch (error) {
    console.log('firestore-erro gravaPreReservaTransacao-runTransaction: ' + error.code)
    resultado = 'firestore-erro gravaPreReservaTransacao-runTransaction'
    return resultado;
  };
  return resultado;
}

export async function gravaRifaLiberadaTransacao(data) {
  console.log('firestore-gravaRifaLiberadaTransacao ')
  console.log(data)
  const batch = writeBatch(db);
  const rifaRef = doc(collection(db, "rifasDisponiveis"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const dataFinalVendasSeq = Timestamp.fromDate(new Date(Date.now() + 15552000000));
  const resultDataFinalVendas = addDays(new Date(), 180);
  const dataFinalVendas = format(resultDataFinalVendas, 'dd/MM/yyyy')
  const resultDate = subHours(new Date(), 0);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  const idRifa = rifaRef.id;
  console.log('rifaRef.id: ' + rifaRef.id)
  console.log('data.id: ' + data.id)
  try {
    batch.set(rifaRef, {
      titulo: data.titulo,
      descricao: data.descricao,
      imagemCapa: data.imagemCapa,
      genero: data.genero,
      uid: data.uid,
      cep: data.cep,
      cidade: data.cidade,
      uf: data.uf,
      bairro: data.bairro,
      nome: data.nome,
      email: data.email,
      dataCadastro: dataCadastro,
      dataCadastroSeq: dataCadastroSeq,
      dataFinalVendas: dataFinalVendas,
      dataFinalVendasSeq: dataFinalVendasSeq,
      nomeCapa: data.nomeCapa,
      post: data.post,
      cidadeUf: data.cidade + data.uf,
      qtdBilhetes: data.qtdBilhetes,
      autorizacao: data.autorizacao,
      vlrPremioPix: data.vlrPremioPix,
      vlrBilhete: data.vlrBilhete,
      percAdministracao: data.percAdministracao,
      percPgtoBilhete: data.percPgtoBilhete,
      vlrTotalBilhetesPrevisto: data.vlrTotalBilhetesPrevisto,
      vlrTotalTaxaAdministracaoPrevisto: data.vlrTotalTaxaAdministracaoPrevisto,
      vlrTotalTaxaBilhetesPrevisto: data.vlrTotalTaxaBilhetesPrevisto,
      vlrLiquidoAReceberResponsavelPrevisto: data.vlrLiquidoAReceberResponsavelPrevisto,
      id: idRifa,
      situacao: 'ativa'
    });
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaLiberadaTransacao-RifasDisponiveis ' + error.code);
    return 'Falha em gravaRifaLiberadaTransacao-RifasDisponiveis. Tente novamente'
  }
  try {
    const refNomeColecao = 'nrsBilhetesRifaDisponivel-' + `${idRifa}`;
    let nroBilhete = 0;
    while (nroBilhete < data.qtdBilhetes) {
      const nrsBilhetesRef = doc(collection(db, refNomeColecao));
      const idBilhete = nrsBilhetesRef.id;
      batch.set(nrsBilhetesRef, {
        idBilhete: idBilhete,
        nroBilhete: nroBilhete,
        situacao: 'livre'
      });
      nroBilhete = nroBilhete + 1;
    }
  }
  catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaLiberadaTransacao-nrsBilhetesRifaDisponivel ' + error.code);
    return 'Falha em gravaRifaLiberadaTransacao-nrsBilhetesRifaDisponivel. Tente novamente'
  }
  try {
    const rifaDRef = doc(db, "rifasALiberar", data.id);
    batch.delete(rifaDRef);
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaLiberadaTransacao-RifasALiberar ' + error.code);
    return 'Falha em lgravaRifaLiberadaTransacao-RifasALiberar. Tente novamente'
  }
}

export async function gravaRifaALiberarTransacao(data) {
  console.log('firestore-gravaRifaALiberarTransacao: ' + data.titulo)
  const batch = writeBatch(db);
  const rifaRef = doc(collection(db, "rifasALiberar"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 0);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  try {
    batch.set(rifaRef, {
      titulo: data.titulo,
      descricao: data.descricao,
      imagemCapa: data.imagemCapa,
      genero: data.genero,
      uid: data.uid,
      cep: data.cep,
      cidade: data.cidade,
      uf: data.uf,
      bairro: data.bairro,
      nome: data.nome,
      email: data.email,
      dataCadastro: dataCadastro,
      dataCadastroSeq: dataCadastroSeq,
      nomeCapa: data.nomeCapa,
      post: data.post,
      cidadeUf: data.cidade + data.uf,
      qtdBilhetes: data.qtdBilhetes,
      autorizacao: data.autorizacao,
      vlrPremioPix: data.vlrPremioPix,
      vlrBilhete: data.vlrBilhete,
      percAdministracao: data.percAdministracao,
      percPgtoBilhete: data.percPgtoBilhete,
      vlrTotalBilhetesPrevisto: data.vlrTotalBilhetesPrevisto,
      vlrTotalTaxaAdministracaoPrevisto: data.vlrTotalTaxaAdministracaoPrevisto,
      vlrTotalTaxaBilhetesPrevisto: data.vlrTotalTaxaBilhetesPrevisto,
      vlrLiquidoAReceberResponsavelPrevisto: data.vlrLiquidoAReceberResponsavelPrevisto
    });
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaALiberarTransacao ' + error.code);
    return 'Falha em gravaRifaALiberarTransacao. Tente novamente'
  }
}

export async function gravaRifaNaoLiberadaTransacao(data) {
  console.log('firestore-gravaRifaNaoLiberadaTransacao ' + data.titulo)
  const batch = writeBatch(db);
  const rifaRef = doc(collection(db, "rifasNaoLiberadas"));
  try {
    batch.set(rifaRef, {
      titulo: data.titulo,
      descricao: data.descricao,
      imagemCapa: data.imagemCapa,
      genero: data.genero,
      uid: data.uid,
      cep: data.cep,
      cidade: data.cidade,
      uf: data.uf,
      bairro: data.bairro,
      nome: data.nome,
      email: data.email,
      dataCadastro: data.dataCadastro,
      dataCadastroSeq: data.dataCadastroSeq,
      nomeCapa: data.nomeCapa,
      post: data.post,
      cidadeUf: data.cidade + data.uf,
      qtdBilhetes: data.qtdBilhetes,
      autorizacao: data.autorizacao,
      vlrPremioPix: data.vlrPremioPix,
      vlrBilhete: data.vlrBilhete,
      percAdministracao: data.percAdministracao,
      percPgtoBilhete: data.percPgtoBilhete,
      vlrTotalBilhetesPrevisto: data.vlrTotalBilhetesPrevisto,
      vlrTotalTaxaAdministracaoPrevisto: data.vlrTotalTaxaAdministracaoPrevisto,
      vlrTotalTaxaBilhetesPrevisto: data.vlrTotalTaxaBilhetesPrevisto,
      vlrLiquidoAReceberResponsavelPrevisto: data.vlrLiquidoAReceberResponsavelPrevisto
    });
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaNaoLiberadaTransacao-RifasNaoLiberadas ' + error.code);
    return 'Falha em gravaRifaNaoLiberadaTransacao-RifasNaoLiberadas. Tente novamente'
  }
  try {
    const rifaDRef = doc(db, "rifasALiberar", data.id);
    batch.delete(rifaDRef);
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaNaoLiberadaTransacao-RifasALiberar ' + error.code);
    return 'Falha em gravaRifaNaoLiberadaTransacao-RifasALiberar. Tente novamente'
  }
}

export async function marcaRifaDisponibilizadaAExcluirTransacao(id) {
  console.log('firestore-marcaRifaDisponibilizadaAExcluirTransacao ' + id)
  const resultDate = subHours(new Date(), 0);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  const batch = writeBatch(db);
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let docRef = doc.ref;
      batch.update(docRef, {
        situacao: 'a excluir',
        dataSolicitacaoExcluir: dataCadastro
      })
    });
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    return 'Falha em marcaRifaDisponibilizadaAExcluirTransacao'
  }
}

export async function marcaContaAExcluir(uid, id) {
  console.log('firestore-marcaContaAExcluir ' + uid + '-' + id)
  const resultDate = subHours(new Date(), 0);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  const batch = writeBatch(db);
  try {
    const q = query(collection(db, "usuarios"),
      where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let docRef = doc.ref;
      batch.update(docRef, {
        situacao: 'a excluir',
        dataSolicitacaoExcluir: dataCadastro
      })
    });
    try {
      const motivosRef = doc(db, "motivosExcluirConta", id);
      batch.update(motivosRef, {
        quantidade: increment(1)
      });
      await batch.commit();
      return 'sucesso';
    } catch (error) {
      console.log('Ops, Algo deu errado em marcaContaAExcluir-motivos ' + error.code);
      return 'Falha em marcaContaAExcluir-motivos. Tente novamente'
    }
  } catch (error) {
    return 'Falha em marcaContaAExcluir'
  }
}

export async function obtemTiposChavePix() {
  console.log('firestore-obtemTiposChavePix: ');
  try {
    const q = query(collection(db, "tiposChavePix"), orderBy("tipo"));
    let tiposChavePixFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let tipoChavePix = { id: doc.id, ...doc.data() }
      tiposChavePixFirestore.push(tipoChavePix)
    });
    return tiposChavePixFirestore
  } catch (error) {
    console.log('erro obtemTiposChavePix: ' + error.code)
    return []
  }
}

export async function obtemGeneros() {
  console.log('firestore-obtemGeneros: ');
  try {
    const q = query(collection(db, "generos"), orderBy("genero"));
    let generosRifasFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let generoRifa = { id: doc.id, ...doc.data() }
      generosRifasFirestore.push(generoRifa)
    });
    return generosRifasFirestore
  } catch (error) {
    console.log('erro obtemGeneros: ' + error.code)
    return []
  }
}

export async function obtemMotivosExcluirConta() {
  console.log('firestore-obtemMotivosExcluirConta: ');
  try {
    const q = query(collection(db, "motivosExcluirConta"), orderBy("motivo"));
    let motivosExcluirContaFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let motivo = { id: doc.id, ...doc.data() }
      motivosExcluirContaFirestore.push(motivo)
    });
    return motivosExcluirContaFirestore
  } catch (error) {
    console.log('erro obtemMotivosExcluirConta: ' + error.code)
    return []
  }
}

export async function obtemUsuario(uidusuario) {
  console.log('firestore-obtemUsuario: ' + uidusuario);
  let usuarioFirestore = ''
  try {
    const docRef = doc(db, "usuarios", uidusuario);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      usuarioFirestore = docSnap.data();
      return usuarioFirestore
    }
    else {
      console.log('docSnap vazio')
      return usuarioFirestore
    }
  } catch (error) {
    console.log('erro obtemUsuario: ' + error.code)
    return usuarioFirestore
  }
}

export async function obtemSituacaoRifa(id) {
  console.log('firestore-obtemSituacaoRifa: ' + id);
  let situacaoRifa = ''
  try {
    const docRef = doc(db, "rifasDisponiveis", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      situacaoRifa = docSnap.data().situacao;
      return situacaoRifa
    }
    else {
      console.log('docSnap vazio')
      return situacaoRifa
    }
  } catch (error) {
    console.log('erro obtemSituacaoRifa: ' + error.code)
    return situacaoRifa
  }
}

export async function obtemRifasALiberar() {
  console.log('firestore-obtemRifasALiberar');
  try {
    let rifasALiberarFirestore = [];
    const q = query(collection(db, "rifasALiberar"),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaALiberar = { id: doc.id, ...doc.data() }
      rifasALiberarFirestore.push(rifaALiberar)
    });
    let qtdRifas = rifasALiberarFirestore.length
    console.log('qtdRifas: ' + qtdRifas)
    return { rifasALiberarFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemRifasALiberar: ' + error.code)
    let qtdRifas = 0;
    return { rifasALiberarFirestore, qtdRifas }
  }
}

export async function obtemBilhetesEmAquisicao(idUsuario, idRifa) {
  console.log('firestore-obtemBilhetesEmAquisicao: ' + idUsuario + '-' + idRifa);
  var bilhetesEmAquisicaoFirestore = [];
  try {
    const q = query(collection(db, "bilhetesEmAquisicao"),
      where("idRifa", "==", idRifa),
      where("idUsuario", "==", idUsuario)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let bilheteEmAquisicao = { id: doc.id, ...doc.data() }
      bilhetesEmAquisicaoFirestore.push(bilheteEmAquisicao)
    });
    return bilhetesEmAquisicaoFirestore
  } catch (error) {
    console.log('firestore-erro obtemBilhetesEmAquisicao: ' + error.code)
    return bilhetesEmAquisicaoFirestore
  }
}

export async function obtemRifasDisponiveisCepPaginacao(localidade, uf, qtdLimite) {
  console.log('firestore-obtemRifasDisponiveisCepPaginacao: ' + localidade + '-' + uf + '-' + qtdLimite);
  const cidadeUf = localidade + uf;
  console.log('cidadeUf: ' + cidadeUf)
  var rifasDisponiveisFirestore = [];
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      where("situacao", "==", "ativa"),
      limit(`${qtdLimite}`),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaDisponivel = { id: doc.id, ...doc.data() }
      rifasDisponiveisFirestore.push(rifaDisponivel)
    });
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisCepPaginacao qtdRifas: ' + qtdRifas)
    return { rifasDisponiveisFirestore, qtdRifas }
  } catch (error) {
    console.log('firestore-erro obtemRifasDisponiveisCepPaginacao: ' + error.code)
    return { rifasDisponiveisFirestore, qtdRifas }
  }
}

export async function obtemRifasDisponiveisGeneroPaginacao(qtdLimite, cidade, uf, genero) {
  console.log('firestore-obtemRifasDisponiveisGeneroPaginacao: ' + qtdLimite + '-' + cidade + '-' + uf + '-' + genero);
  const cidadeUf = cidade + uf;
  var rifasDisponiveisFirestore = [];
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      where("genero", "==", genero),
      where("situacao", "==", "ativa"),
      limit(`${qtdLimite}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaDisponivel = { id: doc.id, ...doc.data() }
      rifasDisponiveisFirestore.push(rifaDisponivel)
    });
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisGeneroPaginacao qtdRifas : ' + qtdRifas)
    if (qtdRifas < qtdLimite) {
      console.log('Uf')
      // uf    
      let qtdLimiteFalta = qtdLimite - qtdRifas
      const qUf = query(collection(db, "rifasDisponiveis"),
        where("genero", "==", genero),
        where("uf", "==", uf),
        where("cidadeUf", "!=", cidadeUf),
        limit(`${qtdLimiteFalta}`));
      const querySnapshotUf = await getDocs(qUf);
      querySnapshotUf.forEach((doc) => {
        let rifaDisponivelUf = { id: doc.id, ...doc.data() }
        if (doc.data().situacao == 'ativa') {
          rifasDisponiveisFirestore.push(rifaDisponivelUf)
        }
      });
      var qtdRifas = rifasDisponiveisFirestore.length
      console.log('firestore-obtemRifasDisponiveisGeneroPaginacao uf qtdRifas : ' + qtdRifas)
      if (qtdRifas < qtdLimite) {
        console.log('Final')
        // final
        let qtdLimiteFaltaFinal = qtdLimite - qtdRifas
        const qFi = query(collection(db, "rifasDisponiveis"),
          where("genero", "==", genero),
          where("uf", "!=", uf),
          where("situacao", "==", "ativa"),
          limit(`${qtdLimiteFaltaFinal}`));
        const querySnapshotFi = await getDocs(qFi);
        querySnapshotFi.forEach((doc) => {
          let rifaDisponivelFi = { id: doc.id, ...doc.data() }
          rifasDisponiveisFirestore.push(rifaDisponivelFi)
        });
        var qtdRifas = rifasDisponiveisFirestore.length
        console.log('firestore-obtemRifasDisponiveisGeneroPaginacao final: ' + qtdRifas)
      }
    }
  } catch (error) {
    console.log('firestore erro obtemRifasDisponiveisGeneroPaginacao ' + error.code)
    return { rifasDisponiveisFirestore, qtdRifas }
  }
  console.log('firestore-obtemRifasDisponiveisGeneroPaginacao return: ' + qtdRifas)
  return { rifasDisponiveisFirestore, qtdRifas }
}

export async function obtemRifasDisponibilizadasAExcluir(uid) {
  console.log('firestore-obtemRifasDisponibilizadasAExcluir: ' + uid);
  try {
    const q = query(collection(db, "rifasDisponiveis"), where("uid", "==", uid));
    const rifasAExcluirFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaAExcluir = { id: doc.id, ...doc.data() }
      if (doc.data().situacao == 'a excluir') {
        rifasAExcluirFirestore.push(rifaAExcluir)
      }
    });
    const qtdRifas = rifasAExcluirFirestore.length
    console.log('firestore-qtdRifas: ' + qtdRifas)
    return { rifasAExcluirFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemRifasDisponibilizadasAExcluir: ' + error.code)
    let qtdRifas = 0;
    return { rifasAExcluirFirestore, qtdRifas }
  }
}

export async function obtemMinhasRifasALiberar(uid) {
  console.log('firestore-obtemMinhasRifasALiberar: ' + uid);
  try {
    const q = query(collection(db, "rifasALiberar"), where("uid", "==", uid));
    const minhasRifasALiberarFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaALiberar = { id: doc.id, ...doc.data() }
      minhasRifasALiberarFirestore.push(rifaALiberar)
    });
    const qtdRifas = minhasRifasALiberarFirestore.length
    console.log('firestore-qtdRifas: ' + qtdRifas)
    return { minhasRifasALiberarFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemMinhasRifasALiberar: ' + error.code)
    let qtdRifas = 0;
    return { minhasRifasALiberarFirestore, qtdRifas }
  }
}

export async function obtemMinhasRifasDefinirPremio(uid) {
  console.log('firestore-obtemMinhasRifasDefinirPremio: ' + uid);
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("uid", "==", uid),
      where("situacao", "==", "a definir prêmio"));
    const minhasRifasDefinirPremioFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaDefinirPremio = { id: doc.id, ...doc.data() }
      if (doc.data().genero != 'PIX') {
        minhasRifasDefinirPremioFirestore.push(rifaDefinirPremio)
      }
    });
    const qtdRifas = minhasRifasDefinirPremioFirestore.length
    console.log('firestore-qtdRifas: ' + qtdRifas)
    return { minhasRifasDefinirPremioFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemMinhasRifasDefinirPremio: ' + error.code)
    let qtdRifas = 0;
    return { minhasRifasDefinirPremioFirestore, qtdRifas }
  }
}

export async function obtemMinhasRifasAguardandoSorteio(uid) {
  console.log('firestore-obtemMinhasRifasAguardandoSorteio: ' + uid);
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("uid", "==", uid),
      where("situacao", "==", "aguardando sorteio"));
    const minhasRifasAguardandoSorteioFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaAguardandoSorteio = { id: doc.id, ...doc.data() }
      minhasRifasAguardandoSorteioFirestore.push(rifaAguardandoSorteio)
    });
    const qtdRifas = minhasRifasAguardandoSorteioFirestore.length
    console.log('firestore-qtdRifas: ' + qtdRifas)
    return { minhasRifasAguardandoSorteioFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemMinhasRifasAguardandoSorteio: ' + error.code)
    let qtdRifas = 0;
    return { minhasRifasAguardandoSorteioFirestore, qtdRifas }
  }
}

export async function obtemMinhasRifasSorteadas(uid) {
  console.log('firestore-obtemMinhasRifasSorteadas: ' + uid);
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("uid", "==", uid),
      where("situacao", "==", "sorteada"));
    const minhasRifasSorteadasFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaSorteada = { id: doc.id, ...doc.data() }
      minhasRifasSorteadasFirestore.push(rifaSorteada)
    });
    const qtdRifas = minhasRifasSorteadasFirestore.length
    console.log('firestore-qtdRifas: ' + qtdRifas)
    return { minhasRifasSorteadasFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemMinhasRifasSorteadas: ' + error.code)
    let qtdRifas = 0;
    return { minhasRifasSorteadasFirestore, qtdRifas }
  }
}

export async function obtemMinhasRifasNaoLiberadas(uid) {
  console.log('firestore-obtemMinhasRifasNaoLiberadas: ' + uid);
  try {
    const q = query(collection(db, "rifasNaoLiberadas"), where("uid", "==", uid));
    const minhasRifasNaoLiberadasFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaNaoLiberada = { id: doc.id, ...doc.data() }
      minhasRifasNaoLiberadasFirestore.push(rifaNaoLiberada)
    });
    const qtdRifas = minhasRifasNaoLiberadasFirestore.length
    return { minhasRifasNaoLiberadasFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemMinhasRifasNaoLiberadas: ' + error.code)
    let qtdRifas = 0;
    return { minhasRifasNaoLiberadasFirestore, qtdRifas }
  }
}

export async function obtemQtdRifasAtivasUsuario(uid) {
  console.log('firestore-obtemQtdRifasAtivasUsuario: ' + uid);
  const refNomeColecao = 'rifasDisponiveis';
  try {
    const coll = collection(db, refNomeColecao);
    const q = query(coll, where("uid", "==", `${uid}`));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.log('erro obtemQtdRifasAtivasUsuario: ' + error.code)
    return 999999;
  }
}

export async function obtemQtdRifasALiberarUsuario(uid) {
  console.log('firestore-obtemQtdRifasALiberarUsuario: ' + uid);
  const refNomeColecao = 'rifasALiberar';
  try {
    const coll = collection(db, refNomeColecao);
    const q = query(coll, where("uid", "==", `${uid}`));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.log('erro obtemQtdRifasALiberarUsuario: ' + error.code)
    return 999999;
  }
}

export async function obtemQtdNrsBilhetesRifaDisponivel(id) {
  console.log('firestore-obtemQtdNrsBilhetesRifaDisponivel: ' + id);
  const refNomeColecao = 'nrsBilhetesRifaDisponivel-' + `${id}`;
  try {
    const coll = collection(db, refNomeColecao);
    const q = query(coll, where("situacao", "==", "livre"));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.log('erro obtemQtdNrsBilhetesRifaDisponivel: ' + error.code)
    return 999999;
  }
}
 
export async function obtemQtdNrsBilhetesRifaAdquiridoOuEmAquisicao(id, uid) {
  console.log('firestore-obtemQtdNrsBilhetesRifaAdquiridoOuEmAquisicao: ' + id + ' - ' + uid);
  const refNomeColecao = 'nrsBilhetesRifaDisponivel-' + `${id}`;
  try {
    const coll = collection(db, refNomeColecao);
    const q = query(coll, where("uidAdquiriu", "==", `${uid}`));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.log('erro obtemQtdNrsBilhetesRifaAdquiridoOuEmAquisicao: ' + error.code)
    return 999999;
  }
}

export async function obtemRifasDisponiveisTituloPaginacao(qtdLimite, cidade, uf, argPesquisa) {
  console.log('firestore-obtemRifasDisponiveisTituloPaginacao: ' + qtdLimite + '-' + cidade + '-' + uf + '-' + argPesquisa);
  const cidadeUf = cidade + uf;
  var rifasDisponiveisFirestore = [];
  var rifasDisponiveisAntesFiltro = [];
  var rifasDisponiveisAposFiltro = [];
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      where("situacao", "==", "ativa"),
      limit(`${qtdLimite}`),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaDisponivel = { id: doc.id, ...doc.data() }
      rifasDisponiveisAntesFiltro.push(rifaDisponivel)
    });
    var qtdRifasAntes = rifasDisponiveisAntesFiltro.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao qtdRifas antes filtro: ' + qtdRifasAntes)
    rifasDisponiveisAposFiltro = (
      rifasDisponiveisAntesFiltro.filter(item => {
        if (item.titulo.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (rifasDisponiveisAposFiltro.length > 0) {
      rifasDisponiveisFirestore = [...rifasDisponiveisFirestore, ...rifasDisponiveisAposFiltro]
    }
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao qtdRifas após filtro: ' + qtdRifas)
    if (qtdRifas == qtdLimite) {
      console.log('firestore-obtemRifasDisponiveisTituloPaginacao return: ' + qtdRifas)
      return { rifasDisponiveisFirestore, qtdRifas }
    }
    // uf    
    let qtdLimiteFalta = qtdLimite - qtdRifas
    var rifasDisponiveisAntesFiltroUf = [];
    var rifasDisponiveisAposFiltroUf = [];
    const qUf = query(collection(db, "rifasDisponiveis"),
      where("uf", "==", uf),
      where("cidadeUf", "!=", cidadeUf),
      limit(`${qtdLimiteFalta}`));
    const querySnapshotUf = await getDocs(qUf);
    querySnapshotUf.forEach((doc) => {
      let rifaDisponivelUf = { id: doc.id, ...doc.data() }
      if (doc.data().situacao == 'ativa') {
        rifasDisponiveisAntesFiltroUf.push(rifaDisponivelUf)
      }
    });
    var qtdRifasAntesUf = rifasDisponiveisAntesFiltroUf.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao Uf qtdRifas antes filtro: ' + qtdRifasAntesUf)
    rifasDisponiveisAposFiltroUf = (
      rifasDisponiveisAntesFiltroUf.filter(item => {
        if (item.titulo.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (rifasDisponiveisAposFiltroUf.length > 0) {
      rifasDisponiveisFirestore = [...rifasDisponiveisFirestore, ...rifasDisponiveisAposFiltroUf]
    }
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao Uf qtdRifas após filtro: ' + qtdRifas)
    if (qtdRifas == qtdLimite) {
      console.log('firestore-obtemRifasDisponiveisTituloPaginacao return uf: ' + qtdRifas)
      return { rifasDisponiveisFirestore, qtdRifas }
    }
    // final
    let qtdLimiteFaltaFinal = qtdLimite - qtdRifas
    var rifasDisponiveisAntesFiltroFi = [];
    var rifasDisponiveisAposFiltroFi = [];
    const qFi = query(collection(db, "rifasDisponiveis"),
      where("uf", "!=", uf),
      where("situacao", "==", "ativa"),
      limit(`${qtdLimiteFaltaFinal}`));
    const querySnapshotFi = await getDocs(qFi);
    querySnapshotFi.forEach((doc) => {
      let rifaDisponivelFi = { id: doc.id, ...doc.data() }
      rifasDisponiveisAntesFiltroFi.push(rifaDisponivelFi)
    });
    var qtdRifasAntesFi = rifasDisponiveisAntesFiltroFi.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao qtdRifas Final: ' + qtdRifasAntesFi)
    rifasDisponiveisAposFiltroFi = (
      rifasDisponiveisAntesFiltroFi.filter(item => {
        if (item.titulo.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (rifasDisponiveisAposFiltroFi.length > 0) {
      rifasDisponiveisFirestore = [...rifasDisponiveisFirestore, ...rifasDisponiveisAposFiltroFi]
    }
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao qtdRifas Final após filtro: ' + qtdRifas)
    return { rifasDisponiveisFirestore, qtdRifas }
  } catch (error) {
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao erro' + error.code)
    return { rifasDisponiveisFirestore, qtdRifas }
  }
}

export async function obtemRifasDisponiveisPaginacao(qtdLimite, cidade, uf) {
  console.log('firestore-obtemRifasDisponiveisPaginacao: ' + qtdLimite + '-' + cidade + '-' + uf);
  const cidadeUf = cidade + uf;
  var rifasDisponiveisFirestore = [];
  try {
    console.log('firestores-obtemRifasDisponiveisPaginacao-cidadeUf,situacao,orderby dataCadastroSeq')
    const q = query(collection(db, "rifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      where("situacao", "==", "ativa"),
      limit(`${qtdLimite}`),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaDisponivel = { id: doc.id, ...doc.data() }
      console.log('each: ' + doc.data().titulo)
      rifasDisponiveisFirestore.push(rifaDisponivel)
    });
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisPaginacao qtdRifas : ' + qtdRifas)
    if (qtdRifas < qtdLimite) {
      console.log('firestores-obtemRifasDisponiveisPaginacao-uf,cidadeUf,situacao')
      // uf    
      let qtdLimiteFalta = qtdLimite - qtdRifas
      const qUf = query(collection(db, "rifasDisponiveis"),
        where("uf", "==", uf),
        where("cidadeUf", "!=", cidadeUf),
        limit(`${qtdLimiteFalta}`));
      const querySnapshotUf = await getDocs(qUf);
      querySnapshotUf.forEach((doc) => {
        let rifaDisponivelUf = { id: doc.id, ...doc.data() }
        if (doc.data().situacao == 'ativa') {
          rifasDisponiveisFirestore.push(rifaDisponivelUf)
        }
      });
      var qtdRifas = rifasDisponiveisFirestore.length
      console.log('firestore-obtemRifasDisponiveisPaginacao uf qtdRifas : ' + qtdRifas)
      if (qtdRifas < qtdLimite) {
        console.log('firestores-obtemRifasDisponiveisPaginacao-uf,situacao')
        // final
        let qtdLimiteFaltaFinal = qtdLimite - qtdRifas
        const qFi = query(collection(db, "rifasDisponiveis"),
          where("uf", "!=", uf),
          limit(`${qtdLimiteFaltaFinal}`));
        const querySnapshotFi = await getDocs(qFi);
        querySnapshotFi.forEach((doc) => {
          let rifaDisponivelFi = { id: doc.id, ...doc.data() }
          if (doc.data().situacao == 'ativa') {
            rifasDisponiveisFirestore.push(rifaDisponivelFi)
          }
        });
        var qtdRifas = rifasDisponiveisFirestore.length
        console.log('firestore-obtemRifasDisponiveisPaginacao final: ' + qtdRifas)
      }
    }
  } catch (error) {
    console.log('firestore erro obtemRifasDisponiveisPaginacao ' + error.code)
    var qtdRifas = rifasDisponiveisFirestore.length
    return { rifasDisponiveisFirestore, qtdRifas }
  }
  var qtdliv = 9;
  if (qtdRifas > qtdliv) {
    try {
      var advertisingFirestore = [];
      const q = query(collection(db, "advertising"),
        orderBy("views", "asc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let advertising = { id: doc.id, ...doc.data() }
        advertisingFirestore.push(advertising)
      });
    } catch (error) {
      console.log('erro obtemRifasDisponiveisPaginacao - advertising: ' + error.code)
      return { rifasDisponiveisFirestore }
    }
    var index = 5;
    var iitem = 0;
    const batch = writeBatch(db);
    while (qtdRifas > qtdliv) {
      rifasDisponiveisFirestore.splice(index, 0, advertisingFirestore[iitem])
      try {
        const advertisingRef = doc(db, "advertising", advertisingFirestore[iitem].id);
        batch.update(advertisingRef, {
          views: increment(1)
        });
        batch.commit();
      } catch (error) {
        console.log('Ops, Algo deu errado em obtemRifasDisponiveisPaginacao-atualiza qtd views advertising 1: ' + error.code);
        var qtdRifas = rifasDisponiveisFirestore.length
        return { rifasDisponiveisFirestore, qtdRifas }
      }
      qtdliv = qtdliv + 10;
      index = index + 10;
      iitem = iitem + 1;
      if (iitem > advertisingFirestore.length - 1) {
        iitem = 0
      }
    }
    console.log('return obtemRifasDisponiveisPaginacao com advertising')
    var qtdRifas = rifasDisponiveisFirestore.length
    return { rifasDisponiveisFirestore, qtdRifas }
  }
  console.log('return obtemRifasDisponiveisPaginacao sem advertising')
  var qtdRifas = rifasDisponiveisFirestore.length
  return { rifasDisponiveisFirestore, qtdRifas }
}

export async function obtemRifasDisponiveisResponsavelPaginacao(qtdLimite, cidade, uf, argPesquisa) {
  console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao: ' + qtdLimite + '-' + cidade + '-' + uf + '-' + argPesquisa);
  const cidadeUf = cidade + uf;
  var rifasDisponiveisFirestore = [];
  var rifasDisponiveisAntesFiltro = [];
  var rifasDisponiveisAposFiltro = [];
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      where("situacao", "==", "ativa"),
      limit(`${qtdLimite}`),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaDisponivel = { id: doc.id, ...doc.data() }
      rifasDisponiveisAntesFiltro.push(rifaDisponivel)
    });
    var qtdRifasAntes = rifasDisponiveisAntesFiltro.length
    console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao qtdRifas antes filtro: ' + qtdRifasAntes)
    rifasDisponiveisAposFiltro = (
      rifasDisponiveisAntesFiltro.filter(item => {
        if (item.nome.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (rifasDisponiveisAposFiltro.length > 0) {
      rifasDisponiveisFirestore = [...rifasDisponiveisFirestore, ...rifasDisponiveisAposFiltro]
    }
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao qtdRifas após filtro: ' + qtdRifas)
    if (qtdRifas == qtdLimite) {
      console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao return: ' + qtdRifas)
      return { rifasDisponiveisFirestore, qtdRifas }
    }
    // uf    
    let qtdLimiteFalta = qtdLimite - qtdRifas
    var rifasDisponiveisAntesFiltroUf = [];
    var rifasDisponiveisAposFiltroUf = [];
    const qUf = query(collection(db, "rifasDisponiveis"),
      where("uf", "==", uf),
      where("cidadeUf", "!=", cidadeUf),
      limit(`${qtdLimiteFalta}`));
    const querySnapshotUf = await getDocs(qUf);
    querySnapshotUf.forEach((doc) => {
      let rifaDisponivelUf = { id: doc.id, ...doc.data() }
      if (doc.data().situacao == 'ativa') {
        rifasDisponiveisAntesFiltroUf.push(rifaDisponivelUf)
      }
    });
    var qtdRifasAntesUf = rifasDisponiveisAntesFiltroUf.length
    console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao Uf qtdRifas antes filtro: ' + qtdRifasAntesUf)
    rifasDisponiveisAposFiltroUf = (
      rifasDisponiveisAntesFiltroUf.filter(item => {
        if (item.nome.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (rifasDisponiveisAposFiltroUf.length > 0) {
      rifasDisponiveisFirestore = [...rifasDisponiveisFirestore, ...rifasDisponiveisAposFiltroUf]
    }
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao Uf qtdRifas após filtro: ' + qtdRifas)
    if (qtdRifas == qtdLimite) {
      console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao return uf: ' + qtdRifas)
      return { rifasDisponiveisFirestore, qtdRifas }
    }
    // final
    let qtdLimiteFaltaFinal = qtdLimite - qtdRifas
    var rifasDisponiveisAntesFiltroFi = [];
    var rifasDisponiveisAposFiltroFi = [];
    const qFi = query(collection(db, "rifasDisponiveis"),
      where("uf", "!=", uf),
      where("situacao", "==", "ativa"),
      limit(`${qtdLimiteFaltaFinal}`));
    const querySnapshotFi = await getDocs(qFi);
    querySnapshotFi.forEach((doc) => {
      let rifaDisponivelFi = { id: doc.id, ...doc.data() }
      rifasDisponiveisAntesFiltroFi.push(rifaDisponivelFi)
    });
    var qtdRifasAntesFi = rifasDisponiveisAntesFiltroFi.length
    console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao qtdRifas Final: ' + qtdRifasAntesFi)
    rifasDisponiveisAposFiltroFi = (
      rifasDisponiveisAntesFiltroFi.filter(item => {
        if (item.nome.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (rifasDisponiveisAposFiltroFi.length > 0) {
      rifasDisponiveisFirestore = [...rifasDisponiveisFirestore, ...rifasDisponiveisAposFiltroFi]
    }
    var qtdRifas = rifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao qtdRifas Final após filtro: ' + qtdRifas)
    return { rifasDisponiveisFirestore, qtdRifas }
  } catch (error) {
    console.log('firestore-obtemRifasDisponiveisResponsavelPaginacao erro' + error.code)
    return { rifasDisponiveisFirestore, qtdRifas }
  }
}

export async function obtemParametrosApp() {
  console.log('firestore-obtemParametrosApp');
  let parametrosAppFirestore = ''
  let uid = 'iHbtjXNOCiezDImye79p';
  try {
    const docRef = doc(db, "parametrosApp", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      parametrosAppFirestore = docSnap.data();
      return parametrosAppFirestore
    }
    else {
      console.log('docSnap vazio')
      return parametrosAppFirestore
    }
  } catch (error) {
    console.log('erro obtemParametrosApp: ' + error.code)
    return parametrosAppFirestore
  }
}

export async function obtemBilhetesDisponiveisParaReserva(data) {
  console.log('firestore-obtemBilhetesDisponiveisParaReserva ')
  console.log(data)
  const qtdLimite = data.usuarioQtdBilhetes * 5;
  console.log('firestore-qtdlimite: ' + qtdLimite);
  var bilhetesDisponiveisParaReservaFirestore = [];
  const refNomeColecaoNrsBilhetesRifaDisponivel = 'nrsBilhetesRifaDisponivel-' + `${data.id}`;
  console.log('firestore-refNomeColecaoNrsBilhetesRifaDisponivel: ' + refNomeColecaoNrsBilhetesRifaDisponivel)
  try {
    const q = query(collection(db, refNomeColecaoNrsBilhetesRifaDisponivel),
      where("situacao", "==", "livre"),
      limit(`${qtdLimite}`)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let bilheteDisponivel = { id: doc.id, ...doc.data() }
      bilhetesDisponiveisParaReservaFirestore.push(bilheteDisponivel)
    });
    var qtdBilhetesDisponiveis = bilhetesDisponiveisParaReservaFirestore.length;
    console.log('firestore-qtdBilhetesDisponiveis: ' + qtdBilhetesDisponiveis)
    return { bilhetesDisponiveisParaReservaFirestore, qtdBilhetesDisponiveis };
  }
  catch (error) {
    console.log('firestore-erro obtemBilhetesDisponiveisParaReserva-nrsBilhetesRifaDisponivel: ' + error.code);
    let qtdBilhetesDisponiveis = 0;
    return { bilhetesDisponiveisParaReservaFirestore, qtdBilhetesDisponiveis };
  }
}

export async function obtemMinhasRifasAtivas(uid) {
  console.log('firestore-obtemMinhasRifasAtivas: ' + uid);
  const minhasRifasAtivasFirestoreAntes = []
  const minhasRifasAtivasFirestore = []
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("uid", "==", uid),
      where("situacao", "==", "ativa"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaAtivaAntes = { id: doc.id, ...doc.data() }
      minhasRifasAtivasFirestoreAntes.push(rifaAtivaAntes)
    });
  } catch (error) {
    console.log('erro obtemMinhasRifasAtivas-rifasDisponiveis: ' + error.code)
    let qtdRifas = 0;
    return { minhasRifasAtivasFirestore, qtdRifas }
  }
  try {
    qtdRifasAtivas = 0;
    while (qtdRifasAtivas < minhasRifasAtivasFirestoreAntes.length) {
      idRifa = minhasRifasAtivasFirestoreAntes[qtdRifasAtivas].id;
      const refNomeColecao = 'nrsBilhetesRifaDisponivel-' + `${idRifa}`;
      console.log('firestore-refNomeColecao - ' + refNomeColecao);
      const coll = collection(db, refNomeColecao);
      const q = query(coll, where("situacao", "==", "pago"));
      const snapshot = await getCountFromServer(q);
      var qtdBilhetesPagos = snapshot.data().count;
      console.log('firestore-qtdBilhetesPagos: ' + qtdBilhetesPagos)
      let minhaRifaAtiva = minhasRifasAtivasFirestoreAntes[qtdRifasAtivas];
      let rifaAtiva = { qtdBilhetes: qtdBilhetesPagos, minhaRifaAtiva }
      minhasRifasAtivasFirestore.push(rifaAtiva)
      qtdRifasAtivas = qtdRifasAtivas + 1;
    }
    let qtdRifas = minhasRifasAtivasFirestore.length
    return { minhasRifasAtivasFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemMinhasRifasAtivas-nrsBilhetesRifaDisponivel: ' + error.code)
    let qtdRifas = 0;
    return { minhasRifasAtivasFirestore, qtdRifas }
  }
}

export async function obtemMeusBilhetesAdquiridos(uid) {
  console.log('firestore-obtemMeusBilhetesAdquiridos: ' + uid);
  const meusBilhetesAdquiridosFirestoreAntes = []
  const meusBilhetesAdquiridosFirestore = []
  const refNomeColecaoUsuario = 'pagamentosPreReservaUsuario-' + `${uid}`;
  try {
    const q = query(collection(db, refNomeColecaoUsuario),
      orderBy("dataPagamentoSeq", "asc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let bilheteAdquirido = { id: doc.id, ...doc.data() }
      meusBilhetesAdquiridosFirestoreAntes.push(bilheteAdquirido)
    });
  } catch (error) {
    console.log('erro obtemMeusBilhetesAdquiridos-pagamentosPreReservaUsuario: ' + error.code)
    let qtdBilhetes = 0
    return { meusBilhetesAdquiridosFirestore, qtdBilhetes }
  }
  try {
    let rifaDisponivel = '';
    let qtdRifasBilhetes = 0;
    console.log(meusBilhetesAdquiridosFirestoreAntes[0].idRifa)
    while (qtdRifasBilhetes < meusBilhetesAdquiridosFirestoreAntes.length) {
      console.log(meusBilhetesAdquiridosFirestoreAntes[qtdRifasBilhetes])
      idRifa = meusBilhetesAdquiridosFirestoreAntes[qtdRifasBilhetes].idRifa;
      console.log('firestore-idRifa: ' + idRifa)
      const docRef = doc(db, "rifasDisponiveis", idRifa);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        rifaDisponivel = docSnap.data();
      }
      else {
        console.log('docSnap vazio')
        let qtdBilhetes = 0
        return { meusBilhetesAdquiridosFirestore, qtdBilhetes }
      }
      let meuBilheteAdquirido = meusBilhetesAdquiridosFirestoreAntes[qtdRifasBilhetes];
      let meuBilheteAdquiridoRifa = { rifaDisponivel, meuBilheteAdquirido }
      meusBilhetesAdquiridosFirestore.push(meuBilheteAdquiridoRifa)
      qtdRifasBilhetes = qtdRifasBilhetes + 1;
    } 
    let qtdBilhetes = meusBilhetesAdquiridosFirestore.length
    return { meusBilhetesAdquiridosFirestore, qtdBilhetes }
  } catch (error) {
    console.log('erro obtemMeusBilhetesAdquiridos-rifasDisponiveis: ' + error.code)
    let qtdBilhetes = 0;
    return { meusBilhetesAdquiridosFirestore, qtdBilhetes }
  }
}