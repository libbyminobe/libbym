// Main Application Entry Point

// State Management
const state = {
    currentView: 'onboarding', // onboarding | plotBuilder | storyReader
    worldModel: {},
    plotPoints: [],
    storyProgress: 0
};

// DOM Elements
const mainContent = document.getElementById('main-content');

// View Manager
async function loadView(viewName) {
    mainContent.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading ${viewName}...</p>
        </div>
    `;

    // Simulate loading delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const module = await import(`./modules/${viewName}.js`);
        module.render(mainContent, state, transitionTo);
    } catch (error) {
        console.error(`Failed to load view: ${viewName}`, error);
        mainContent.innerHTML = `<p class="error">Error loading module: ${error.message}</p>`;
    }
}

function transitionTo(viewName, data = {}) {
    state.currentView = viewName;
    // Update state with any data passed from previous view
    Object.assign(state, data);
    loadView(viewName);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Quantum Storyteller Initialized');
    // Start with onboarding
    loadView('onboarding');
});
