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
    const q = query(collection(db, "rifasDisponiveis"),
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
  const rifaRef = doc(db, "rifasNaoLiberadas", idRifa);
  try {
    batch.delete(rifaRef);
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
  const rifaRef = doc(db, "rifasDisponiveis", idRifa);
  try {
    batch.delete(rifaRef);
    await batch.commit();
  } catch (error) {
    console.log('Ops, Algo deu errado em excluiRifaDisponibilizadaTransacao ' + error.code);
    return 'Falha em excluir Rifa Disponibilizada. Tente novamente'
  }
}

export async function gravaRifaDisponibilizadaTransacao(data) {
  console.log('firestore-gravaRifaDisponibilizadaTransacao ' + data.id)
  const batch = writeBatch(db);
  const rifaRef = doc(collection(db, "rifasDisponiveis"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 3);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  try {
    batch.set(rifaRef, {
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
      cidadeUf: data.cidade + data.uf,
      qtdNrs: data.qtdNrs
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
  const rifaRef = doc(collection(db, "rifasDisponiveis"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 3);
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
      qtdNrs: data.qtdNrs
    });
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaLiberadaTransacao-RifasDisponiveis ' + error.code);
    return 'Falha em liberar Rifa. Tente novamente'
  }
  try {
    const rifaDRef = doc(db, "rifasALiberar", data.id);
    batch.delete(rifaDRef);
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
  const rifaRef = doc(collection(db, "rifasALiberar"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 3);
  const dataCadastro = format(resultDate, 'dd/MM/yyyy HH:mm:ss')
  try {
    batch.set(rifaRef, {
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
      cidadeUf: data.cidade + data.uf,
      qtdNrs: data.qtdNrs
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
  const rifaRef = doc(collection(db, "rifasNaoLiberadas"));
  const dataCadastroSeq = Timestamp.fromDate(new Date());
  const resultDate = subHours(new Date(), 3);
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
      qtdNrs: data.qtdNrs
    });
  } catch (error) {
    console.log('Ops, Algo deu errado em gravaRifaNaoLiberadaTransacao-RifasNaoLiberadas ' + error.code);
    return 'Falha em não liberar Rifa. Tente novamente'
  }
  try {
    const rifaDRef = doc(db, "rifasALiberar", data.id);
    batch.delete(rifaDRef);
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

export async function obtemQtdNrsRifa() {
  console.log('firestore-obtemQtdNrsRifa: ');
  try {
    const q = query(collection(db, "qtdNrsRifa"), orderBy("qtdNrs"));
    let qtdNrsRifaFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let qtdNrsRifa = { id: doc.id, ...doc.data() }
      qtdNrsRifaFirestore.push(qtdNrsRifa)
    });
    return qtdNrsRifaFirestore
  } catch (error) {
    console.log('erro obtemQtdNrsRifa: ' + error.code)
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
    return { rifasALiberarFirestore, qtdRifas }
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
        rifasDisponiveisFirestore.push(rifaDisponivelUf)
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
      rifasAExcluirFirestore.push(rifaAExcluir)
    });
    const qtdRifas = rifasAExcluirFirestore.length
    return { rifasAExcluirFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemRifasDisponibilizadasAExcluir: ' + error.code)
    return { rifasAExcluirFirestore, qtdRifas }
  }
}

export async function obtemRifasNaoLiberadas(uid) {
  console.log('firestore-obtemRifasNaoLiberadas: ' + uid);
  try {
    const q = query(collection(db, "rifasNaoLiberadas"), where("uid", "==", uid));
    const rifasNaoLiberadasFirestore = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let rifaNaoLiberada = { id: doc.id, ...doc.data() }
      rifasNaoLiberadasFirestore.push(rifaNaoLiberada)
    });
    const qtdRifas = rifasNaoLiberadasFirestore.length
    return { rifasNaoLiberadasFirestore, qtdRifas }
  } catch (error) {
    console.log('erro obtemRifasNaoLiberadas: ' + error.code)
    return { rifasNaoLiberadasFirestore, qtdRifas }
  }
}

export async function obtemQtdRifasNaoLiberadas(uid) {
  console.log('firestore-obtemQtdRifasNaoLiberadas: ' + uid);
  try {
    const coll = collection(db, "rifasNaoLiberadas");
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
  var rifasDisponiveisFirestore = [];
  var rifasDisponiveisAntesFiltro = [];
  var rifasDisponiveisAposFiltro = [];
  try {
    const q = query(collection(db, "rifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
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
      rifasDisponiveisAntesFiltroUf.push(rifaDisponivelUf)
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
    const q = query(collection(db, "rifasDisponiveis"),
      where("cidadeUf", "==", cidadeUf),
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
      console.log('Uf')
      // uf    
      let qtdLimiteFalta = qtdLimite - qtdRifas
      const qUf = query(collection(db, "rifasDisponiveis"),
        where("uf", "==", uf),
        where("cidadeUf", "!=", cidadeUf),
        limit(`${qtdLimiteFalta}`));
      const querySnapshotUf = await getDocs(qUf);
      querySnapshotUf.forEach((doc) => {
        let rifaDisponivelUf = { id: doc.id, ...doc.data() }
        rifasDisponiveisFirestore.push(rifaDisponivelUf)
      });
      var qtdRifas = rifasDisponiveisFirestore.length
      console.log('firestore-obtemRifasDisponiveisPaginacao uf qtdRifas : ' + qtdRifas)
      if (qtdRifas < qtdLimite) {
        console.log('Final')
        // final
        let qtdLimiteFaltaFinal = qtdLimite - qtdRifas
        const qFi = query(collection(db, "rifasDisponiveis"),
          where("uf", "!=", uf),
          limit(`${qtdLimiteFaltaFinal}`));
        const querySnapshotFi = await getDocs(qFi);
        querySnapshotFi.forEach((doc) => {
          let rifaDisponivelFi = { id: doc.id, ...doc.data() }
          rifasDisponiveisFirestore.push(rifaDisponivelFi)
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
      rifasDisponiveisAntesFiltroUf.push(rifaDisponivelUf)
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