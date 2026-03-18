/**
 * Composant ChampFormulaire Réutilisable - Design Moderne
 */

import React from 'react';
import './ChampFormulaire.css';

export default function ChampFormulaire({
  label,
  type = 'text',
  valeur,
  onChange,
  placeholder,
  required = false,
  obligatoire = false, // alias francophone de required
  aide,
  erreur,
  icone: Icone,
  options = [], // Pour les selects
  rows = 3, // Pour les textareas
  min,
  max,
  step,
  disabled = false,
  className = '',
  id,
  largeurComplete, // consommée ici, non transmise au DOM
  ...props
}) {
  // Supporte `obligatoire` comme alias francophone de `required`
  const estRequis = required || obligatoire;
  const idChamp = id || `champ-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  const renderChamp = () => {
    const classesCommunes = `champ-formulaire__input ${Icone ? 'champ-formulaire__input--avec-icone' : ''} ${erreur ? 'champ-formulaire__input--erreur' : ''}`;

    // Supporte à la fois une référence de composant (User) et un élément JSX (<User size={18} />)
    const renderIcone = () => {
      if (!Icone) return null;
      // React.isValidElement détecte fiablement les éléments JSX (<User size={18} />)
      if (React.isValidElement(Icone)) return Icone;
      // Sinon référence de composant (fonction, classe ou forwardRef)
      return <Icone size={18} />;
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={idChamp}
            value={valeur}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            disabled={disabled}
            className={`champ-formulaire__textarea ${erreur ? 'champ-formulaire__textarea--erreur' : ''}`}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            id={idChamp}
            value={valeur}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className={`champ-formulaire__select ${erreur ? 'champ-formulaire__select--erreur' : ''}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.valeur} value={option.valeur}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <div className="champ-formulaire__input-wrapper">
            {Icone && (
              <div className="champ-formulaire__icone">
                {renderIcone()}
              </div>
            )}
            <input
              id={idChamp}
              type="file"
              onChange={(e) => onChange(e.target.files[0] || null)}
              placeholder={placeholder}
              required={estRequis}
              disabled={disabled}
              accept={props.accept}
              className={`champ-formulaire__input ${Icone ? 'champ-formulaire__input--avec-icone' : ''} ${erreur ? 'champ-formulaire__input--erreur' : ''}`}
              {...props}
            />
          </div>
        );

      default:
        if (type === 'file') {
          return (
            <div className="champ-formulaire__input-wrapper">
              {Icone && (
                <div className="champ-formulaire__icone">
                  {renderIcone()}
                </div>
              )}
              <input
                id={idChamp}
                type="file"
                onChange={(e) => onChange(e.target.files[0] || null)}
                placeholder={placeholder}
                required={estRequis}
                disabled={disabled}
                accept={props.accept}
                className={`champ-formulaire__input ${Icone ? 'champ-formulaire__input--avec-icone' : ''} ${erreur ? 'champ-formulaire__input--erreur' : ''}`}
                {...props}
              />
            </div>
          );
        }

        return (
          <div className="champ-formulaire__input-wrapper">
            {Icone && (
              <div className="champ-formulaire__icone">
                {renderIcone()}
              </div>
            )}
            <input
              id={idChamp}
              type={type}
              value={valeur}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={estRequis}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className={classesCommunes}
              {...props}
            />
          </div>
        );
    }
  };

  return (
    <div className={`champ-formulaire ${className}`}>
      {label && (
        <label htmlFor={idChamp} className="champ-formulaire__label">
          {label}
          {estRequis && <span className="champ-formulaire__requis">*</span>}
        </label>
      )}
      {renderChamp()}
      {aide && !erreur && (
        <small className="champ-formulaire__aide">{aide}</small>
      )}
      {erreur && (
        <small className="champ-formulaire__erreur">{erreur}</small>
      )}
    </div>
  );
}
