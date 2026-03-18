import { useEffect, useMemo } from 'react';
import { utiliserGroupesCooperative } from '../../../application/hooks/utiliserGroupesCooperative';
import { ecrireIdGroupeCooperativeActif, lireIdGroupeCooperativeActif } from '../../../application/utils/groupeCooperativeActif';

export default function SelecteurGroupeCooperative({ valeur, surChangement, afficherTous = false }) {
  const { groupes } = utiliserGroupesCooperative();

  const options = useMemo(() => {
    const base = groupes.map((g) => ({ valeur: String(g.id), label: g.nom }));
    if (afficherTous) {
      return [{ valeur: '', label: 'Tous les groupes' }, ...base];
    }
    return [{ valeur: '', label: 'Sélectionner un groupe' }, ...base];
  }, [groupes, afficherTous]);

  useEffect(() => {
    if (valeur !== undefined) return;

    const id = lireIdGroupeCooperativeActif();
    if (id && surChangement) {
      surChangement(String(id));
    }
  }, [valeur, surChangement]);

  const onChange = (e) => {
    const v = e.target.value;
    if (v) {
      ecrireIdGroupeCooperativeActif(parseInt(v, 10));
    } else {
      ecrireIdGroupeCooperativeActif(null);
    }
    surChangement?.(v);
  };

  return (
    <div className="champ-formulaire">
      <label className="champ-formulaire__label">Groupe</label>
      <select className="champ-formulaire__select" value={valeur ?? ''} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.valeur} value={opt.valeur}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
