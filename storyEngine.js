import { renderRefinementModal } from './refinement.js';

export function render(container, state, transitionTo) {
    // Mock Story Generation based on plot points
    const storySegments = [
        {
            text: `The air shimmered with a peculiar resonance as you stepped into the void. Your world model suggested that ${state.worldModel.q1 || 'curiosity'} was the key to unlocking this realm. ${state.plotPoints[0] || 'Something began.'}`,
            choices: [
                { text: "Investigate the resonance", nextId: 1 },
                { text: "Retreat to safety", nextId: 2 }
            ]
        },
        // Mock segments for choices...
    ];

    let currentSegmentIndex = 0;

    container.innerHTML = `
        <div class="story-reader-container fade-in">
            <div class="story-header">
                <span class="chapter-label">Chapter 1</span>
                <div class="progress-bar"><div class="progress-fill" style="width: 10%"></div></div>
            </div>
            
            <div id="story-content" class="story-content">
                <!-- Text appears here -->
            </div>

            <div id="choices-area" class="choices-area">
                <!-- Choices appear here -->
            </div>
        </div>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        .story-reader-container { max-width: 750px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; }
        .story-header { margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; border-bottom: 2px solid var(--color-ai-purple); padding-bottom: 1rem; }
        .chapter-label { font-family: var(--font-code); color: var(--color-ai-cyan); text-transform: uppercase; letter-spacing: 2px; }
        .progress-bar { flex-grow: 1; height: 2px; background: var(--color-grid-line); }
        .progress-fill { height: 100%; background: var(--color-ai-purple); box-shadow: 0 0 10px var(--color-ai-purple); transition: width 0.5s; }
        
        .story-content { 
            flex-grow: 1; 
            font-family: var(--font-typewriter);
            font-size: 1.1rem; 
            line-height: 1.8; 
            margin-bottom: 2rem; 
            position: relative;
            color: var(--color-ink-primary);
        }
        .story-paragraph { margin-bottom: 1.5rem; animation: fadeInText 1s ease; }
        .story-paragraph::first-letter { font-size: 2rem; font-family: var(--font-handwriting); color: var(--color-ai-cyan); }
        .story-paragraph::selection { background: var(--color-ai-glow); color: var(--color-bg-paper); }
        
        .choices-area { display: grid; gap: 1rem; }
        .choice-btn {
            background: transparent;
            border: 1px solid var(--color-ai-cyan);
            padding: 1rem;
            color: var(--color-ai-cyan);
            text-align: left;
            cursor: pointer;
            transition: all 0.3s;
            font-family: var(--font-code);
            position: relative;
        }
        .choice-btn::before {
            content: '> ';
            opacity: 0;
            transition: opacity 0.3s;
        }
        .choice-btn:hover {
            background: rgba(0, 242, 255, 0.1);
            padding-left: 1.5rem;
        }
        .choice-btn:hover::before { opacity: 1; }

        @keyframes fadeInText { from { opacity: 0; } to { opacity: 1; } }
    `;
    container.appendChild(style);

    const contentArea = document.getElementById('story-content');
    const choicesArea = document.getElementById('choices-area');

    function typeText(text) {
        const p = document.createElement('p');
        p.className = 'story-paragraph';
        p.textContent = text;
        contentArea.appendChild(p);

        // Enable refinement on this paragraph
        p.addEventListener('mouseup', handleTextSelection);
    }

    function showChoices(choices) {
        choicesArea.innerHTML = choices.map((c, i) => `
            <button class="choice-btn" data-id="${c.nextId}">${c.text}</button>
        `).join('');
    }

    // Initial Load
    typeText(storySegments[0].text);
    setTimeout(() => {
        showChoices(storySegments[0].choices);
    }, 1000);

    // Choice Handler
    choicesArea.addEventListener('click', (e) => {
        if (e.target.classList.contains('choice-btn')) {
            // Mock progression
            contentArea.innerHTML = ''; // Clear for demo, or append
            typeText(`You chose to ${e.target.innerText}. The quantum probability collapses into a new reality. ${state.plotPoints[1] || 'The story continues...'}`);
            // Reset choices for demo
            setTimeout(() => {
                showChoices([
                    { text: "Continue deeper", nextId: 3 },
                    { text: "Reflect on the past", nextId: 4 }
                ]);
            }, 1000);
        }
    });

    function handleTextSelection() {
        const selection = window.getSelection();
        const text = selection.toString();
        if (text.length > 5) {
            // Calculate position for the modal
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            renderRefinementModal(text, rect.left, rect.bottom + window.scrollY);
        }
    }
}
