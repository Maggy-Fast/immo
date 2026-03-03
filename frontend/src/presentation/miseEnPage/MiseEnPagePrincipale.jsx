import { Outlet } from 'react-router-dom';
import BarreLaterale from '../composants/communs/BarreLaterale';
import './MiseEnPagePrincipale.css';

/**
 * Mise en page principale — Layout professionnel
 */
export default function MiseEnPagePrincipale() {
    return (
        <div className="mise-en-page">
            <BarreLaterale />
            <div className="mise-en-page__contenu">
                <main className="mise-en-page__principal">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
