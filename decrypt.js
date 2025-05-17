document.addEventListener("DOMContentLoaded", function () {
    const decryptSubmitButton = document.getElementById("decryptSubmit");
    const decryptTypeSelect = document.getElementById("decryptType");
    const decryptTextArea = document.getElementById("decryptText");
    const decryptFileInput = document.getElementById("decryptFile");
    const decryptKeyInput = document.getElementById("decryptKey");
    const decryptFileName = document.getElementById("decryptFileName");

    // Fonction pour télécharger un fichier à partir d’un Blob
    function downloadDecryptedFile(filename, content, mimeType = "application/octet-stream") {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // Gérer le clic sur "Décrypter"
    decryptSubmitButton.addEventListener("click", function () {
        const userProvidedKey = decryptKeyInput.value;
        const decryptType = decryptTypeSelect.value;

        if (!userProvidedKey) {
            alert("Veuillez entrer votre clé privée (RSA).");
            return;
        }

        // Déchiffrer du TEXTE
        if (decryptType === "text") {
            const encryptedText = decryptTextArea.value;

            if (!encryptedText) {
                alert("Veuillez entrer le texte chiffré.");
                return;
            }

            const decryptor = new JSEncrypt();
            decryptor.setPrivateKey(userProvidedKey);
            const decryptedText = decryptor.decrypt(encryptedText);

            if (!decryptedText) {
                alert("Le déchiffrement a échoué. Vérifiez la clé.");
                return;
            }

            downloadDecryptedFile("decrypted_text.txt", decryptedText, "text/plain");
            alert("Texte déchiffré avec succès !");
        }

        // Déchiffrer un FICHIER
        else if (decryptType === "file") {
            const file = decryptFileInput.files[0];

            if (!file) {
                alert("Veuillez sélectionner un fichier à déchiffrer.");
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const encryptedPackage = JSON.parse(e.target.result);
                    const encryptedAESKey = encryptedPackage.key;
                    const encryptedData = encryptedPackage.data;
                    const originalType = encryptedPackage.originalType || "application/octet-stream";

                    const decryptor = new JSEncrypt();
                    decryptor.setPrivateKey(userProvidedKey);
                    const aesKey = decryptor.decrypt(encryptedAESKey);

                    if (!aesKey) {
                        alert("Le déchiffrement de la clé AES a échoué.");
                        return;
                    }

                    const decrypted = CryptoJS.AES.decrypt(encryptedData, aesKey);

                    const wordArray = decrypted;
                    const byteArray = new Uint8Array(wordArray.sigBytes);
                    for (let i = 0; i < wordArray.sigBytes; i++) {
                        byteArray[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    }

                    downloadDecryptedFile(
                        file.name.replace(".encrypted.json", ".decrypted"),
                        byteArray,
                        originalType
                    );

                    alert("Fichier déchiffré avec succès !");
                } catch (err) {
                    console.error(err);
                    alert("Erreur lors du déchiffrement : " + err.message);
                }
            };

            reader.readAsText(file);
        }
    });

    // Gérer le bouton "Parcourir"
    const decryptFileBrowse = document.getElementById("decryptFileBrowse");
    if (decryptFileBrowse) {
        decryptFileBrowse.addEventListener("click", function () {
            decryptFileInput.click();
        });
    }

    // Afficher le nom du fichier sélectionné
    decryptFileInput.addEventListener("change", function () {
        if (decryptFileInput.files.length > 0) {
            decryptFileName.textContent = decryptFileInput.files[0].name;
        } else {
            decryptFileName.textContent = "";
        }
    });

    // Réinitialisation
    document.getElementById("decryptReset").addEventListener("click", function () {
        decryptTextArea.value = "";
        decryptKeyInput.value = "";
        decryptFileInput.value = "";
        decryptFileName.textContent = "";
    });
});
