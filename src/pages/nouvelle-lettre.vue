<template>
  <div class="letter-container">
    <div class="header">
      <div class="sender-info">
        <h2 class="sender-name">{{ senderName }}</h2>
        <p class="sender-address">{{ senderAddress }}</p>
        <p class="sender-phone">{{ senderPhone }}</p>
        <p class="sender-email">{{ senderEmail }}</p>
      </div>
      <div class="date">{{ formattedDate }}</div>
    </div>
    <div class="recipient-info">
      <label for="recipient-name">Nom du destinataire : </label>
      <input type="text" id="recipient-name" v-model="recipientName">
      <label for="recipient-address">Adresse du destinataire : </label>
      <input type="text" id="recipient-address" v-model="recipientAddress">
    </div>
    <div class="subject">
      <label for="subject">Objet : </label>
      <input type="text" id="subject" v-model="subject">
    </div>
    <div class="content" id="editor">
      <editor-content :editor="editor"  v-model="letterContent"/>
    </div>
    <div class="signature">
      <p class="signature-name">{{ senderName }}</p>
    </div>
  </div>
  <div class="actions">
    <button @click="printLetter">Imprimer</button>
    <button @click="saveLetter">Enregistrer</button>
    <button @click="archiveLetter">Archiver</button>
  </div>
<ul class="list-group">
  <li v-for="archivedLetter in archivedLetters" :key="archivedLetter.id" class="list-group-item">
    <div class="d-flex justify-content-between">
      <span>{{ archivedLetter.subject }}</span>
      <div>
        <button @click="openLetter(archivedLetter)" class="btn btn-sm btn-primary mr-2">Ouvrir</button>
        <button @click="deleteLetter(archivedLetter.id)" class="btn btn-sm btn-danger">Supprimer</button>
      </div>
    </div>
  </li>
</ul>
 
</template>
<script>
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';
export default{
  components: {
    EditorContent,
  },
  data() {
    return {
      letterContent: '',
      senderName: 'wangue sonfack wilfried pavel',
      senderAddress: 'bini-dang',
      senderPhone: '699227921',
      senderEmail: 'wanguepavel52@gmail.com',
      recipientName: '',
      recipientAddress: '',
      subject: '',
      archivedLetters: [],
    };
  },
  setup() {
    const editor = useEditor({
      content :'<p>bonjour</p>',
      extensions: [
        StarterKit,
      ],
    })
    return {
      editor
    };
  },
  computed: {
    formattedDate() {
      const date = new Date();
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
  },
  methods: {
    printLetter() {
      window.print();
    },
    saveLetter() {
      const newLetter = {
        id: Date.now(),
        subject: this.subject,
        content: this.letterContent,
        recipientName: this.recipientName,
        recipientAddress: this.recipientAddress,
      };
      this.archivedLetters.push(newLetter);
      localStorage.setItem('archivedLetters', JSON.stringify(this.archivedLetters));
      this.letterContent = '';
      this.recipientName = '';
      this.recipientAddress = '';
      this.subject = '';
    },
    archiveLetter() {
      this.saveLetter();
    },
    openLetter(letter) {
      this.letterContent = letter.content;
      this.recipientName = letter.recipientName;
      this.recipientAddress = letter.recipientAddress;
      this.subject = letter.subject;
    },
    deleteLetter(id) {
      this.archivedLetters = this.archivedLetters.filter(
        (letter) => letter.id !== id
      );
      localStorage.setItem('archivedLetters', JSON.stringify(this.archivedLetters));
    },
  },
  mounted() {
    const storedLetters = localStorage.getItem('archivedLetters');
    if (storedLetters) {
      this.archivedLetters = JSON.parse(storedLetters);
    }
  },

};
</script>
<style scoped>
/* Styles for the letter */
.letter-container {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  margin: 20px auto;
  max-width: 700px;
  padding: 20px;
  border: 1px solid #ddd;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.sender-info,
.recipient-info {
  text-align: left;
}
.subject {
  text-align: center;
  margin-bottom: 20px;
}
.content {
  margin-bottom: 20px;
}
.signature {
  text-align: right;
  margin-top: 20px;
}
.signature-name {
  font-weight: bold;
}
/* Styles for the input fields */
label {
  display: block;
  margin-bottom: 5px;
}
input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}
/* Styles for the buttons */
.actions button {
  padding: 8px 16px;
  margin-right: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
/* Styles for the list of archived letters */
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
/* Styles for the rich text editor (Tiptap) */
.ProseMirror {
  /* Add some CSS properties here, for example: */
  border: 1px solid #ddd;
  padding: 10px;
}
@media print {
  body > *:not(.letter-container) {
    display: none;
  }
 
}
</style>
