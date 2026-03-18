import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FournisseurAuth, utiliserAuth } from './application/contexte/ContexteAuth';
import MiseEnPagePrincipale from './presentation/miseEnPage/MiseEnPagePrincipale';
import PageConnexion from './presentation/pages/PageConnexion';
import PageInscription from './presentation/pages/PageInscription';
import PageTableauDeBord from './presentation/pages/PageTableauDeBord';
import PageBiens from './presentation/pages/PageBiens';
import PageProprietaires from './presentation/pages/PageProprietaires';
import PageLocataires from './presentation/pages/PageLocataires';
import PageContrats from './presentation/pages/PageContrats';
import PageLoyers from './presentation/pages/PageLoyers';
import PageLotissements from './presentation/pages/PageLotissements';
import PagePartenariats from './presentation/pages/PagePartenariats';
import PageGestionRoles from './presentation/pages/PageGestionRoles';
import PageParametres from './presentation/pages/PageParametres';
import PageTableauBordCooperative from './presentation/pages/PageTableauBordCooperative';
import PageGroupesCooperative from './presentation/pages/PageGroupesCooperative';
import PageAdherents from './presentation/pages/PageAdherents';
import PageCotisations from './presentation/pages/PageCotisations';
import PageParcellesCooperative from './presentation/pages/PageParcellesCooperative';
import PageDocumentsFonciers from './presentation/pages/PageDocumentsFonciers';
import PageTravauxDepenses from './presentation/pages/PageTravauxDepenses';
import PageTravauxDepensesCarte from './presentation/pages/PageTravauxDepensesCarte';
import PageIA from './presentation/pages/PageIA';
import PageNotificationsWhatsapp from './presentation/pages/PageNotificationsWhatsapp';
import PageGestionTenants from './presentation/pages/PageGestionTenants';
import PageGestionUtilisateursGlobaux from './presentation/pages/PageGestionUtilisateursGlobaux';
import PageJournauxAudit from './presentation/pages/PageJournauxAudit';
import { Loader2 } from 'lucide-react';
import './styles/global.css';
import './styles/composants.css';

const clientRequete = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

/**
 * Route protégée — redirige vers /connexion si non authentifié
 */
function RouteProtegee({ children }) {
  const { estConnecte, chargement } = utiliserAuth();

  if (chargement) {
    return (
      <div className="chargement" style={{ minHeight: '100vh' }}>
        <Loader2 size={24} className="chargement__spinner" />
      </div>
    );
  }

  if (!estConnecte) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
}

/**
 * Route publique — redirige vers / si déjà authentifié
 */
function RoutePublique({ children }) {
  const { estConnecte, chargement } = utiliserAuth();

  if (chargement) {
    return (
      <div className="chargement" style={{ minHeight: '100vh' }}>
        <Loader2 size={24} className="chargement__spinner" />
      </div>
    );
  }

  if (estConnecte) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Composant placeholder pour les pages non encore implémentées
 */
function PageEnConstruction({ titre }) {
  return (
    <>
      <div style={{ padding: '2rem' }}>
        <div className="carte">
          <div className="carte__corps" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--couleur-noir)' }}>{titre}</h2>
            <p style={{ color: 'var(--couleur-gris)' }}>Cette page sera bientôt disponible.</p>
          </div>
        </div>
      </div>
    </>
  );
}

import { ToastProvider, ToastContainer } from './presentation/composants/communs';

export default function App() {
  return (
    <QueryClientProvider client={clientRequete}>
      <ToastProvider>
        <BrowserRouter>
          <FournisseurAuth>
            <Routes>
              {/* Routes publiques */}
              <Route
                path="/connexion"
                element={
                  <RoutePublique>
                    <PageConnexion />
                  </RoutePublique>
                }
              />
              <Route
                path="/inscription"
                element={
                  <RoutePublique>
                    <PageInscription />
                  </RoutePublique>
                }
              />

              {/* Routes protégées */}
              <Route
                element={
                  <RouteProtegee>
                    <MiseEnPagePrincipale />
                  </RouteProtegee>
                }
              >
                <Route index element={<PageTableauDeBord />} />
                <Route path="biens" element={<PageBiens />} />
                <Route path="proprietaires" element={<PageProprietaires />} />
                <Route path="locataires" element={<PageLocataires />} />
                <Route path="contrats" element={<PageContrats />} />
                <Route path="loyers" element={<PageLoyers />} />
                <Route path="lotissements" element={<PageLotissements />} />
                <Route path="partenariats" element={<PagePartenariats />} />
                <Route path="documents" element={<PageDocumentsFonciers />} />
                <Route path="travaux" element={<PageTravauxDepenses />} />
                <Route path="carte" element={<PageTravauxDepensesCarte />} />
                <Route path="ia" element={<PageIA />} />
                <Route path="roles" element={<PageGestionRoles />} />
                <Route path="parametres" element={<PageParametres />} />

                {/* Module Coopérative */}
                <Route path="cooperative" element={<PageTableauBordCooperative />} />
                <Route path="cooperative/groupes" element={<PageGroupesCooperative />} />
                <Route path="cooperative/adherents" element={<PageAdherents />} />
                <Route path="cooperative/cotisations" element={<PageCotisations />} />
                <Route path="cooperative/parcelles" element={<PageParcellesCooperative />} />
                <Route path="whatsapp" element={<PageNotificationsWhatsapp />} />

                {/* Administration Globale */}
                <Route path="admin/tenants" element={<PageGestionTenants />} />
                <Route path="admin/utilisateurs" element={<PageGestionUtilisateursGlobaux />} />
                <Route path="admin/audit" element={<PageJournauxAudit />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </FournisseurAuth>
        </BrowserRouter>
        <ToastContainer />
      </ToastProvider>
    </QueryClientProvider>
  );
}

