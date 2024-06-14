<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">Nouvelle Lettre</h1>
        <form @submit="generateLetter">
          <div class="form-group">
            <label for="recipientName">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              id="recipientName"
              class="form-control"
              v-model="formData.recipientName"
              required
            />
          </div>
          <div class="form-group">
            <label for="recipientAddress">Recipient Address</label>
            <input
              type="text"
              name="recipientAddress"
              id="recipientAddress"
              class="form-control"
              v-model="formData.recipientAddress"
              required
            />
          </div>
          <div class="form-group">
            <label for="senderName">Sender Name</label>
            <input
              type="text"
              name="senderName"
              id="senderName"
              class="form-control"
              v-model="formData.senderName"
              required
            />
          </div>
          <div class="form-group">
            <label for="senderAddress">Sender Address</label>
            <input
              type="text"
              name="senderAddress"
              id="senderAddress"
              class="form-control"
              v-model="formData.senderAddress"
              required
            />
          </div>
          <div class="form-group">
            <label for="letterContent">Letter Content</label>
            <textarea
              name="letterContent"
              id="letterContent"
              class="form-control"
              v-model="formData.letterContent"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Generate Letter</button>
        </form>
        <div v-if="generatedLetter" class="mt-4 letter-container" ref="letterContainer">
          <h2>Lettre</h2>
          <p>{{ generatedLetter }}</p>
          <div class="text-right">
            <button class="btn btn-primary mr-2" @click="saveAsPDF">Save as PDF</button>
            <button class="btn btn-success" @click="archiveLetter">Archive</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js';

export default {
  name: 'LetterGenerator',
  data() {
    return {
      formData: {
        recipientName: '',
        recipientAddress: '',
        senderName: '',
        senderAddress: '',
        letterContent: '',
      },
      generatedLetter: null,
    };
  },
  methods: {
    generateLetter(event) {
      event.preventDefault();
      const { recipientName, recipientAddress, senderName, senderAddress, letterContent } = this.formData;
      const letter = `
        Dear ${recipientName},

        ${letterContent}

        Sincerely,
        ${senderName}
        ${senderAddress}
      `;
      this.generatedLetter = letter;
    },
    saveAsPDF() {
      const element = this.$refs.letterContainer;
      const opt = {
        margin: 1,
        filename:` ${recipientName} `.pdf,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      html2pdf().set(opt).from(element).save();
    },
    archiveLetter() {
      const archivedLettersArray = JSON.parse(localStorage.getItem('archivedLetters'))?? [];
      archivedLettersArray.push(this.formData);

      localStorage.setItem('archivedLetters', JSON.stringify(archivedLettersArray));
    },
  },
};
</script>
<style scoped>
.letter-container {
  /*... existing styles... */
  position: relative;
  padding: 40px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-family: Arial, sans-serif;
}

.letter-container h2 {
  text-align: center;
  margin-bottom: 20px;
}

.letter-container p {
  line-height: 1.6;
}

.letter-container.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  height: 100px;
  background-image: url('path/to/your/logo.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.letter-container.signature {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 200px;
  height: 50px;
  border-bottom: 1px solid #ccc;
}

.letter-container.text-right {
  margin-top: 20px;
}
.letter-container {
  border: 1px solid #ccc;
  padding: 20px;
  background-color: #fff;
  font-family: Arial, sans-serif;
}

.letter-container h2 {
  text-align: center;
  margin-bottom: 20px;
}

.letter-container p {
  line-height: 1.6;
}

.letter-container.text-right {
  margin-top: 20px;
}
</style>
