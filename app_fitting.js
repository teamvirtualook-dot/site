/* --- app_fitting.js --- */
import { getInventory, getOutfit, saveOutfit } from './data.js';

let currentOutfit = getOutfit(); // Charge la tenue depuis le localStorage
let editingItem = null;

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    updateAvatar();
    setupControls();
});

// --- 1. Catalogue ---
function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    const items = getInventory();
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        if(currentOutfit[item.category]?.id === item.id) div.classList.add('selected');
        
        const imgSrc = item.src.startsWith('<svg') 
            ? `data:image/svg+xml;utf8,${encodeURIComponent(item.src)}` 
            : item.src;

        div.innerHTML = `
            <img src="${imgSrc}" class="item-img">
            <span style="font-size:0.8rem">${item.name}</span>
        `;
        
        div.onclick = () => toggleItem(item);
        grid.appendChild(div);
    });
}

// --- 2. Gestion Avatar ---
function toggleItem(item) {
    // Si déjà porté, on enlève
    if (currentOutfit[item.category]?.id === item.id) {
        delete currentOutfit[item.category];
        editingItem = null;
    } else {
        // Sinon on remplace
        currentOutfit[item.category] = item;
        editingItem = item; // On passe en mode édition direct
    }
    
    saveOutfit(currentOutfit); // Sauvegarde automatique
    updateAvatar();
    renderCatalog(); // Pour mettre à jour la bordure "selected"
    updateAdjustmentPanel();
}

function updateAvatar() {
    const container = document.getElementById('avatar-container');
    // On garde l'avatar de base, on vire le reste
    container.querySelectorAll('.clothing-layer:not(#base-body)').forEach(el => el.remove());

    const layers = Object.values(currentOutfit).sort((a,b) => a.zIndex - b.zIndex);

    layers.forEach(item => {
        const img = document.createElement('img');
        const src = item.src.startsWith('<svg') 
            ? `data:image/svg+xml;utf8,${encodeURIComponent(item.src)}` 
            : item.src;
        
        img.src = src;
        img.className = 'clothing-layer';
        if(editingItem?.id === item.id) img.classList.add('active-edit');
        
        // Application Position & Scale
        const scale = (item.scale || 100) / 100;
        img.style.transform = `translate(calc(-50% + ${item.x||0}px), calc(-50% + ${item.y||0}px)) scale(${scale})`;
        
        // Click pour éditer
        img.onclick = (e) => {
            e.stopPropagation();
            editingItem = item;
            updateAvatar();
            updateAdjustmentPanel();
        };

        container.appendChild(img);
    });
}

// --- 3. Panneau d'Ajustement ---
function setupControls() {
    ['ctrl-x', 'ctrl-y', 'ctrl-scale'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            if(!editingItem) return;
            const val = parseInt(e.target.value);
            
            if(id === 'ctrl-x') editingItem.x = val;
            if(id === 'ctrl-y') editingItem.y = val;
            if(id === 'ctrl-scale') editingItem.scale = val;
            
            // Note: Ici on ne modifie que l'objet en mémoire vive de la tenue. 
            // Pour faire propre, il faudrait aussi mettre à jour l'inventaire global si on veut que ce soit permanent pour le vêtement, 
            // mais ici on ajuste juste pour la tenue actuelle.
            saveOutfit(currentOutfit);
            updateAvatar();
        });
    });

    // Clic dehors pour fermer
    document.getElementById('avatar-container').addEventListener('click', (e) => {
        if(e.target.id === 'avatar-container') {
            editingItem = null;
            updateAvatar();
            updateAdjustmentPanel();
        }
    });
}

function updateAdjustmentPanel() {
    const panel = document.getElementById('adjust-panel');
    if(!editingItem) {
        panel.classList.remove('visible');
        return;
    }
    panel.classList.add('visible');
    document.getElementById('ctrl-x').value = editingItem.x || 0;
    document.getElementById('ctrl-y').value = editingItem.y || 0;
    document.getElementById('ctrl-scale').value = editingItem.scale || 100;
}