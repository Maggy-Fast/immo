import './ModulePermissions.css';

/**
 * Composant ModulePermissions — Affiche les permissions d'un module
 */
export default function ModulePermissions({ 
    module, 
    permissions, 
    permissionsSelectionnees, 
    onTogglePermission, 
    onToggleModule,
    disabled 
}) {
    const toutesSelectionnees = permissions.every(p => 
        permissionsSelectionnees.includes(p.id)
    );
    
    const certainesSelectionnees = permissions.some(p => 
        permissionsSelectionnees.includes(p.id)
    ) && !toutesSelectionnees;

    const nombreSelectionnees = permissions.filter(p => 
        permissionsSelectionnees.includes(p.id)
    ).length;

    return (
        <div className="module-permissions">
            <div 
                className="module-permissions__entete"
                onClick={() => !disabled && onToggleModule(permissions)}
            >
                <input
                    type="checkbox"
                    className="module-permissions__checkbox"
                    checked={toutesSelectionnees}
                    ref={input => {
                        if (input) input.indeterminate = certainesSelectionnees;
                    }}
                    onChange={() => onToggleModule(permissions)}
                    disabled={disabled}
                    onClick={(e) => e.stopPropagation()}
                />
                <h3 className="module-permissions__titre">{module}</h3>
                <span className="module-permissions__compteur">
                    {nombreSelectionnees}/{permissions.length}
                </span>
            </div>

            <div className="module-permissions__corps">
                {permissions.map(permission => (
                    <label 
                        key={permission.id} 
                        className="permission-item"
                    >
                        <input
                            type="checkbox"
                            className="permission-item__checkbox"
                            checked={permissionsSelectionnees.includes(permission.id)}
                            onChange={() => onTogglePermission(permission.id)}
                            disabled={disabled}
                        />
                        <div className="permission-item__contenu">
                            <p className="permission-item__libelle">
                                {permission.libelle}
                            </p>
                            <p className="permission-item__nom">
                                {permission.nom}
                            </p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}
