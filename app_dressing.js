/* --- app_dressing.js --- */
import { getInventory, addItem, PATRONS } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    renderGrid('Tous');
    setupFilters();
    setupCreationModal();
});

function renderGrid(filterCat) {
    const container = document.getElementById('dressing-grid');
    if(!container) return;
    
    container.innerHTML = '';
    const items = getInventory();
    
    const filtered = filterCat === 'Tous' ? items : items.filter(i => i.category === filterCat);

    if(filtered.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#888;">Aucun vêtement ici.</p>';
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        // Petit hack pour afficher les SVG data
        const imgSrc = item.src.startsWith('<svg') 
            ? `data:image/svg+xml;utf8,${encodeURIComponent(item.src)}` 
            : item.src;

        card.innerHTML = `
            <img src="${imgSrc}" class="item-img">
            <strong>${item.name}</strong>
            <small>${item.category}</small>
            <button class="action-button secondary-action" style="margin-top:10px; font-size:0.8rem">Essayer</button>
        `;
        
        // Redirection vers la cabine
        card.querySelector('button').onclick = () => {
            window.location.href = 'changing_room.html';
        };

        container.appendChild(card);
    });
}

function setupFilters() {
    const cats = ['Tous', 'Hauts', 'Bas', 'Chaussures'];
    const nav = document.getElementById('category-nav');
    
    cats.forEach(c => {
        const btn = document.createElement('div');
        btn.className = `cat-btn ${c === 'Tous' ? 'active' : ''}`;
        btn.textContent = c;
        btn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid(c);
        };
        nav.appendChild(btn);
    });
}

function setupCreationModal() {
    const modal = document.getElementById('creation-modal');
    const btnOpen = document.getElementById('btn-create');
    const btnSave = document.getElementById('btn-save-new');
    const btnCancel = document.getElementById('btn-cancel');

    if(!btnOpen) return;

    btnOpen.onclick = () => modal.style.display = 'flex';
    btnCancel.onclick = () => modal.style.display = 'none';

    // Logique de sauvegarde
    btnSave.onclick = () => {
        const type = document.getElementById('select-type').value;
        const color = document.getElementById('input-color').value;
        const name = document.getElementById('input-name').value || `Mon ${type}`;
        
        const template = PATRONS[type];
        const finalSvg = template.svg.replace('CURRENT_COLOR', color);

        const newItem = {
            id: 'custom-' + Date.now(),
            name: name,
            category: template.category,
            zIndex: template.zIndex,
            src: finalSvg,
            color: color,
            scale: template.defaultScale,
            x: 0, y: 0
        };

        addItem(newItem);
        modal.style.display = 'none';
        renderGrid('Tous'); // Rafraîchir l'affichage
        alert("Vêtement créé et ajouté à la garde-robe !");
    };
}