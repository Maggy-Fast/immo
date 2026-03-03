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
        <div className="chargement__spinner" />
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
        <div className="chargement__spinner" />
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

export default function App() {
  return (
    <QueryClientProvider client={clientRequete}>
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
              <Route path="documents" element={<PageEnConstruction titre="Documents Fonciers" />} />
              <Route path="travaux" element={<PageEnConstruction titre="Travaux & Dépenses" />} />
              <Route path="carte" element={<PageEnConstruction titre="Carte Interactive" />} />
              <Route path="ia" element={<PageEnConstruction titre="Assistante IA Documents" />} />
              <Route path="parametres" element={<PageEnConstruction titre="Paramètres" />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FournisseurAuth>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
