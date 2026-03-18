<?php

namespace App\Application\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ServiceIA
{
    private string $apiKey;
    private string $baseUrl = 'https://api.anthropic.com/v1/messages';

    public function __construct()
    {
        $this->apiKey = config('services.anthropic.key');
    }

    /**
     * Envoyer un message à Claude
     */
    public function chatbot(array $messages, $systemPrompt = null)
    {
        if (empty($this->apiKey)) {
            throw new \Exception("Clé API Anthropic non configurée");
        }

        $payload = [
            'model' => 'claude-3-haiku-20240307',
            'max_tokens' => 4096,
            'messages' => $messages,
        ];

        if ($systemPrompt) {
            $payload['system'] = $systemPrompt;
        }

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->post($this->baseUrl, $payload);

            if ($response->failed()) {
                Log::error("Erreur API Claude: " . $response->body());
                throw new \Exception("L'assistant IA a rencontré une erreur: " . $response->json('error.message', 'Erreur inconnue'));
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error("Exception ServiceIA: " . $e->getMessage());
            throw $e;
        }
    }
}
