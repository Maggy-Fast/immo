/**
 * Composant — Modal d'affichage de la répartition des bénéfices
 */

import { X, TrendingUp, TrendingDown, DollarSign, PieChart, Loader2 } from 'lucide-react';
import { formaterMontant } from '../../../application/utils/formatters';
import './ModalRepartition.css';

export default function ModalRepartition({ partenariat, repartition, chargement, surFermer }) {

  return (
    <div className="modal-overlay">
      <div className="modal modal--large">
        <div className="modal__entete">
          <h2>Calcul de répartition</h2>
          <button className="modal__fermer" onClick={surFermer}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-repartition">
          {chargement && (
            <div className="modal-repartition__chargement">
              <Loader2 size={24} className="chargement__spinner" />
              <p>Calcul en cours...</p>
            </div>
          )}

          {!chargement && repartition && (
            <>
              {/* Résumé financier */}
              <div className="modal-repartition__resume">
                <div className="modal-repartition__carte">
                  <div className="modal-repartition__carte-icone modal-repartition__carte-icone--success">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <span className="modal-repartition__label">Total ventes</span>
                    <span className="modal-repartition__valeur">
                      {formaterMontant(repartition.totalVentes || repartition.total_ventes || 0)}
                    </span>
                  </div>
                </div>

                <div className="modal-repartition__carte">
                  <div className="modal-repartition__carte-icone modal-repartition__carte-icone--danger">
                    <TrendingDown size={24} />
                  </div>
                  <div>
                    <span className="modal-repartition__label">Total dépenses</span>
                    <span className="modal-repartition__valeur">
                      {formaterMontant(repartition.totalDepenses || repartition.total_depenses || 0)}
                    </span>
                  </div>
                </div>

                <div className="modal-repartition__carte">
                  <div className="modal-repartition__carte-icone modal-repartition__carte-icone--primaire">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <span className="modal-repartition__label">Bénéfice net</span>
                    <span className="modal-repartition__valeur modal-repartition__valeur--primaire">
                      {formaterMontant(repartition.beneficeNet || repartition.benefice_net || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Répartition */}
              <div className="modal-repartition__parts">
                <h3 className="modal-repartition__titre">
                  <PieChart size={20} />
                  Répartition des bénéfices
                </h3>

                <div className="modal-repartition__grille">
                  {/* Part promoteur */}
                  <div className="modal-repartition__part">
                    <div className="modal-repartition__part-entete">
                      <span className="modal-repartition__part-titre">Promoteur</span>
                      <span className="modal-repartition__part-pct">
                        {repartition.partPromoteur?.pourcentage || repartition.part_promoteur?.pourcentage || 0}%
                      </span>
                    </div>
                    <div className="modal-repartition__part-montant">
                      {formaterMontant(repartition.partPromoteur?.montant || repartition.part_promoteur?.montant || 0)}
                    </div>
                    {partenariat.promoteur && (
                      <div className="modal-repartition__part-nom">{partenariat.promoteur.nom}</div>
                    )}
                  </div>

                  {/* Part propriétaire */}
                  <div className="modal-repartition__part">
                    <div className="modal-repartition__part-entete">
                      <span className="modal-repartition__part-titre">Propriétaire</span>
                      <span className="modal-repartition__part-pct">
                        {repartition.partProprietaire?.pourcentage || repartition.part_proprietaire?.pourcentage || 0}%
                      </span>
                    </div>
                    <div className="modal-repartition__part-montant">
                      {formaterMontant(repartition.partProprietaire?.montant || repartition.part_proprietaire?.montant || 0)}
                    </div>
                    {partenariat.proprietaire && (
                      <div className="modal-repartition__part-nom">{partenariat.proprietaire.nom}</div>
                    )}
                  </div>
                </div>

                {/* Ticket d'entrée */}
                {repartition.ticketEntreeRembourse !== undefined && (
                  <div className="modal-repartition__info">
                    <span className="modal-repartition__info-label">Ticket d'entrée:</span>
                    <span className={`modal-repartition__info-valeur ${repartition.ticketEntreeRembourse || repartition.ticket_entree_rembourse ? 'modal-repartition__info-valeur--success' : 'modal-repartition__info-valeur--warning'}`}>
                      {repartition.ticketEntreeRembourse || repartition.ticket_entree_rembourse ? 'Remboursé' : 'Non remboursé'}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {!chargement && !repartition && (
            <div className="modal-repartition__vide">
              <p>Aucune donnée de répartition disponible.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
