const CLE_STORAGE = 'cooperative_id_groupe';

export function lireIdGroupeCooperativeActif() {
  const valeur = localStorage.getItem(CLE_STORAGE);
  if (!valeur) return null;
  const id = parseInt(valeur, 10);
  return Number.isFinite(id) ? id : null;
}

export function ecrireIdGroupeCooperativeActif(idGroupe) {
  if (idGroupe === null || idGroupe === undefined || idGroupe === '') {
    localStorage.removeItem(CLE_STORAGE);
    return;
  }
  localStorage.setItem(CLE_STORAGE, String(idGroupe));
}
