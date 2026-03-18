<?php



namespace App\Presentation\Controllers;



use App\Application\Services\ServiceBien;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;



/**

 * Contrôleur de présentation pour les biens

 */

class BienController extends Controller

{

    protected $serviceBien;



    public function __construct(ServiceBien $serviceBien)

    {

        $this->serviceBien = $serviceBien;

    }



    /**

     * GET /api/biens

     */

    public function index(Request $request)

    {

        $filtres = $request->only(['type', 'statut', 'id_proprietaire', 'recherche']);

        $biens = $this->serviceBien->lister($filtres);



        return response()->json([

            'donnees' => $biens->items(),

            'meta' => [

                'page_courante' => $biens->currentPage(),

                'total_pages' => $biens->lastPage(),

                'total' => $biens->total(),

            ],

        ]);

    }



    /**

     * POST /api/biens

     */

    public function store(Request $request)

    {

        $validator = Validator::make($request->all(), [

            'type' => 'required|in:appartement,maison,terrain,commerce',

            'adresse' => 'required|string|max:255',

            'superficie' => 'nullable|numeric|min:0',

            'prix' => 'nullable|numeric|min:0',

            'id_proprietaire' => 'required|exists:proprietaires,id',

            'latitude' => 'nullable|numeric|between:-90,90',

            'longitude' => 'nullable|numeric|between:-180,180',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);



        if ($validator->fails()) {

            return response()->json([

                'message' => 'Les données fournies sont invalides.',

                'erreurs' => $validator->errors(),

            ], 422);

        }



        $bien = $this->serviceBien->creer($request->all());



        return response()->json($bien, 201);

    }



    /**

     * GET /api/biens/{id}

     */

    public function show($id)

    {

        $bien = $this->serviceBien->obtenirParId($id);

        return response()->json($bien);

    }



    /**

     * PUT /api/biens/{id}

     */

    public function update(Request $request, $id)

    {

        $validator = Validator::make($request->all(), [

            'type' => 'sometimes|in:appartement,maison,terrain,commerce',

            'adresse' => 'sometimes|string|max:255',

            'superficie' => 'nullable|numeric|min:0',

            'prix' => 'nullable|numeric|min:0',

            'statut' => 'sometimes|in:disponible,loue,vendu,en_travaux',

            'id_proprietaire' => 'sometimes|exists:proprietaires,id',

            'latitude' => 'nullable|numeric|between:-90,90',

            'longitude' => 'nullable|numeric|between:-180,180',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'photos' => 'nullable', // URLs existing to keep
        ]);



        if ($validator->fails()) {

            return response()->json([

                'message' => 'Les données fournies sont invalides.',

                'erreurs' => $validator->errors(),

            ], 422);

        }



        $bien = $this->serviceBien->mettreAJour($id, $request->all());



        return response()->json($bien);

    }



    /**

     * DELETE /api/biens/{id}

     */

    public function destroy($id)

    {

        $this->serviceBien->supprimer($id);

        return response()->json(null, 204);

    }

}

