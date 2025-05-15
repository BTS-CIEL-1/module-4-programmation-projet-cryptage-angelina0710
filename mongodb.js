// Importation des modules nécessaires
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Charge les variables d'environnement

// Utilisation de l'URL MongoDB provenant du fichier .env
const url = process.env.MONGODB_URI;
const dbName = 'ma-base-de-données-SpaceX';

// Fonction pour se connecter à la base de données MongoDB
const connectDB = async () => {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connexion à la base de données réussie');
        const db = client.db(dbName);
        return db.collection('users'); // Retourne la collection "users"
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        throw error;
    }
};

// Exemple d'une fonction pour récupérer tous les utilisateurs
const getAllUsers = async () => {
    try {
        const collection = await connectDB();
        const users = await collection.find({}).toArray(); // Récupère tous les utilisateurs
        console.log('Documents récupérés:', users);
        return users;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
};

// Exemple d'une fonction pour ajouter un nouvel utilisateur
const addUser = async (name, email, password) => {
    try {
        const collection = await connectDB();
        const newUser = {
            name,
            email,
            password // Assurez-vous de crypter le mot de passe avant de l'ajouter en production
        };
        const result = await collection.insertOne(newUser); // Insère un nouvel utilisateur
        console.log('Nouvel utilisateur ajouté:', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        throw error;
    }
};

// Exporter les fonctions pour les utiliser dans d'autres fichiers
module.exports = { getAllUsers, addUser };