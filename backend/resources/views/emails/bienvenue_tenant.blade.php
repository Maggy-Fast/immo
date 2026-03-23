<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
        .header { background: #1e40af; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f9fafb; color: #6b7280; padding: 20px; text-align: center; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .credentials { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .credentials p { margin: 5px 0; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MaggyFast Immo</h1>
        </div>
        <div class="content">
            <h2>Bienvenue, {{ $nomTenant }} !</h2>
            <p>Votre espace de gestion immobilière est maintenant prêt. Vous pouvez commencer à gérer vos biens, vos locataires et vos contrats dès maintenant.</p>
            
            <p>Voici vos identifiants de connexion sécurisés :</p>
            
            <div class="credentials">
                <p><strong>Email :</strong> {{ $email }}</p>
                <p><strong>Mot de passe :</strong> {{ $password }}</p>
            </div>
            
            <p>Pour votre sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
            
            <center>
                <a href="{{ $urlLogin }}" class="button">Accéder à mon espace</a>
            </center>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} MaggyFast. Tous droits réservés.</p>
            <p>Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
