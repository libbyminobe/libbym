export function render(container, state, transitionTo) {
    const questions = [
        { id: 'q1', text: "What drives your curiosity?", type: 'text', placeholder: "e.g., The unknown, human nature..." },
        { id: 'q2', text: "Describe a recurring dream or theme in your life.", type: 'textarea', placeholder: "I often dream about..." },
        { id: 'q3', text: "If you could change one law of physics, what would it be?", type: 'text', placeholder: "Gravity, Time..." },
        { id: 'q4', text: "What is your preferred pacing?", type: 'select', options: ["Fast & Chaotic", "Slow & Methodical", "Balanced"] }
    ];

    container.innerHTML = `
        <div class="onboarding-container fade-in">
            <h2 class="section-title">Calibrate World Model</h2>
            <p class="section-subtitle">Answer these questions to align the quantum narrative engine with your psyche.</p>
            
            <form id="onboarding-form">
                ${questions.map((q, index) => `
                    <div class="form-group" style="animation-delay: ${index * 0.1}s">
                        <label for="${q.id}">${q.text}</label>
                        ${renderInput(q)}
                    </div>
                `).join('')}
                
                <button type="submit" class="btn-primary">Initialize Plot Sequence</button>
            </form>
        </div>
    `;

    // Add styles dynamically for this view
    const style = document.createElement('style');
    style.textContent = `
        .onboarding-container {
            max-width: 650px;
            margin: 0 auto;
            border-left: 2px solid var(--color-ai-purple); /* Margin line */
            padding-left: 2rem;
        }
        .section-title {
            font-family: var(--font-handwriting);
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: var(--color-ai-cyan);
            transform: rotate(-1deg);
        }
        .section-subtitle {
            font-family: var(--font-code);
            margin-bottom: 2rem;
            color: var(--color-ink-secondary);
            border-bottom: 1px dashed var(--color-ink-secondary);
            padding-bottom: 1rem;
        }
        .form-group {
            margin-bottom: 2rem;
            opacity: 0;
            animation: slideUp 0.5s forwards;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-family: var(--font-typewriter);
            font-weight: 700;
            color: var(--color-ink-primary);
        }
        input, textarea, select {
            width: 100%;
            padding: 10px;
            background: transparent;
            border: none;
            border-bottom: 2px solid var(--color-ink-secondary);
            color: var(--color-ai-cyan);
            font-family: var(--font-handwriting);
            font-size: 1.4rem;
            transition: all 0.3s ease;
        }
        input:focus, textarea:focus, select:focus {
            outline: none;
            border-bottom-color: var(--color-ai-cyan);
            background: rgba(0, 242, 255, 0.05);
        }
        input::placeholder, textarea::placeholder {
            color: rgba(255, 255, 255, 0.1);
            font-family: var(--font-typewriter);
            font-size: 1rem;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    container.appendChild(style);

    // Handle Submit
    document.getElementById('onboarding-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const worldModel = {};
        questions.forEach(q => {
            worldModel[q.id] = document.getElementById(q.id).value;
        });

        console.log("World Model Calibrated:", worldModel);
        transitionTo('plotBuilder', { worldModel });
    });
}

function renderInput(q) {
    if (q.type === 'textarea') {
        return `<textarea id="${q.id}" rows="3" placeholder="${q.placeholder}" required></textarea>`;
    } else if (q.type === 'select') {
        return `
            <select id="${q.id}">
                ${q.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
        `;
    } else {
        return `<input type="${q.type}" id="${q.id}" placeholder="${q.placeholder}" required>`;
    }
}
