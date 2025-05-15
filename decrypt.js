document.addEventListener("DOMContentLoaded", function() {
    const decryptSubmitButton = document.getElementById("decryptSubmit");
    const decryptTypeSelect = document.getElementById("decryptType");
    const decryptTextArea = document.getElementById("decryptText");
    const decryptFileInput = document.getElementById("decryptFile");
    const decryptKeyInput = document.getElementById("decryptKey");
    const decryptFileName = document.getElementById("decryptFileName");

    function decryptText(encryptedText, key) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
            const result = decrypted.toString(CryptoJS.enc.Utf8);
            return result || null;
        } catch (error) {
            return null;
        }
    }

    function decryptBinary(encryptedText, key) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
            return CryptoJS.lib.WordArray.create(decrypted.words, decrypted.sigBytes);
        } catch (e) {
            return null;
        }
    }

    function wordArrayToUint8Array(wordArray) {
        const len = wordArray.sigBytes;
        const u8_array = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            u8_array[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF;
        }
        return u8_array;
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    decryptSubmitButton.addEventListener("click", function() {
        const key = decryptKeyInput.value;
        if (!key) {
            alert("Veuillez entrer la clé de décryptage.");
            return;
        }

        const type = decryptTypeSelect.value;

        if (type === "text") {
            const encryptedText = decryptTextArea.value;
            if (!encryptedText) {
                alert("Veuillez entrer du texte à décrypter.");
                return;
            }

            const decrypted = decryptText(encryptedText, key);
            if (decrypted) {
                downloadFile("decrypted_text.txt", decrypted);
                alert("Texte décrypté avec succès !");
            } else {
                alert("Échec du décryptage. Clé incorrecte ou contenu invalide.");
            }

        } else if (type === "file") {
            const file = decryptFileInput.files[0];
            if (!file) {
                alert("Veuillez sélectionner un fichier à décrypter.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const encryptedData = e.target.result;

                // 1. Déchiffre
                const decryptedWordArray = decryptBinary(encryptedData, key);
                if (!decryptedWordArray) {
                    alert("Échec du décryptage. Clé incorrecte ou fichier invalide.");
                    return;
                }

                // 2. Convertir en Uint8Array
                const decryptedBytes = wordArrayToUint8Array(decryptedWordArray);

                // 3. Télécharger le fichier
                const originalName = file.name.replace(".encrypted", "");
                downloadFile(originalName || "fichier_decrypte", decryptedBytes);
                alert("Fichier décrypté avec succès !");
            };

            reader.readAsText(file);
        }
    });

    // Gère le bouton "Parcourir"
    const decryptFileBrowse = document.getElementById("decryptFileBrowse");
    decryptFileBrowse.addEventListener("click", () => decryptFileInput.click());

    decryptFileInput.addEventListener("change", function () {
        decryptFileName.textContent = decryptFileInput.files.length > 0
            ? decryptFileInput.files[0].name
            : "";
    });
});
