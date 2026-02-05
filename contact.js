// 1. Initialisation d'EmailJS avec ta clé publique
(function() {
    emailjs.init("eTvjpGTDwu0AjVlyf");
})();

// 2. Écoute de la soumission du formulaire
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page par défaut
    sendMail();
});

function sendMail() {
    // Récupération des éléments
    const btn = document.getElementById('submit-btn');
    const form = document.getElementById('contact-form');
    
    // Récupération des valeurs pour la validation
    const prenom = document.getElementById('firstname').value;
    const nom = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Vérification simple
    if (prenom === "" || nom === "" || email === "" || message === "") {
        alert("Merci de remplir tous les champs avant d'envoyer.");
        return;
    }

    // Changement visuel du bouton
    const originalText = btn.innerText;
    btn.innerText = 'Envoi en cours...';
    btn.style.backgroundColor = '#ccc'; 
    btn.disabled = true;

    // Configuration EmailJS
    const serviceID = 'service_rq5uxmt';
    const templateID = 'template_0qxauh7';

    // Envoi via EmailJS
    emailjs.sendForm(serviceID, templateID, form)
        .then(() => {
            // SUCCÈS
            btn.innerText = 'Message envoyé !';
            btn.style.backgroundColor = '#28a745'; // Vert
            alert('Votre message a bien été envoyé !');
            
            form.reset(); // Remise à zéro du formulaire
            
            // Retour à l'état normal après 3 secondes
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 3000);
        })
        .catch((err) => {
            // ERREUR
            btn.innerText = 'Erreur';
            btn.style.backgroundColor = '#dc3545'; // Rouge
            btn.disabled = false;
            alert('Erreur lors de l\'envoi : ' + JSON.stringify(err));
            console.error('Erreur EmailJS:', err);
        });
}