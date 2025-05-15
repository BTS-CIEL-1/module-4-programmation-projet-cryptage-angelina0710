const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs'); // Pour crypter les mots de passe
const { MongoClient } = require('mongodb'); // Pour se connecter à MongoDB
const app = express();

// Configuration de la connexion à MongoDB
const url = 'mongodb+srv://jennabettahar:0000@cluster0.ye7cdmh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'ma-base-de-données-SpaceX';

// Connexion MongoDB
async function connectDB() {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    return db.collection('users'); // Récupérer la collection 'users'
}

app.use(express.static('.'));
app.use(express.json());

// Route d'inscription
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const usersCollection = await connectDB();

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
        }

        // Crypter le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur dans la base de données
        await usersCollection.insertOne({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'Inscription réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// Route de connexion
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usersCollection = await connectDB();

        // Vérifier si l'utilisateur existe
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        res.status(200).json({ message: 'Connexion réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// Route pour afficher index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(3001, () => {
    console.log('Serveur démarré sur http://127.0.0.1:3001');
});

