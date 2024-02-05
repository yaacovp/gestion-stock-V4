document.addEventListener('DOMContentLoaded', function() {
    const ajouterBtn = document.getElementById('ajouter');
    const nomProduitInput = document.getElementById('nom-produit');
    const quantiteProduitInput = document.getElementById('quantite-produit');
    const categorieProduitInput = document.getElementById('categorie-produit');
    const listeProduitsDiv = document.getElementById('liste-produits');
    const afficherStockDiv = document.getElementById('afficher-stock');
 
    // Charger le stock initial et le stock utilisé du localStorage
    let stock = JSON.parse(localStorage.getItem('stock')) || [];
    let stockUtilise = JSON.parse(localStorage.getItem('stockUtilise')) || {};
 
    ajouterBtn.addEventListener('click', function() {
        const nomProduit = nomProduitInput.value;
        const quantiteProduit = parseInt(quantiteProduitInput.value);
        const categorieProduit = categorieProduitInput.value;
 
        if (nomProduit && quantiteProduit && categorieProduit) {
            // Ajouter le produit au stock
            const produitExistantIndex = stock.findIndex(p => p.nom === nomProduit && p.categorie === categorieProduit);
            if (produitExistantIndex !== -1) {
                stock[produitExistantIndex].quantite += quantiteProduit;
            } else {
                stock.push({ nom: nomProduit, quantite: quantiteProduit, categorie: categorieProduit });
            }
            localStorage.setItem('stock', JSON.stringify(stock));
 
            // Réinitialiser les champs de saisie
            nomProduitInput.value = '';
            quantiteProduitInput.value = '';
            categorieProduitInput.value = '';
 
            afficherStock();
            afficherStockRestant();
            afficherNotification('L\'élément a bien été ajouté', 'success');
        }
    });
 
        // Bouton pour exporter les données
        const exporterBtn = document.getElementById('exporter');
 
        exporterBtn.addEventListener('click', function() {
            exporterDonnees();
        });
    
        function exporterDonnees() {
            const date = new Date();
            const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            const timeString = date.toTimeString().split(' ')[0]; // Format HH-MM-SS
            const fileName = `stock_data_${dateString}_${timeString}.json`; // Nom de fichier avec horodatage
        
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stock));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", fileName);
            document.body.appendChild(downloadAnchorNode); // requis pour FF
downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
        
 
           // Input pour charger les données
    const importerInput = document.getElementById('importer');
 
    importerInput.addEventListener('change', function(e) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                stock = JSON.parse(event.target.result);
                localStorage.setItem('stock', JSON.stringify(stock)); // Mise à jour du localStorage
                afficherStock(); // Mise à jour de l'affichage
                afficherStockRestant(); // Mise à jour de l'affichage
                afficherNotification('Les données ont été chargées avec succès', 'success');
            } catch (error) {
                afficherNotification('Erreur lors du chargement des données', 'error');
            }
        };
        fileReader.readAsText(e.target.files[0]);
    });
 
    const notificationDiv = document.getElementById('notification');
 
    let notificationTimeout; // Variable globale pour stocker la référence au timeout de la notification
 
    function afficherNotification(message, type = 'success') {
        clearTimeout(notificationTimeout); // Annuler le timeout précédent
        notificationDiv.textContent = message;
        notificationDiv.className = type; // 'success' ou 'error'
        notificationDiv.classList.remove('hide'); // Assurez-vous de retirer la classe 'hide'
        notificationDiv.classList.add('show');
    
        notificationTimeout = setTimeout(() => { // Stocker la référence au nouveau timeout
            notificationDiv.classList.remove('show');
            notificationDiv.classList.add('hide');
        }, 3000); // Le message disparaît après 3 secondes
    }
    
 
    // Fonction pour afficher le stock
    function afficherStock() {
        stock.sort((a, b) => {
            let nomA = a.nom.toLowerCase(), nomB = b.nom.toLowerCase();
            if (nomA < nomB) return -1;
            if (nomA > nomB) return 1;
            // Si les noms sont égaux, trier par catégorie
            let categorieA = a.categorie.toLowerCase(), categorieB = b.categorie.toLowerCase();
            if (categorieA < categorieB) return -1;
            if (categorieA > categorieB) return 1;
            return 0;
        });
        listeProduitsDiv.innerHTML = '';
        stock.forEach(function(produit, index) {
            const divProduit = document.createElement('div');
            divProduit.classList.add('produit');
            divProduit.innerHTML = `
                ${produit.nom}, ${produit.quantite}, ${produit.categorie}
                <button onclick="modifierProduit(${index})">Modifier</button>
                <button onclick="supprimerProduit(${index})">Supprimer</button>
                <button onclick="utiliserProduit(${index})">Utiliser</button>
            `;
            listeProduitsDiv.appendChild(divProduit);
        });
    }
 
    function afficherStockRestant() {
        stock.sort((a, b) => {
            let nomA = a.nom.toLowerCase(), nomB = b.nom.toLowerCase();
            if (nomA < nomB) return -1;
            if (nomA > nomB) return 1;
            // Si les noms sont égaux, trier par catégorie
            let categorieA = a.categorie.toLowerCase(), categorieB = b.categorie.toLowerCase();
            if (categorieA < categorieB) return -1;
            if (categorieA > categorieB) return 1;
            return 0;
        });
        afficherStockDiv.innerHTML = '';
    
        stock.forEach(function(produit) {
            const divProduit = document.createElement('div');
            divProduit.classList.add('produit');
            divProduit.innerHTML = `
                Nom: ${produit.nom}, Quantité Restante: ${produit.quantite}, Catégorie: ${produit.categorie}
            `;
            afficherStockDiv.appendChild(divProduit);
        });
    }
    
 
    let produitTemporaire = null; // Pour stocker temporairement le produit en cours de modification

    window.modifierProduit = function(index) {
        produitTemporaire = { ...stock[index] }; // Copie de l'élément à modifier
        stock.splice(index, 1); // Retirer temporairement de l'affichage
    
        nomProduitInput.value = produitTemporaire.nom;
        quantiteProduitInput.value = produitTemporaire.quantite;
        categorieProduitInput.value = produitTemporaire.categorie;
    
        indexAModifier = index; // Stockez l'index à modifier
        afficherStock(); // Mettre à jour l'affichage sans le produit en cours de modification
        afficherStockRestant();
        afficherNotification('Veuillez modifier l\'élément', 'error'); // Notification pour inciter à modifier
    }
    
    window.validerModification = function() {
        if (indexAModifier !== null && produitTemporaire) {
            const nomProduit = nomProduitInput.value;
            const quantiteProduit = parseInt(quantiteProduitInput.value);
            const categorieProduit = categorieProduitInput.value;
    
            if (nomProduit && quantiteProduit && categorieProduit) {
                // Mettre à jour l'élément dans le stock
                stock.splice(indexAModifier, 0, { nom: nomProduit, quantite: quantiteProduit, categorie: categorieProduit }); // Remettre à l'index d'origine
                localStorage.setItem('stock', JSON.stringify(stock));
    
                // Réinitialiser les champs de saisie et la variable temporaire
                nomProduitInput.value = '';
                quantiteProduitInput.value = '';
                categorieProduitInput.value = '';
                produitTemporaire = null;
    
                afficherStock();
                afficherStockRestant();
                afficherNotification('L\'élément a bien été modifié', 'success');
            }
    
            indexAModifier = null; // Réinitialiser l'index à modifier
        }
    }
    
 
    window.supprimerProduit = function(index) {
        // Demander confirmation avant de supprimer
        const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer cet élément ?');
        if (isConfirmed) {
            vraimentSupprimerProduit(index); // Appelez la fonction de suppression réelle
        }
    }
 
    function vraimentSupprimerProduit(index) {
        stock.splice(index, 1);
        localStorage.setItem('stock', JSON.stringify(stock));
        afficherStock();
        afficherStockRestant();
        afficherNotification('L\'élément a bien été supprimé', 'error');
    }
 
    window.utiliserProduit = function(index) {
        const produit = stock[index];
        const quantiteAUtiliser = prompt(`Combien de ${produit.categorie} de ${produit.nom} voulez-vous utiliser?`);
        const quantiteUtilisee = parseInt(quantiteAUtiliser);
    
        if (!isNaN(quantiteUtilisee) && quantiteUtilisee > 0 && quantiteUtilisee <= produit.quantite) {
            produit.quantite -= quantiteUtilisee; // déduire du stock
            localStorage.setItem('stock', JSON.stringify(stock)); // sauvegarder le nouveau stock dans localStorage
            afficherStock(); // mettre à jour l'affichage du stock
            afficherStockRestant(); // mettre à jour l'affichage du stock restant
            afficherNotification('L\'élément a bien été retiré du stock', 'error');
        } else {
            alert("Quantité invalide ou insuffisante en stock.");
        }
    };
    
 
    afficherStock();
    afficherStockRestant();
});