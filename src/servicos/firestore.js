import { db } from '../config/firebase';
import {
  collection, getDocs, getDoc, doc, query,
  where, orderBy, limit, increment, writeBatch, Timestamp, getCountFromServer
} from "firebase/firestore"
import { subHours, format } from 'date-fns';

export async function alteraCepRifasDisponiveis(data) {
  console.log('firestore-alteraCepRifasDisponiveis ' + data.uid)
  const batch = writeBatch(db);
  try {
    const q = query(collection(db, "RifasDisponiveis"),
      where("uid", "==", data.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log('foreach: ' + doc.id)
      let docRef = doc.ref;
      batch.update(docRef, {
        bairro: data.bairro,
        cep: data.cep,
        cidade: data.cidade,
        cidadeUf: data.cidade + data.uf,
        uf: data.uf,
        nome: data.nome
      })
    });
    await batch.commit();
    return 'sucesso';
  } catch (error) {
    return 'Falha em alteraCepRifasDisponiveis'
  }
}

export async function excluiRifaNaoLiberadaTransacao(idRifa) {
  console.log('firestore-excluiRifaNaoLiberadaTransacao: ' + idRifa)
  const batch = writeBatch(db);
  const RifaRef = doc(db, "RifasNaoLiberadas", idRifa);
  try {
    batch.delete(RifaRef);
    await batch.commit();
    return 'sucesso';
  } catch (error) {
    console.log('Ops, Algo deu errado em excluiRifaNaoLiberadaTransacao ' + error.code);
    return 'Falha em excluir Rifa Não Liberada. Tente novamente'
  }
}

export async function excluiRifaDisponibilizadaTransacao(idRifa) {
  console.log('firestore-excluiRifaDisponibilizadaTransacao: ' + idRifa)
  const batch = writeBatch(db);
  const RifaRef = doc(db, "RifasDisponiveis", idRifa);
  try {
    batch.delete(RifaRef);
    await batch.commit();
  } catch (error) {
    console.log('Ops, Algo deu errado em excluiRifaDisponibilizadaTransacao ' + error.code);
    return 'Falha em excluir Rifa Disponibilizada. Tente novamente'
  }
}

export async function gravaRifaDisponibilizadaTransacao(data) {
  console.log('firestore-gravaRifaDisponibilizadaTransacao ' + data.id)
  const batch = writeBatch(db);
  const RifaRef = doc(collection(db, "RifasDisponiveis"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 3);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  try {
    batch.set(RifaRef, {
      titulo: data.titulo,
      descricao: data.descricao,
      imagemCapa: data.imagemCapa,
      genero: data.genero,
      uid: data.uidusuario,
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
      cidadeUf: data.cidade + data.uf
    });
    await batch.commit();
    return 'sucesso';
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaDisponibilizadaTransacao-RifasDisponiveis ' + error.code);
    return 'Falha em disponibilizar Rifa. Tente novamente'
  }
}

export async function gravaRifaLiberadaTransacao(data) {
  console.log('firestore-gravaRifaLiberadaTransacao ' + data.id)
  const batch = writeBatch(db);
  const RifaRef = doc(collection(db, "RifasDisponiveis"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 3);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  try {
    batch.set(RifaRef, {
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
      cidadeUf: data.cidade + data.uf
    });
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaLiberadaTransacao-RifasDisponiveis ' + error.code);
    return 'Falha em liberar Rifa. Tente novamente'
  }
  try {
    const RifaDRef = doc(db, "RifasALiberar", data.id);
    batch.delete(RifaDRef);
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaLiberadaTransacao-RifasALiberar ' + error.code);
    return 'Falha em liberar Rifa. Tente novamente'
  }
}

export async function gravaRifaALiberarTransacao(data) {
  console.log('firestore-gravaRifaALiberarTransacao')
  const batch = writeBatch(db);
  const RifaRef = doc(collection(db, "RifasALiberar"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 3);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  try {
    batch.set(RifaRef, {
      titulo: data.titulo,
      descricao: data.descricao,
      imagemCapa: data.imagemCapa,
      genero: data.genero,
      uid: data.uidusuario,
      cep: data.cep,
      cidade: data.cidade,
      uf: data.uf,
      bairro: data.bairro,
      nome: data.nome,
      email: data.email,
      dataCadastro: dataCadastro,
      dataCadastroSeq: dataCadastroSeq,
      nomeCapa: data.nomeCapa,
      post: 'imagemRifa',
      cidadeUf: data.cidade + data.uf
    });
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaALiberarTransacao ' + error.code);
    return 'Falha em disponibilizar Rifa a liberar. Tente novamente'
  }
}

export async function gravaRifaNaoLiberadaTransacao(data) {
  console.log('firestore-gravaRifaNaoLiberadaTransacao ' + data.id)
  const batch = writeBatch(db);
  const RifaRef = doc(collection(db, "RifasNaoLiberadas"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 3);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  try {
    batch.set(RifaRef, {
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
      post: data.post
    });
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaNaoLiberadaTransacao-RifasNaoLiberadas ' + error.code);
    return 'Falha em não liberar Rifa. Tente novamente'
  }
  try {
    const RifaDRef = doc(db, "RifasALiberar", data.id);
    batch.delete(RifaDRef);
    await batch.commit();
    return 'sucesso'
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaNaoLiberadaTransacao-RifasALiberar ' + error.code);
    return 'Falha em não liberar Rifa. Tente novamente'
  }
}

export async function marcaContaAExcluir(uid, id) {
  console.log('firestore-marcaContaAExcluir ' + uid + '-' + id)
  const batch = writeBatch(db);
  try {
    const q = query(collection(db, "usuarios"),
      where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let docRef = doc.ref;
      batch.update(docRef, {
        situacao: 'a excluir'
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

export async function obtemRifasALiberar() {
  console.log('firestore-obtemRifasALiberar');
  try {
    let RifasALiberarFirestore = [];
    const q = query(collection(db, "RifasALiberar"),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let RifaALiberar = { id: doc.id, ...doc.data() }
      RifasALiberarFirestore.push(RifaALiberar)
    });
    let qtdRifas = RifasALiberarFirestore.length
    console.log('qtdRifas: ' + qtdRifas)
    return { RifasALiberarFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemRifasALiberar: ' + error.code)
    return { RifasALiberarFirestore, qtdRifas }
  }
}

export async function obtemRifasDisponiveisCepPaginacao(localidade, uf, qtdLimite) {
  console.log('firestore-obtemRifasDisponiveisCepPaginacao: ' + localidade + '-' + uf + '-' + qtdLimite);
  const cidadeUf = localidade + uf;
  console.log('cidadeUf: ' + cidadeUf)
  var RifasDisponiveisFirestore = [];
  try {
    const q = query(collection(db, "RifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      limit(`${qtdLimite}`),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let RifaDisponivel = { id: doc.id, ...doc.data() }
      RifasDisponiveisFirestore.push(RifaDisponivel)
    });
    var qtdRifas = RifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisCepPaginacao qtdRifas: ' + qtdRifas)
    return { RifasDisponiveisFirestore, qtdRifas }
  } catch (error) {
    console.log('firestore-erro obtemRifasDisponiveisCepPaginacao: ' + error.code)
    return { RifasDisponiveisFirestore, qtdRifas }
  }
}

export async function obtemRifasDisponiveisGeneroPaginacao(qtdLimite, cidade, uf, genero) {
  console.log('firestore-obtemRifasDisponiveisGeneroPaginacao: ' + qtdLimite + '-' + cidade + '-' + uf + '-' + genero);
  const cidadeUf = cidade + uf;
  var RifasDisponiveisFirestore = [];
  try {
    const q = query(collection(db, "RifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      where("genero", "==", genero),
      limit(`${qtdLimite}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let RifaDisponivel = { id: doc.id, ...doc.data() }
      RifasDisponiveisFirestore.push(RifaDisponivel)
    });
    var qtdRifas = RifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisGeneroPaginacao qtdRifas : ' + qtdRifas)
    if (qtdRifas < qtdLimite) {
      console.log('Uf')
      // uf    
      let qtdLimiteFalta = qtdLimite - qtdRifas
      const qUf = query(collection(db, "RifasDisponiveis"),
        where("genero", "==", genero),
        where("uf", "==", uf),
        where("cidadeUf", "!=", cidadeUf),
        limit(`${qtdLimiteFalta}`));
      const querySnapshotUf = await getDocs(qUf);
      querySnapshotUf.forEach((doc) => {
        let RifaDisponivelUf = { id: doc.id, ...doc.data() }
        RifasDisponiveisFirestore.push(RifaDisponivelUf)
      });
      var qtdRifas = RifasDisponiveisFirestore.length
      console.log('firestore-obtemRifasDisponiveisGeneroPaginacao uf qtdRifas : ' + qtdRifas)
      if (qtdRifas < qtdLimite) {
        console.log('Final')
        // final
        let qtdLimiteFaltaFinal = qtdLimite - qtdRifas
        const qFi = query(collection(db, "RifasDisponiveis"),
          where("genero", "==", genero),
          where("uf", "!=", uf),
          limit(`${qtdLimiteFaltaFinal}`));
        const querySnapshotFi = await getDocs(qFi);
        querySnapshotFi.forEach((doc) => {
          let RifaDisponivelFi = { id: doc.id, ...doc.data() }
          RifasDisponiveisFirestore.push(RifaDisponivelFi)
        });
        var qtdRifas = RifasDisponiveisFirestore.length
        console.log('firestore-obtemRifasDisponiveisGeneroPaginacao final: ' + qtdRifas)
      }
    }
  } catch (error) {
    console.log('firestore erro obtemRifasDisponiveisGeneroPaginacao ' + error.code)
    return { RifasDisponiveisFirestore, qtdRifas }
  }
  console.log('firestore-obtemRifasDisponiveisGeneroPaginacao return: ' + qtdRifas)
  return { RifasDisponiveisFirestore, qtdRifas }
}

export async function obtemRifasDisponibilizadasAExcluir(uid) {
  console.log('firestore-obtemRifasDisponibilizadasAExcluir: ' + uid);
  try {
    const q = query(collection(db, "RifasDisponiveis"), where("uid", "==", uid));
    const RifasAExcluirFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let RifaAExcluir = { id: doc.id, ...doc.data() }
      RifasAExcluirFirestore.push(RifaAExcluir)
    });
    const qtdRifas = RifasAExcluirFirestore.length
    return { RifasAExcluirFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemRifasDisponibilizadasAExcluir: ' + error.code)
    return { RifasAExcluirFirestore, qtdRifas }
  }
}

export async function obtemRifasNaoLiberadas(uid) {
  console.log('firestore-obtemRifasNaoLiberadas: ' + uid);
  try {
    const q = query(collection(db, "RifasNaoLiberadas"), where("uid", "==", uid));
    const RifasNaoLiberadasFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let RifaNaoLiberada = { id: doc.id, ...doc.data() }
      RifasNaoLiberadasFirestore.push(RifaNaoLiberada)
    });
    const qtdRifas = RifasNaoLiberadasFirestore.length
    return { RifasNaoLiberadasFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemRifasNaoLiberadas: ' + error.code)
    return { RifasNaoLiberadasFirestore, qtdRifas }
  }
}

export async function obtemQtdRifasNaoLiberadas(uid) {
  console.log('firestore-obtemQtdRifasNaoLiberadas: ' + uid);
  try {
    const coll = collection(db, "RifasNaoLiberadas");
    const q = query(coll, where("uid", "==", uid));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.log('erro obtemQtdRifasNaoLiberadas: ' + error.code)
    return 0;
  }
}

export async function obtemRifasDisponiveisTituloPaginacao(qtdLimite, cidade, uf, argPesquisa) {
  console.log('firestore-obtemRifasDisponiveisTituloPaginacao: ' + qtdLimite + '-' + cidade + '-' + uf + '-' + argPesquisa);
  const cidadeUf = cidade + uf;
  var RifasDisponiveisFirestore = [];
  var RifasDisponiveisAntesFiltro = [];
  var RifasDisponiveisAposFiltro = [];
  try {
    const q = query(collection(db, "RifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      limit(`${qtdLimite}`),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let RifaDisponivel = { id: doc.id, ...doc.data() }
      RifasDisponiveisAntesFiltro.push(RifaDisponivel)
    });
    var qtdRifasAntes = RifasDisponiveisAntesFiltro.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao qtdRifas antes filtro: ' + qtdRifasAntes)
    RifasDisponiveisAposFiltro = (
      RifasDisponiveisAntesFiltro.filter(item => {
        if (item.titulo.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (RifasDisponiveisAposFiltro.length > 0) {
      RifasDisponiveisFirestore = [...RifasDisponiveisFirestore, ...RifasDisponiveisAposFiltro]
    }
    var qtdRifas = RifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao qtdRifas após filtro: ' + qtdRifas)
    if (qtdRifas == qtdLimite) {
      console.log('firestore-obtemRifasDisponiveisTituloPaginacao return: ' + qtdRifas)
      return { RifasDisponiveisFirestore, qtdRifas }
    }
    // uf    
    let qtdLimiteFalta = qtdLimite - qtdRifas
    var RifasDisponiveisAntesFiltroUf = [];
    var RifasDisponiveisAposFiltroUf = [];
    const qUf = query(collection(db, "RifasDisponiveis"),
      where("uf", "==", uf),
      where("cidadeUf", "!=", cidadeUf),
      limit(`${qtdLimiteFalta}`));
    const querySnapshotUf = await getDocs(qUf);
    querySnapshotUf.forEach((doc) => {
      let RifaDisponivelUf = { id: doc.id, ...doc.data() }
      RifasDisponiveisAntesFiltroUf.push(RifaDisponivelUf)
    });
    var qtdRifasAntesUf = RifasDisponiveisAntesFiltroUf.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao Uf qtdRifas antes filtro: ' + qtdRifasAntesUf)
    RifasDisponiveisAposFiltroUf = (
      RifasDisponiveisAntesFiltroUf.filter(item => {
        if (item.titulo.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (RifasDisponiveisAposFiltroUf.length > 0) {
      RifasDisponiveisFirestore = [...RifasDisponiveisFirestore, ...RifasDisponiveisAposFiltroUf]
    }
    var qtdRifas = RifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao Uf qtdRifas após filtro: ' + qtdRifas)
    if (qtdRifas == qtdLimite) {
      console.log('firestore-obtemRifasDisponiveisTituloPaginacao return uf: ' + qtdRifas)
      return { RifasDisponiveisFirestore, qtdRifas }
    }
    // final
    let qtdLimiteFaltaFinal = qtdLimite - qtdRifas
    var RifasDisponiveisAntesFiltroFi = [];
    var RifasDisponiveisAposFiltroFi = [];
    const qFi = query(collection(db, "RifasDisponiveis"),
      where("uf", "!=", uf),
      limit(`${qtdLimiteFaltaFinal}`));
    const querySnapshotFi = await getDocs(qFi);
    querySnapshotFi.forEach((doc) => {
      let RifaDisponivelFi = { id: doc.id, ...doc.data() }
      RifasDisponiveisAntesFiltroFi.push(RifaDisponivelFi)
    });
    var qtdRifasAntesFi = RifasDisponiveisAntesFiltroFi.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao qtdRifas Final: ' + qtdRifasAntesFi)
    RifasDisponiveisAposFiltroFi = (
      RifasDisponiveisAntesFiltroFi.filter(item => {
        if (item.titulo.toLowerCase().indexOf(argPesquisa.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
    if (RifasDisponiveisAposFiltroFi.length > 0) {
      RifasDisponiveisFirestore = [...RifasDisponiveisFirestore, ...RifasDisponiveisAposFiltroFi]
    }
    var qtdRifas = RifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao qtdRifas Final após filtro: ' + qtdRifas)
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao return final : ' + qtdRifas)
    return { RifasDisponiveisFirestore, qtdRifas }
  } catch (error) {
    console.log('firestore-obtemRifasDisponiveisTituloPaginacao erro' + error.code)
    return { RifasDisponiveisFirestore, qtdRifas }
  }
}

export async function obtemRifasDisponiveisPaginacao(qtdLimite, cidade, uf) {
  console.log('firestore-obtemRifasDisponiveisPaginacao: ' + qtdLimite + '-' + cidade + '-' + uf);
  const cidadeUf = cidade + uf;
  var RifasDisponiveisFirestore = [];
  try {
    const q = query(collection(db, "RifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
      limit(`${qtdLimite}`),
      orderBy("dataCadastroSeq", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let RifaDisponivel = { id: doc.id, ...doc.data() }
      RifasDisponiveisFirestore.push(RifaDisponivel)
    });
    var qtdRifas = RifasDisponiveisFirestore.length
    console.log('firestore-obtemRifasDisponiveisPaginacao qtdRifas : ' + qtdRifas)
    if (qtdRifas < qtdLimite) {
      console.log('Uf')
      // uf    
      let qtdLimiteFalta = qtdLimite - qtdRifas
      const qUf = query(collection(db, "RifasDisponiveis"),
        where("uf", "==", uf),
        where("cidadeUf", "!=", cidadeUf),
        limit(`${qtdLimiteFalta}`));
      const querySnapshotUf = await getDocs(qUf);
      querySnapshotUf.forEach((doc) => {
        let RifaDisponivelUf = { id: doc.id, ...doc.data() }
        RifasDisponiveisFirestore.push(RifaDisponivelUf)
      });
      var qtdRifas = RifasDisponiveisFirestore.length
      console.log('firestore-obtemRifasDisponiveisPaginacao uf qtdRifas : ' + qtdRifas)
      if (qtdRifas < qtdLimite) {
        console.log('Final')
        // final
        let qtdLimiteFaltaFinal = qtdLimite - qtdRifas
        const qFi = query(collection(db, "RifasDisponiveis"),
          where("uf", "!=", uf),
          limit(`${qtdLimiteFaltaFinal}`));
        const querySnapshotFi = await getDocs(qFi);
        querySnapshotFi.forEach((doc) => {
          let RifaDisponivelFi = { id: doc.id, ...doc.data() }
          RifasDisponiveisFirestore.push(RifaDisponivelFi)
        });
        var qtdRifas = RifasDisponiveisFirestore.length
        console.log('firestore-obtemRifasDisponiveisPaginacao final: ' + qtdRifas)
      }
    }
  } catch (error) {
    console.log('firestore erro obtemRifasDisponiveisPaginacao ' + error.code)
    var qtdRifas = RifasDisponiveisFirestore.length
    return { RifasDisponiveisFirestore, qtdRifas }
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
      return { RifasDisponiveisFirestore }
    }
    var index = 5;
    var iitem = 0;
    const batch = writeBatch(db);
    while (qtdRifas > qtdliv) {
      RifasDisponiveisFirestore.splice(index, 0, advertisingFirestore[iitem])
      try {
        const advertisingRef = doc(db, "advertising", advertisingFirestore[iitem].id);
        batch.update(advertisingRef, {
          views: increment(1)
        });
        batch.commit();
      } catch (error) {
        console.log('Ops, Algo deu errado em obtemRifasDisponiveisPaginacao-atualiza qtd views advertising 1: ' + error.code);
        var qtdRifas = RifasDisponiveisFirestore.length
        return { RifasDisponiveisFirestore, qtdRifas }
      }
      qtdliv = qtdliv + 10;
      index = index + 10;
      iitem = iitem + 1;
      if (iitem > advertisingFirestore.length - 1) {
        iitem = 0
      }
    }
    console.log('return obtemRifasDisponiveisPaginacao com advertising')
    var qtdRifas = RifasDisponiveisFirestore.length
    return { RifasDisponiveisFirestore, qtdRifas }
  }
  console.log('return obtemRifasDisponiveisPaginacao sem advertising')
  var qtdRifas = RifasDisponiveisFirestore.length
  return { RifasDisponiveisFirestore, qtdRifas }
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

