import {storage} from '../config/firebase';
import {ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';

export async function salvaImagem(imagem, imagemNome) {
    if(!imagem){
        return 'Ops, algo deu errado em salvaImagem imagem'
    } 
    if(!imagemNome){
        return 'Ops, algo deu errado em salvaImagem imagemNome'
    }     
    const downloadImagem = await fetch(imagem);
    const blobImagem = await downloadImagem.blob();
    const imagemRef = ref(storage, `imagensCapa/${imagemNome}.png`);
    try{
        await uploadBytes(imagemRef,blobImagem);
        const url = await getDownloadURL(imagemRef);
        return url;
    } catch(error){
        console.log('erro gravar imagem salvaImagem: ' + error);
    }
} 

export async function excluiImagem(imagemNome) {
    console.log('excluiImagem' + imagemNome)
    if(!imagemNome) {
        return 'Ops, Algo deu errado em excluiImagem imagemNome'
    }
    const imagemNomeC = imagemNome + '.png'
    console.log('imagemNomeC: ' + imagemNomeC)    
    const desertRef = ref(storage, `imagensCapa/${imagemNomeC}`);
    try{
        await deleteObject(desertRef).then(() => {
        })
        return 'sucesso'
    } catch(error){
        console.log('erro excluir imagem: ' + error);
        return 'Ops, Algo deu errado em excluiImagem'
    }
}

export async function salvaImagemAvatar(imagem, imagemNome) {
    if(!imagem){
        return 'Ops, algo deu errado em salvaImagemAvatar imagem'
    } 
    if(!imagemNome){
        return 'Ops, algo deu errado em salvaImagemAvatar imagemNome'
    }     
    const downloadImagem = await fetch(imagem);
    const blobImagem = await downloadImagem.blob();
    const imagemRef = ref(storage, `imagensAvatar/${imagemNome}.png`);
    try{
        await uploadBytes(imagemRef,blobImagem);
        const url = await getDownloadURL(imagemRef);
        return url;
    } catch(error){
        console.log('erro gravar imagem salvaImagemAvatar: ' + error);
    }
}