/**
 * Composant — Ligne de loyer dans un tableau
 */

import { Download, DollarSign, Calendar } from 'lucide-react';
import { LABELS_STATUTS_LOYER, COULEURS_STATUTS_LOYER } from '../../../domaine/valeursObjets/statutLoyer';
import { LABELS_MODES_PAIEMENT } from '../../../domaine/valeursObjets/modePaiement';
import { formaterMontant } from '../../../application/utils/formatters';
import './LigneLoyer.css';

export default function LigneLoyer({ 
  loyer, 
  surPayer, 
  surTelechargerQuittance,
  enCoursTelechargement 
}) {

  const formaterMois = (mois) => {
    const [annee, moisNum] = mois.split('-');
    const date = new Date(annee, parseInt(moisNum) - 1);
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formaterDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <tr className="ligne-loyer">
      <td className="ligne-loyer__mois">
        <Calendar size={16} />
        <span>{formaterMois(loyer.mois)}</span>
      </td>
      
      <td className="ligne-loyer__contrat">
        {loyer.contrat?.bien?.adresse || '-'}
        {loyer.contrat?.locataire && (
          <span className="ligne-loyer__locataire">
            {loyer.contrat.locataire.nom}
          </span>
        )}
      </td>
      
      <td className="ligne-loyer__montant">
        {formaterMontant(loyer.montant)}
      </td>
      
      <td className="ligne-loyer__statut">
        <span className={`badge badge--${COULEURS_STATUTS_LOYER[loyer.statut]}`}>
          {LABELS_STATUTS_LOYER[loyer.statut]}
        </span>
      </td>
      
      <td className="ligne-loyer__paiement">
        {loyer.datePaiement ? (
          <div className="ligne-loyer__info-paiement">
            <span>{formaterDate(loyer.datePaiement)}</span>
            {loyer.modePaiement && (
              <span className="ligne-loyer__mode">
                {LABELS_MODES_PAIEMENT[loyer.modePaiement]}
              </span>
            )}
          </div>
        ) : (
          <span className="ligne-loyer__non-paye">-</span>
        )}
      </td>
      
      <td className="ligne-loyer__actions">
        {loyer.statut !== 'paye' && (
          <button
            className="bouton bouton--petit bouton--primaire"
            onClick={() => surPayer(loyer)}
          >
            <DollarSign size={16} />
            Payer
          </button>
        )}
        
        {loyer.statut === 'paye' && (
          <button
            className="bouton bouton--petit bouton--secondaire"
            onClick={() => surTelechargerQuittance(loyer.id)}
            disabled={enCoursTelechargement}
          >
            <Download size={16} />
            Quittance
          </button>
        )}
      </td>
    </tr>
  );
}
