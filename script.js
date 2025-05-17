// Gère le changement d'onglet Crypter/Décrypter
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tabs .tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Désactiver tous les onglets
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Activer l'onglet cliqué
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const encryptSubmitButton = document.getElementById("encryptSubmit");
    const encryptTypeSelect = document.getElementById("encryptType");
    const encryptTextArea = document.getElementById("encryptText");
    const encryptFileInput = document.getElementById("encryptFile");
    const encryptKeyInput = document.getElementById("encryptKey");
    const encryptFileName = document.getElementById("encryptFileName");

    // Vérifie si CryptoJS est bien chargé
    if (typeof CryptoJS === 'undefined') {
        console.error("CryptoJS n'est pas défini !");
        return;
    } else {
        console.log("CryptoJS est défini !");
    }

    // Fonction pour crypter du texte avec RSA
    function encryptTextWithRSA(text, publicKey) {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKey);
        const encrypted = encryptor.encrypt(text);
        return encrypted;
    }

    // Fonction pour générer une clé AES aléatoire
    function generateAESKey(length = 32) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let key = "";
        for (let i = 0; i < length; i++) {
            key += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return key;
    }

    // Fonction pour crypter un texte avec AES
    function encryptText(text, key) {
        return CryptoJS.AES.encrypt(text, key).toString();
    }

    // Fonction pour télécharger un fichier crypté
    function downloadFile(filename, content) {
        console.log("Téléchargement : ", filename);
        const blob = new Blob([content], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // Gérer l'événement sur le bouton "Crypter"
    encryptSubmitButton.addEventListener("click", function() {
        console.log("Bouton Crypter cliqué");
        const userProvidedKey = encryptKeyInput.value;
        const encryptType = encryptTypeSelect.value;

        if (!userProvidedKey) {
            alert("Veuillez entrer une clé de cryptage.");
            return;
        }

        if (encryptType === "text") {
            const textToEncrypt = encryptTextArea.value;

            if (!textToEncrypt) {
                alert("Veuillez entrer du texte à crypter.");
                return;
            }

            const encryptedText = encryptTextWithRSA(textToEncrypt, userProvidedKey);
            if (!encryptedText) {
                alert("Le chiffrement a échoué. Clé invalide ?");
                return;
            }

            downloadFile("encrypted_text.txt", encryptedText);
            alert("Texte crypté avec succès !");
        }
        else if (encryptType === "file") {
            const file = encryptFileInput.files[0];

            if (!file) {
                alert("Veuillez sélectionner un fichier.");
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                const arrayBuffer = e.target.result;
                const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

                // Générer une clé AES temporaire
                const aesKey = generateAESKey();

                // Chiffrer le contenu avec AES
                const encryptedContent = CryptoJS.AES.encrypt(wordArray, aesKey).toString();

                // Chiffrer la clé AES avec RSA
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(userProvidedKey);
                const encryptedAESKey = encryptor.encrypt(aesKey);

                if (!encryptedAESKey) {
                    alert("Le chiffrement de la clé AES a échoué.");
                    return;
                }

                // Construire un objet JSON avec la clé AES chiffrée et le contenu chiffré
                const encryptedPackage = JSON.stringify({
                    key: encryptedAESKey,
                    data: encryptedContent
                });

                downloadFile(file.name + ".encrypted.json", encryptedPackage);
                alert("Fichier crypté avec succès !");
            };

            reader.readAsArrayBuffer(file);
        }
    });
});

// Gérer le bouton "Parcourir" et afficher le nom du fichier sélectionné
document.addEventListener("DOMContentLoaded", function () {
    const encryptFileBrowse = document.getElementById("encryptFileBrowse");
    const encryptFileInput = document.getElementById("encryptFile");
    const encryptFileName = document.getElementById("encryptFileName");

    encryptFileBrowse.addEventListener("click", function () {
        encryptFileInput.click();
    });

    encryptFileInput.addEventListener("change", function () {
        if (encryptFileInput.files.length > 0) {
            encryptFileName.textContent = encryptFileInput.files[0].name;
        } else {
            encryptFileName.textContent = "";
        }
    });
});

// Gérer les onglets (uniquement une fois)
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Gestion compteur caractères pour textarea
    function updateCharacterCount(textarea, counter) {
        const maxLength = textarea.getAttribute('maxlength');
        const length = textarea.value.length;
        counter.textContent = `${length}/${maxLength}`;

        if (length > maxLength * 0.95) {
            counter.className = "character-counter danger";
        } else if (length > maxLength * 0.8) {
            counter.className = "character-counter warning";
        } else {
            counter.className = "character-counter";
        }
    }

    const textareas = document.querySelectorAll(".styled-textarea");
    textareas.forEach(textarea => {
        const counter = textarea.nextElementSibling;
        textarea.addEventListener("input", function() {
            updateCharacterCount(textarea, counter);
        });
    });

    // Afficher ou cacher sections crypter/décrypter selon type sélectionné
    const encryptType = document.getElementById("encryptType");
    const encryptFileSection = document.getElementById("encryptFileSection");
    const encryptTextSection = document.getElementById("encryptTextSection");

    if (encryptType) {
        encryptType.addEventListener("change", function() {
            if (this.value === "file") {
                encryptFileSection.style.display = "block";
                encryptTextSection.style.display = "none";
                encryptTextSection.classList.remove("active");
            } else {
                encryptFileSection.style.display = "none";
                encryptTextSection.style.display = "block";

                setTimeout(() => {
                    encryptTextSection.classList.add("active");
                }, 50);
            }
        });
    }

    const decryptType = document.getElementById("decryptType");
    const decryptFileSection = document.getElementById("decryptFileSection");
    const decryptTextSection = document.getElementById("decryptTextSection");

    if (decryptType) {
        decryptType.addEventListener("change", function() {
            if (this.value === "file") {
                decryptFileSection.style.display = "block";
                decryptTextSection.style.display = "none";
                decryptTextSection.classList.remove("active");
            } else {
                decryptFileSection.style.display = "none";
                decryptTextSection.style.display = "block";

                setTimeout(() => {
                    decryptTextSection.classList.add("active");
                }, 50);
            }
        });
    }
});

// Gestion génération et copie clés RSA
document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generateRSA");
    const publicKeyArea = document.getElementById("rsaPublicKey");
    const privateKeyArea = document.getElementById("rsaPrivateKey");
    const resetBtn = document.getElementById("resetRSA");

    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            const crypt = new JSEncrypt({ default_key_size: 2048 });
            crypt.getKey();

            publicKeyArea.value = crypt.getPublicKey();
            privateKeyArea.value = crypt.getPrivateKey();
        });
    }

    // Copier la clé dans le presse-papiers
    document.querySelectorAll(".copyBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const textArea = document.getElementById(targetId);
            textArea.select();
            textArea.setSelectionRange(0, 99999); // Pour mobile

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    alert("Clé copiée dans le presse-papiers !");
                } else {
                    alert("Impossible de copier la clé.");
                }
            } catch (err) {
                alert("Erreur lors de la copie : " + err);
            }

            window.getSelection().removeAllRanges();
        });
    });

    // Réinitialiser les clés RSA
    resetBtn.addEventListener("click", () => {
        publicKeyArea.value = "";
        privateKeyArea.value = "";
    });
});
