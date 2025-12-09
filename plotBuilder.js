export function render(container, state, transitionTo) {
    let plotPoints = state.plotPoints || [];

    function renderPoints() {
        const list = document.getElementById('plot-list');
        list.innerHTML = plotPoints.map((point, index) => `
            <div class="plot-point-card">
                <div class="point-marker">${index + 1}</div>
                <div class="point-content">
                    <p>${point}</p>
                </div>
                <button class="btn-delete" data-index="${index}">×</button>
            </div>
        `).join('');
    }

    container.innerHTML = `
        <div class="plot-builder-container fade-in">
            <h2 class="section-title">Construct Timeline</h2>
            <p class="section-subtitle">Define the key events. The Quantum Engine will fill the voids.</p>
            
            <div class="timeline-interface">
                <div class="input-area">
                    <input type="text" id="new-point-input" placeholder="e.g., The protagonist discovers a hidden door...">
                    <button id="add-point-btn" class="btn-secondary">Add Event</button>
                </div>
                
                <div id="plot-list" class="plot-list">
                    <!-- Points go here -->
                </div>
            </div>

            <div class="actions">
                <button id="generate-story-btn" class="btn-primary" ${plotPoints.length === 0 ? 'disabled' : ''}>Generate Story</button>
            </div>
        </div>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        .plot-builder-container { max-width: 750px; margin: 0 auto; }
        .timeline-interface {
            background: transparent;
            border-left: 2px solid var(--color-ai-purple);
            padding: 1.5rem;
            margin-bottom: 2rem;
            position: relative;
        }
        .input-area { display: flex; gap: 1rem; margin-bottom: 2rem; align-items: flex-end; }
        #new-point-input {
            background: transparent;
            border: none;
            border-bottom: 2px solid var(--color-ai-cyan);
            color: var(--color-ink-primary);
            font-family: var(--font-typewriter);
            padding: 0.5rem;
            flex-grow: 1;
        }
        .btn-secondary {
            background: transparent;
            border: 1px dashed var(--color-ai-cyan);
            color: var(--color-ai-cyan);
            padding: 0.5rem 1rem;
            font-family: var(--font-code);
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-secondary:hover {
            background: var(--color-ai-cyan);
            color: var(--color-bg-paper);
        }
        .plot-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            position: relative;
        }
        .plot-point-card {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 0.5rem;
            position: relative;
            animation: fadeIn 0.3s ease;
        }
        .point-marker {
            width: 30px;
            height: 30px;
            background: var(--color-bg-paper);
            border: 2px solid var(--color-ai-purple);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-code);
            color: var(--color-ai-purple);
            flex-shrink: 0;
            margin-top: 5px;
        }
        .point-content { 
            flex-grow: 1; 
            font-family: var(--font-handwriting);
            font-size: 1.3rem;
            color: var(--color-ink-primary);
            border-bottom: 1px dotted var(--color-ink-secondary);
            padding-bottom: 0.5rem;
        }
        .btn-delete {
            background: none;
            border: none;
            color: #ff4444;
            font-family: var(--font-code);
            font-size: 1.2rem;
            cursor: pointer;
        }
        .actions { text-align: center; margin-top: 2rem; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    `;
    container.appendChild(style);

    // Event Listeners
    const input = document.getElementById('new-point-input');
    const addBtn = document.getElementById('add-point-btn');
    const generateBtn = document.getElementById('generate-story-btn');

    function addPoint() {
        const val = input.value.trim();
        if (val) {
            plotPoints.push(val);
            input.value = '';
            renderPoints();
            generateBtn.disabled = false;
        }
    }

    addBtn.addEventListener('click', addPoint);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPoint();
    });

    document.getElementById('plot-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const idx = parseInt(e.target.dataset.index);
            plotPoints.splice(idx, 1);
            renderPoints();
            if (plotPoints.length === 0) generateBtn.disabled = true;
        }
    });

    generateBtn.addEventListener('click', () => {
        transitionTo('storyEngine', { plotPoints });
    });

    // Initial Render
    renderPoints();
}
