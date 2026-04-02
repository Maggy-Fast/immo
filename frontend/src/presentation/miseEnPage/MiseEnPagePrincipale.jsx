import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BarreLaterale from '../composants/communs/BarreLaterale';
import './MiseEnPagePrincipale.css';

/**
 * Mise en page principale — Layout professionnel
 */
export default function MiseEnPagePrincipale() {
    const [sidebarReduite, setSidebarReduite] = useState(false);

    const basculerSidebar = () => {
        setSidebarReduite(!sidebarReduite);
    };

    return (
        <div className="mise-en-page">
            <BarreLaterale 
                reduite={sidebarReduite} 
                auBasculement={basculerSidebar} 
            />
            <div className={`mise-en-page__contenu ${sidebarReduite ? 'mise-en-page__contenu--reduit' : ''}`}>
                <main className="mise-en-page__principal">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
