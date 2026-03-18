<?php

namespace App\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Application\Services\ServiceIA;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IAController extends Controller
{
    protected ServiceIA $serviceIA;

    public function __construct(ServiceIA $serviceIA)
    {
        $this->serviceIA = $serviceIA;
    }

    /**
     * Chat avec l'assistant Claude
     */
    public function chat(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:user,assistant',
            'messages.*.content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Format de messages invalide',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $systemPrompt = "Tu es un assistant expert en immobilier au Sénégal. 
            Tu aides les utilisateurs du logiciel MaggyFast/Imo à gérer leurs biens, contrats, locataires et coopératives d'habitat.
            Réponds de manière professionnelle, précise et en français. 
            Si on te demande des conseils juridiques, précise que tu es une IA et qu'il faut consulter un professionnel.";

            $resultat = $this->serviceIA->chatbot($request->messages, $systemPrompt);

            return response()->json([
                'success' => true,
                'message' => $resultat['content'][0]['text'],
                'raw' => $resultat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
