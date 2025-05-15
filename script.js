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

    // Fonction pour crypter un texte
    function encryptText(text, key) {
        return CryptoJS.AES.encrypt(text, key).toString();
    }

    // Fonction pour télécharger un fichier crypté
    function downloadFile(filename, content) {
        console.log("Téléchargement : ", filename); // Juste pour tester
        const blob = new Blob([content], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click(); // Cela déclenche le téléchargement
    }

    // Gérer l'événement sur le bouton "Crypter"
    encryptSubmitButton.addEventListener("click", function() {
        console.log("Bouton Crypter cliqué");
        const encryptKey = encryptKeyInput.value;

        // Vérifie si une clé a été fournie
        if (!encryptKey) {
            alert("Veuillez entrer une clé de cryptage.");
            return;
        }

        const encryptType = encryptTypeSelect.value;

        if (encryptType === "text") {
            // Crypter du texte
            const textToEncrypt = encryptTextArea.value;
            if (!textToEncrypt) {
                alert("Veuillez entrer du texte à crypter.");
                return;
            }
            const encryptedText = encryptText(textToEncrypt, encryptKey);
            downloadFile("encrypted_text.txt", encryptedText);
            alert("Texte crypté avec succès !");

        } else if (encryptType === "file") {
            // Crypter un fichier
            const file = encryptFileInput.files[0];
            if (!file) {
                alert("Veuillez sélectionner un fichier à crypter.");
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                console.log("Fichier lu avec succès");
                const arrayBuffer = e.target.result;
                const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer); // Convertir le buffer en WordArray
                const encrypted = CryptoJS.AES.encrypt(wordArray, encryptKey).toString();
                downloadFile(file.name + ".encrypted", encrypted);
                alert("Fichier crypté avec succès !");
            };

            reader.readAsArrayBuffer(file); // Lire le fichier comme ArrayBuffer pour le crypter
        }
    });

});

// Gérer le bouton "Parcourir" et afficher le nom du fichier sélectionné
document.addEventListener("DOMContentLoaded", function () {
    const encryptFileBrowse = document.getElementById("encryptFileBrowse");
    const encryptFileInput = document.getElementById("encryptFile");
    const encryptFileName = document.getElementById("encryptFileName");

    // Quand on clique sur "Parcourir", on déclenche le clic sur l'input caché
    encryptFileBrowse.addEventListener("click", function () {
        encryptFileInput.click();
    });

    // Afficher le nom du fichier sélectionné
    encryptFileInput.addEventListener("change", function () {
        if (encryptFileInput.files.length > 0) {
            encryptFileName.textContent = encryptFileInput.files[0].name;
        } else {
            encryptFileName.textContent = "";
        }
    });
});




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
        
        
        function updateCharacterCount(textarea, counter) {
            const maxLength = textarea.getAttribute('maxlength');
            const length = textarea.value.length;
            counter.textContent = `${length}/${maxLength}`;
            
            
            if (length > maxLength * 0.8) {
                counter.className = "character-counter warning";
            } else if (length > maxLength * 0.95) {
                counter.className = "character-counter danger";
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

    document.addEventListener("DOMContentLoaded", function () {
        const generateBtn = document.getElementById("generateRSA");
        const publicKeyArea = document.getElementById("rsaPublicKey");
        const privateKeyArea = document.getElementById("rsaPrivateKey");
        const resetBtn = document.getElementById("resetRSA");

        if (generateBtn) {
            generateBtn.addEventListener("click", () => {
                // Création d'une nouvelle instance de JSEncrypt avec une taille de clé de 2048 bits
                const crypt = new JSEncrypt({ default_key_size: 2048 });

                // Génération de la paire de clés
                crypt.getKey();

                // Récupération des clés au format PEM
                const publicKey = crypt.getPublicKey();
                const privateKey = crypt.getPrivateKey();

                // Affichage dans les zones de texte
                publicKeyArea.value = publicKey;
                privateKeyArea.value = privateKey;
            });
        }

            generateBtn.addEventListener("click", () => {
            const crypt = new JSEncrypt({ default_key_size: 2048 });
            crypt.getKey();
            publicKeyArea.value = crypt.getPublicKey();
            privateKeyArea.value = crypt.getPrivateKey();
        });

        // Copier la clé quand on clique sur un bouton "Copier"
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

                // Pour désélectionner après copie
                window.getSelection().removeAllRanges();
            });
        });

        // Bouton OK pour réinitialiser les clés
        resetBtn.addEventListener("click", () => {
            publicKeyArea.value = "";
            privateKeyArea.value = "";
        });
    });
