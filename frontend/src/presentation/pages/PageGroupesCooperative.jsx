import { useMemo, useState } from 'react';
import { Plus, Trash2, Loader2, Users, Search, Info, LayoutGrid, Eye } from 'lucide-react';
import { utiliserGroupesCooperative } from '../../application/hooks/utiliserGroupesCooperative';
import { useToast } from '../composants/communs/ToastContext';
import ModaleDetailsGroupe from '../composants/cooperative/ModaleDetailsGroupe';
import ChampFormulaire from '../composants/communs/ChampFormulaire';
import './PageGroupesCooperative.css';

export default function PageGroupesCooperative() {
  const { notifier } = useToast();
  const {
    groupes,
    chargement,
    erreur,
    creer,
    supprimer,
    enCoursCreation,
    enCoursSuppression,
    obtenirDetails
  } = utiliserGroupesCooperative();

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [recherche, setRecherche] = useState('');
  const [groupeSelectionneId, setGroupeSelectionneId] = useState(null);

  const groupesFiltres = useMemo(() => {
    return groupes.filter(g => 
      g.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      (g.description && g.description.toLowerCase().includes(recherche.toLowerCase()))
    );
  }, [groupes, recherche]);

  const peutCreer = useMemo(() => nom.trim().length > 0 && !enCoursCreation, [nom, enCoursCreation]);

  const gererCreation = async (e) => {
    e.preventDefault();
    if (!peutCreer) return;

    try {
      await creer({ nom: nom.trim(), description: description.trim() || null });
      setNom('');
      setDescription('');
      notifier('Groupe créé avec succès');
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de la création du groupe', 'error');
    }
  };

  const gererSuppression = async (e, groupe) => {
    e.stopPropagation();
    if (!window.confirm(`Voulez-vous vraiment supprimer le groupe "${groupe.nom}" ?`)) return;
    
    try {
      await supprimer(groupe.id);
      notifier('Groupe supprimé');
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  return (
    <div className="page-groupes">
      <div className="page-groupes__entete">
        <div>
          <h1 className="page-groupes__titre">Groupes Coopérative</h1>
          <p className="page-groupes__description">Gérez vos membres et parcelles par groupes structurés.</p>
        </div>
      </div>

      <div className="page-groupes__layout">
        {/* Panneau latéral : Création */}
        <aside className="carte-creation">
          <div className="carte">
            <div className="carte__entete">
                <h2 className="carte__titre" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} />
                    Nouveau Groupe
                </h2>
            </div>
            <div className="carte__corps">
              <form onSubmit={gererCreation} style={{ display: 'grid', gap: '1rem' }}>
                <ChampFormulaire
                  label="Nom du groupe"
                  valeur={nom}
                  onChange={setNom}
                  placeholder="Ex: Groupe de Gagnoa"
                  obligatoire
                />
                <ChampFormulaire
                  label="Description"
                  type="textarea"
                  valeur={description}
                  onChange={setDescription}
                  placeholder="Détails sur la localisation ou le projet..."
                  rows={3}
                />
                <button 
                    className="bouton bouton--primaire bouton--large" 
                    type="submit" 
                    disabled={!peutCreer}
                    style={{ marginTop: '0.5rem' }}
                >
                  {enCoursCreation ? (
                    <>
                      <Loader2 size={18} className="chargement__spinner" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Créer le groupe
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Zone principale : Liste et Recherche */}
        <main className="page-groupes__principal">
          <div className="carte" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--couleur-gris)' }} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un groupe..." 
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        style={{ paddingLeft: '2.5rem', width: '100%', border: '1px solid var(--couleur-gris-tres-clair)', borderRadius: '12px', height: '44px' }}
                    />
                </div>
                <div style={{ color: 'var(--couleur-gris-sombre)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {groupesFiltres.length} groupe(s) trouvé(s)
                </div>
             </div>
          </div>

          {chargement && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', gap: '1rem' }}>
              <Loader2 size={32} className="chargement__spinner" color="var(--couleur-primaire)" />
              <p>Chargement des groupes...</p>
            </div>
          )}

          {erreur && <div className="alerte alerte--erreur">Erreur lors du chargement des groupes. Réessayez plus tard.</div>}

          {!chargement && !erreur && groupesFiltres.length === 0 && (
            <div className="page-groupes__vide" style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '20px', border: '1px dashed var(--couleur-gris-clair)' }}>
              <LayoutGrid size={48} color="var(--couleur-gris-clair)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--couleur-gris-sombre)' }}>Aucun groupe ne correspond à votre recherche.</p>
            </div>
          )}

          {!chargement && !erreur && groupesFiltres.length > 0 && (
            <div className="groupes-grille">
              {groupesFiltres.map((g) => (
                <div
                  key={g.id}
                  className="carte-groupe"
                  onClick={() => setGroupeSelectionneId(g.id)}
                >
                  <div className="carte-groupe__icone">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="carte-groupe__nom">{g.nom}</h3>
                    <p className="carte-groupe__desc">{g.description || 'Aucune description fournie.'}</p>
                  </div>
                  
                  <div className="carte-groupe__footer">
                    <div className="carte-groupe__actions">
                        <button 
                            className="bouton-action bouton-action--voir" 
                            title="Voir les détails"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            className="bouton-action bouton-action--danger"
                            disabled={enCoursSuppression}
                            onClick={(e) => gererSuppression(e, g)}
                            title="Supprimer"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--couleur-gris-sombre)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Info size={14} />
                        Cliquez pour voir
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modale de détails */}
      {groupeSelectionneId && (
        <ModaleDetailsGroupe
            idGroupe={groupeSelectionneId}
            surFermer={() => setGroupeSelectionneId(null)}
            obtenirDetails={obtenirDetails}
        />
      )}
    </div>
  );
}
