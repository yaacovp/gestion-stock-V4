document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('emailInput');
    const loginBtn = document.getElementById('loginBtn');
    const messageP = document.getElementById('message');
    
    const authorizedEmails = [
        'autorise1@example.com',
        'autorise2@example.com'
        // Ajoutez d'autres e-mails autorisés ici
    ];
    
    loginBtn.addEventListener('click', function() {
        const enteredEmail = emailInput.value;
        if (authorizedEmails.includes(enteredEmail)) {
            // Marquer l'utilisateur comme authentifié avant la redirection
            localStorage.setItem('userAuthenticated', 'true');

            // Redirection vers la page stock.html
            window.location.href = 'stock.html';
        } else {
            messageP.textContent = 'Accès refusé. Votre e-mail n\'est pas autorisé.';
            messageP.style.color = 'red';
        }
    });
});
