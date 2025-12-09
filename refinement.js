export function renderRefinementModal(selectedText, x, y) {
    // Remove existing modal if any
    const existing = document.getElementById('refinement-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'refinement-modal';
    modal.className = 'refinement-modal glass-panel';
    modal.style.left = `${x}px`;
    modal.style.top = `${y + 10}px`;

    modal.innerHTML = `
        <div class="modal-header">
            <h4>Embellish Reality</h4>
            <button class="close-btn">×</button>
        </div>
        <p class="selected-preview">"${selectedText.substring(0, 30)}..."</p>
        <div class="tools">
            <button class="tool-btn" title="Add Image">📷</button>
            <button class="tool-btn" title="Rewrite">✍️</button>
            <button class="tool-btn" title="Expand">✨</button>
        </div>
        <textarea placeholder="Describe your vision for this segment..."></textarea>
        <button class="btn-primary btn-sm">Apply Quantum Shift</button>
    `;

    document.body.appendChild(modal);

    // Styles (injected once ideally, but here for modularity)
    if (!document.getElementById('refinement-styles')) {
        const style = document.createElement('style');
        style.id = 'refinement-styles';
        style.textContent = `
            .refinement-modal {
                position: absolute;
                width: 320px;
                z-index: 1000;
                padding: 1rem;
                background: var(--color-bg-paper);
                border: 2px solid var(--color-ai-purple);
                box-shadow: 0 0 20px rgba(189, 0, 255, 0.2);
                animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; border-bottom: 1px dashed var(--color-ai-purple); padding-bottom: 0.5rem; }
            .modal-header h4 { color: var(--color-ai-purple); font-family: var(--font-code); font-size: 0.9rem; text-transform: uppercase; }
            .close-btn { background: none; border: none; color: var(--color-ink-secondary); cursor: pointer; font-size: 1.2rem; }
            .selected-preview { font-family: var(--font-typewriter); font-style: italic; color: var(--color-ink-primary); font-size: 0.8rem; margin-bottom: 1rem; border-left: 2px solid var(--color-ai-cyan); padding-left: 0.5rem; }
            .tools { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
            .tool-btn { background: transparent; border: 1px solid var(--color-ink-secondary); color: var(--color-ink-primary); padding: 0.5rem; cursor: pointer; transition: all 0.2s; }
            .tool-btn:hover { border-color: var(--color-ai-cyan); color: var(--color-ai-cyan); box-shadow: 0 0 5px var(--color-ai-glow); }
            .refinement-modal textarea { 
                width: 100%; 
                margin-bottom: 0.5rem; 
                font-family: var(--font-handwriting); 
                font-size: 1.1rem;
                background: rgba(255,255,255,0.05);
                border: none;
                color: var(--color-ai-cyan);
                padding: 0.5rem;
            }
            .btn-sm { padding: 0.5rem 1rem; font-size: 0.8rem; width: 100%; text-transform: uppercase; letter-spacing: 1px; }
            
            @keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        `;
        document.head.appendChild(style);
    }

    // Close logic
    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());

    // Apply logic (Mock)
    modal.querySelector('.btn-primary').addEventListener('click', () => {
        const btn = modal.querySelector('.btn-primary');
        btn.textContent = "Shift Applied...";
        setTimeout(() => modal.remove(), 800);
    });
}
