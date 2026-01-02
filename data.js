/* --- data.js --- */

// 1. Patrons SVG de base (Templates)
export const PATRONS = {
    tshirt: {
        category: 'Hauts', zIndex: 2, defaultScale: 100,
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20,25 L35,15 L65,15 L80,25 L80,45 L70,45 L70,95 L30,95 L30,45 L20,45 Z" fill="CURRENT_COLOR" stroke="#333" stroke-width="1"/></svg>`
    },
    pantalon: {
        category: 'Bas', zIndex: 1, defaultScale: 100,
        svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><path d="M10,0 L50,0 L55,100 L35,100 L30,30 L25,100 L5,100 Z" fill="CURRENT_COLOR" stroke="#333" stroke-width="1"/></svg>`
    },
    chaussures: {
        category: 'Chaussures', zIndex: 3, defaultScale: 80,
        svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M10,20 Q10,0 30,0 L70,0 Q90,0 90,20 L90,40 L10,40 Z" fill="CURRENT_COLOR" stroke="#333" stroke-width="1"/></svg>`
    }
};

// 2. Garde-Robe par défaut (Si l'utilisateur est nouveau)
const defaultItems = [
    { id: 'base-1', name: 'T-Shirt Blanc', category: 'Hauts', color: '#FFFFFF', zIndex: 2, scale: 100, x: 0, y: 0, src: PATRONS.tshirt.svg.replace('CURRENT_COLOR', '#FFFFFF') },
    { id: 'base-2', name: 'Jean Bleu', category: 'Bas', color: '#34495e', zIndex: 1, scale: 100, x: 0, y: 60, src: PATRONS.pantalon.svg.replace('CURRENT_COLOR', '#34495e') }
];

// 3. Fonctions de Gestion (API Interne)

// Récupérer la garde-robe (Storage > Défaut)
export function getInventory() {
    const stored = localStorage.getItem('virtua_inventory');
    return stored ? JSON.parse(stored) : defaultItems;
}

// Ajouter un item et sauvegarder
export function addItem(item) {
    const items = getInventory();
    items.push(item);
    localStorage.setItem('virtua_inventory', JSON.stringify(items));
}

// Récupérer la tenue actuelle portée
export function getOutfit() {
    const stored = localStorage.getItem('virtua_outfit');
    return stored ? JSON.parse(stored) : {};
}

// Sauvegarder la tenue portée
export function saveOutfit(outfit) {
    localStorage.setItem('virtua_outfit', JSON.stringify(outfit));
}

// Réinitialiser tout (pour le debug)
export function resetData() {
    localStorage.clear();
    location.reload();
}