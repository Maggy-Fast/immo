/**
 * Page — Tableau de bord Coopérative
 */

import { useState } from 'react';
import { Users, DollarSign, MapPin, AlertTriangle, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { utiliserTableauBordCooperative } from '../../application/hooks/utiliserTableauBordCooperative';
import { lireIdGroupeCooperativeActif } from '../../application/utils/groupeCooperativeActif';
import SelecteurGroupeCooperative from '../composants/cooperative/SelecteurGroupeCooperative';
import { formaterMontant } from '../../application/utils/formatters';
import './PageTableauBordCooperative.css';

export default function PageTableauBordCooperative() {
  const [idGroupe, setIdGroupe] = useState(() => lireIdGroupeCooperativeActif());
  const { statistiques, chargement, erreur } = utiliserTableauBordCooperative(idGroupe);

  if (chargement) {
    return (
      <div className="page-cooperative__chargement">
        <Loader2 size={24} className="chargement__spinner" />
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="page-cooperative__erreur">
        <p>Erreur lors du chargement des statistiques</p>
      </div>
    );
  }

  const { adherents, cotisations, parcelles, resume } = statistiques || {};

  return (
    <div className="page-cooperative">
      {/* En-tête */}
      <div className="page-cooperative__entete">
        <div>
          <h1 className="page-cooperative__titre">Tableau de Bord Coopérative</h1>
          <p className="page-cooperative__description">
            Vue d'ensemble de votre coopérative d'habitat
          </p>
        </div>
        <div style={{ minWidth: 260 }}>
          <SelecteurGroupeCooperative
            valeur={idGroupe ? String(idGroupe) : ''}
            surChangement={(v) => setIdGroupe(v ? parseInt(v, 10) : null)}
          />
        </div>
      </div>

      {/* Cartes statistiques principales */}
      <div className="page-cooperative__grille-stats">
        {/* Adhérents */}
        <div className="carte-stat carte-stat--bleu">
          <div className="carte-stat__icone">
            <Users size={24} />
          </div>
          <div className="carte-stat__contenu">
            <p className="carte-stat__label">Adhérents Actifs</p>
            <p className="carte-stat__valeur">{adherents?.actifs || 0}</p>
            <p className="carte-stat__detail">
              sur {adherents?.total_adherents || 0} total
            </p>
          </div>
        </div>

        {/* Total encaissé */}
        <div className="carte-stat carte-stat--vert">
          <div className="carte-stat__icone">
            <DollarSign size={24} />
          </div>
          <div className="carte-stat__contenu">
            <p className="carte-stat__label">Total Encaissé</p>
            <p className="carte-stat__valeur">
              {formaterMontant(cotisations?.total_encaisse || 0)}
            </p>
            <p className="carte-stat__detail">
              {cotisations?.nb_echeances_payees || 0} paiements
            </p>
          </div>
        </div>

        {/* Parcelles attribuées */}
        <div className="carte-stat carte-stat--violet">
          <div className="carte-stat__icone">
            <MapPin size={24} />
          </div>
          <div className="carte-stat__contenu">
            <p className="carte-stat__label">Parcelles Attribuées</p>
            <p className="carte-stat__valeur">{parcelles?.attribuees || 0}</p>
            <p className="carte-stat__detail">
              sur {parcelles?.total_parcelles || 0} total
            </p>
          </div>
        </div>

        {/* Retards */}
        <div className="carte-stat carte-stat--rouge">
          <div className="carte-stat__icone">
            <AlertTriangle size={24} />
          </div>
          <div className="carte-stat__contenu">
            <p className="carte-stat__label">En Retard</p>
            <p className="carte-stat__valeur">
              {formaterMontant(cotisations?.total_en_retard || 0)}
            </p>
            <p className="carte-stat__detail">
              {cotisations?.nb_echeances_retard || 0} échéances
            </p>
          </div>
        </div>
      </div>

      {/* Détails */}
      <div className="page-cooperative__grille-details">
        {/* Adhérents */}
        <div className="carte">
          <div className="carte__entete">
            <h3 className="carte__titre">Adhérents</h3>
          </div>
          <div className="carte__corps">
            <div className="liste-stats">
              <div className="stat-ligne">
                <span className="stat-ligne__label">Total</span>
                <span className="stat-ligne__valeur">{adherents?.total_adherents || 0}</span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Actifs</span>
                <span className="stat-ligne__valeur stat-ligne__valeur--succes">
                  {adherents?.actifs || 0}
                </span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Suspendus</span>
                <span className="stat-ligne__valeur stat-ligne__valeur--avertissement">
                  {adherents?.suspendus || 0}
                </span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Radiés</span>
                <span className="stat-ligne__valeur stat-ligne__valeur--danger">
                  {adherents?.radies || 0}
                </span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Avec parcelle</span>
                <span className="stat-ligne__valeur">{adherents?.avec_parcelle || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cotisations */}
        <div className="carte">
          <div className="carte__entete">
            <h3 className="carte__titre">Cotisations</h3>
          </div>
          <div className="carte__corps">
            <div className="liste-stats">
              <div className="stat-ligne">
                <span className="stat-ligne__label">Encaissé</span>
                <span className="stat-ligne__valeur stat-ligne__valeur--succes">
                  {formaterMontant(cotisations?.total_encaisse || 0)}
                </span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">En attente</span>
                <span className="stat-ligne__valeur">
                  {formaterMontant(cotisations?.total_en_attente || 0)}
                </span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">En retard</span>
                <span className="stat-ligne__valeur stat-ligne__valeur--danger">
                  {formaterMontant(cotisations?.total_en_retard || 0)}
                </span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Taux de paiement</span>
                <span className="stat-ligne__valeur">
                  {resume?.taux_paiement || 0}%
                  {resume?.taux_paiement >= 80 ? (
                    <TrendingUp size={16} className="stat-ligne__icone stat-ligne__icone--succes" />
                  ) : (
                    <TrendingDown size={16} className="stat-ligne__icone stat-ligne__icone--danger" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Parcelles */}
        <div className="carte">
          <div className="carte__entete">
            <h3 className="carte__titre">Parcelles</h3>
          </div>
          <div className="carte__corps">
            <div className="liste-stats">
              <div className="stat-ligne">
                <span className="stat-ligne__label">Total</span>
                <span className="stat-ligne__valeur">{parcelles?.total_parcelles || 0}</span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Disponibles</span>
                <span className="stat-ligne__valeur stat-ligne__valeur--succes">
                  {parcelles?.disponibles || 0}
                </span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Attribuées</span>
                <span className="stat-ligne__valeur stat-ligne__valeur--info">
                  {parcelles?.attribuees || 0}
                </span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Vendues</span>
                <span className="stat-ligne__valeur">{parcelles?.vendues || 0}</span>
              </div>
              <div className="stat-ligne">
                <span className="stat-ligne__label">Taux d'attribution</span>
                <span className="stat-ligne__valeur">{resume?.taux_attribution || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
