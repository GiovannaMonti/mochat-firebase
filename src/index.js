
import './styles/main.scss';

// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyB3Zc6BzoWOe8gxqhzOWE9Icvwoi2cE7RE",
authDomain: "mochat-cbc0f.firebaseapp.com",
projectId: "mochat-cbc0f",
storageBucket: "mochat-cbc0f.appspot.com",
messagingSenderId: "1006774174965",
appId: "1:1006774174965:web:67e55a7fbe1106296df1bc"
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore(); // collegati al db
    const collection = db.collection('messages');
    const ul = document.querySelector('ul'); 
    const form = document.querySelector('form');
    // onSnapshot: leggiamo i dati e otteniamo un aggiornamento ogni volta che i dati vengono aggiornati
    // ogni volta che i dati cambiano viene eseguita la funzione che gli passiamo
    // onSnapshot non dipende dal client! Molto comodo
    collection.orderBy('inviato-alle').onSnapshot((snapshot) =>{
        const json = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data()} // SINTASSI SPREAD
        });
        const elements = json.map(doc => `<li><b>${doc.user}:</b> ${doc.message}</li>`); // trasformiamo i dati in html da visualizzare
        ul.innerHTML = elements.join('');
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // impedisco il comportam di default della form che è sincrono (aggiorna la pagina e mette ciò che ho scritto nell'url). Lo gestirò in modo asincrono via js
        const obj = {
            "inviato-alle": new Date().toISOString(),
            user: document.querySelector('#username').value,
            message: event.target.new.value
        }
        // collection.doc() senza argomenti prepara la collection ad accettare un nuovo elemento. se gli passassi un id invece recupererebbe quell'elemento della collection.
        // passo il msg al db con set(obj);
        collection.doc().set(obj);
        event.target.reset(); // cancella tutto ciò che c'è nel form quando  invio il msg
    });
});
