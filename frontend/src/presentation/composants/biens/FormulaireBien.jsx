/**

 * Composant — Formulaire de création/modification d'un bien

 * Migré vers les composants centralisés

 */



import { useState, useEffect } from 'react';

import { Home, MapPin, DollarSign, Image, X } from 'lucide-react';

import { validerBien } from '../../../domaine/validations/validationBien';

import { OPTIONS_TYPES_BIEN } from '../../../domaine/valeursObjets/typeBien';

import { OPTIONS_STATUTS_BIEN } from '../../../domaine/valeursObjets/statutBien';

import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire, UploadImage } from '../communs';
import { getImageUrl } from '../../../application/utils/imageUtils';



export default function FormulaireBien({

  bien = null,

  proprietaires = [],

  surSoumettre,

  surAnnuler,

  enCours = false,

}) {

  const [formulaire, setFormulaire] = useState({

    type: '',

    adresse: '',

    superficie: '',

    prix: '',

    statut: 'disponible',

    idProprietaire: '',

    latitude: '',

    longitude: '',

    description: '',

    images: [], // Liste de fichiers images

  });



  const [photosExistantes, setPhotosExistantes] = useState([]);
  const [nouvellesImages, setNouvellesImages] = useState([]); // { file, preview }
  const [clefUpload, setClefUpload] = useState(0); // Pour réinitialiser le composant d'upload

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (bien) {
      setFormulaire({
        type: bien.type || '',
        adresse: bien.adresse || '',
        superficie: bien.superficie || '',
        prix: bien.prix || '',
        statut: bien.statut || 'disponible',
        idProprietaire: bien.idProprietaire || bien.id_proprietaire || '',
        latitude: bien.latitude || '',
        longitude: bien.longitude || '',
        description: bien.description || '',
      });

      if (bien.photos) {
        setPhotosExistantes(Array.isArray(bien.photos) ? bien.photos : []);
      }
    }
  }, [bien]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererChangementImage = (fichier, apercu) => {
    if (fichier) {
      setNouvellesImages(prev => [...prev, { file: fichier, preview: apercu }]);
      // On incrémente la clef pour forcer le remount (et donc le reset) du composant d'upload
      setClefUpload(prev => prev + 1);
    }
  };

  const supprimerPhotoExistante = (index) => {
    setPhotosExistantes(prev => prev.filter((_, i) => i !== index));
  };

  const supprimerNouvelleImage = (index) => {
    setNouvellesImages(prev => prev.filter((_, i) => i !== index));
  };

  const gererSoumission = async () => {
    const erreursValidation = validerBien(formulaire);
    if (Object.keys(erreursValidation).length > 0) {
      setErreurs(erreursValidation);
      return;
    }

    try {
      await surSoumettre({
        ...formulaire,
        images: nouvellesImages.map(img => img.file),
        photos: photosExistantes
      });
    } catch (error) {
      console.error('Erreur soumission:', error);
    }
  };

  const optionsProprietaires = [
    { valeur: '', label: 'Sélectionner un propriétaire' },
    ...proprietaires.map((p) => ({ valeur: p.id, label: p.nom })),
  ];

  return (
    <Modale
      titre={bien ? 'Modifier le bien' : 'Nouveau bien'}
      surFermer={surAnnuler}
      taille="grand"
      enCours={enCours}
    >
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        <div style={{ gridColumn: '1 / -1', marginBottom: '1.5rem' }}>
          <label className="champ-formulaire__label">Images du bien</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {/* Photos déjà présentes sur le serveur */}
            {photosExistantes.map((url, index) => (
              <div key={`existante-${index}`} style={{ position: 'relative' }}>
                <img
                  src={getImageUrl(url, '/images/placeholders/bien-placeholder.svg')}
                  alt={`Existant ${index}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                />
                <button
                  type="button"
                  onClick={() => supprimerPhotoExistante(index)}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#ef4444', color: 'white', border: 'none',
                    borderRadius: '50%', width: '22px', height: '22px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  title="Supprimer cette image du serveur"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Nouvelles images ajoutées mais pas encore uploadées */}
            {nouvellesImages.map((img, index) => (
              <div key={`nouvelle-${index}`} style={{ position: 'relative' }}>
                <img
                  src={img.preview}
                  alt={`Aperçu ${index}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #3b82f6' }}
                />
                <div style={{
                  position: 'absolute', bottom: '0', left: '0', right: '0',
                  background: 'rgba(59, 130, 246, 0.8)', color: 'white',
                  fontSize: '10px', textAlign: 'center', padding: '2px 0',
                  borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px'
                }}>
                  Nouveau
                </div>
                <button
                  type="button"
                  onClick={() => supprimerNouvelleImage(index)}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#ef4444', color: 'white', border: 'none',
                    borderRadius: '50%', width: '22px', height: '22px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <UploadImage
              key={clefUpload}
              surChangement={gererChangementImage}
              largeur={100}
              hauteur={100}
              texteAide="+"
            />
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '0.5rem' }}>
            {photosExistantes.length > 0 && `${photosExistantes.length} image(s) conservée(s). `}
            {nouvellesImages.length > 0 && `${nouvellesImages.length} nouvelle(s) image(s) à ajouter.`}
          </p>
          {erreurs.images && <small className="champ-formulaire__erreur">{erreurs.images}</small>}
        </div>



        <ChampFormulaire

          id="type"

          label="Type de bien"

          type="select"

          valeur={formulaire.type}

          onChange={(val) => gererChangement('type', val)}

          erreur={erreurs.type}

          required

          options={[

            { valeur: '', label: 'Sélectionner un type' },

            ...OPTIONS_TYPES_BIEN,

          ]}

          disabled={enCours}

        />



        <ChampFormulaire

          id="statut"

          label="Statut"

          type="select"

          valeur={formulaire.statut}

          onChange={(val) => gererChangement('statut', val)}

          erreur={erreurs.statut}

          options={OPTIONS_STATUTS_BIEN}

          disabled={enCours}

        />



        <ChampFormulaire

          id="adresse"

          label="Adresse"

          type="text"

          valeur={formulaire.adresse}

          onChange={(val) => gererChangement('adresse', val)}

          erreur={erreurs.adresse}

          required

          placeholder="Ex: Rue 10, Médina, Dakar"

          icone={MapPin}

          disabled={enCours}

          largeurComplete

        />



        <ChampFormulaire

          id="superficie"

          label="Superficie (m²)"

          type="number"

          step="0.01"

          valeur={formulaire.superficie}

          onChange={(val) => gererChangement('superficie', val)}

          erreur={erreurs.superficie}

          placeholder="85.5"

          disabled={enCours}

        />



        <ChampFormulaire

          id="prix"

          label="Prix (FCFA)"

          type="number"

          step="1"

          valeur={formulaire.prix}

          onChange={(val) => gererChangement('prix', val)}

          erreur={erreurs.prix}

          placeholder="250000"

          icone={DollarSign}

          disabled={enCours}

        />



        <ChampFormulaire

          id="idProprietaire"

          label="Propriétaire"

          type="select"

          valeur={formulaire.idProprietaire}

          onChange={(val) => gererChangement('idProprietaire', val)}

          erreur={erreurs.idProprietaire}

          required

          options={optionsProprietaires}

          disabled={enCours}

          largeurComplete

        />



        <ChampFormulaire

          id="latitude"

          label="Latitude"

          type="number"

          step="0.000001"

          valeur={formulaire.latitude}

          onChange={(val) => gererChangement('latitude', val)}

          erreur={erreurs.latitude}

          placeholder="14.6937"

          aide="Coordonnées GPS (optionnel)"

          disabled={enCours}

        />



        <ChampFormulaire

          id="longitude"

          label="Longitude"

          type="number"

          step="0.000001"

          valeur={formulaire.longitude}

          onChange={(val) => gererChangement('longitude', val)}

          erreur={erreurs.longitude}

          placeholder="-17.4441"

          aide="Coordonnées GPS (optionnel)"

          disabled={enCours}

        />



        <ChampFormulaire

          id="description"

          label="Description"

          type="textarea"

          valeur={formulaire.description}

          onChange={(val) => gererChangement('description', val)}

          erreur={erreurs.description}

          placeholder="Appartement F3 meublé, 2 chambres..."

          rows={3}

          disabled={enCours}

          largeurComplete

        />



        <div style={{ gridColumn: '1 / -1' }}>

          <ActionsFormulaire

            surAnnuler={surAnnuler}

            texteBoutonPrincipal={bien ? 'Modifier' : 'Créer'}

            enCours={enCours}

            iconePrincipal={Home}

          />

        </div>

      </Formulaire>

    </Modale>

  );

}

