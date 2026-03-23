<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BienvenueTenant extends Mailable
{
    use Queueable, SerializesModels;

    public $nomTenant;
    public $email;
    public $password;
    public $urlLogin;

    /**
     * Create a new message instance.
     */
    public function __construct($nomTenant, $email, $password)
    {
        $this->nomTenant = $nomTenant;
        $this->email = $email;
        $this->password = $password;
        $this->urlLogin = config('app.url_frontend', 'https://maggyfast-immo.tech') . '/connexion';
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Bienvenue sur MaggyFast - Vos accès')
                    ->view('emails.bienvenue_tenant');
    }
}
