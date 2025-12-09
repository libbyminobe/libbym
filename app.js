// State
const state = {
    isPanelOpen: false,
    chartInstance: null,
    text: '',
    currentArticle: null,
    savedArticles: [],
    currentTitles: [],
    titleSetIndex: 0
};

// DOM Elements
const editor = document.getElementById('editor');
const headlineInput = document.getElementById('article-headline');
const wordCountEl = document.getElementById('word-count');
const readTimeEl = document.getElementById('read-time');
const btnAnalyze = document.getElementById('btn-analyze');
const btnNewArticle = document.getElementById('btn-new-article');
const panel = document.getElementById('analysis-panel');
const btnClosePanel = document.getElementById('btn-close-panel');
const impactScoreEl = document.getElementById('impact-score');

// Init
function init() {
    bindEvents();
    resizeEditor();
    loadSavedArticles();
}

function findTextNodeAtPosition(root, position) {
    let currentPos = 0;

    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            if (currentPos + nodeLength >= position) {
                return node;
            }
            currentPos += nodeLength;
        } else {
            for (let child of node.childNodes) {
                const result = traverse(child);
                if (result) return result;
            }
        }
        return null;
    }

    return traverse(root);
}

function getNodeOffset(root, targetNode) {
    let offset = 0;

    function traverse(node) {
        if (node === targetNode) {
            return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            offset += node.textContent.length;
        } else {
            for (let child of node.childNodes) {
                if (traverse(child)) return true;
            }
        }
        return false;
    }

    traverse(root);
    return offset;
}

function bindEvents() {
    // Editor Input
    editor.addEventListener('input', handleInput);

    // Headline auto-resize
    headlineInput.addEventListener('input', () => {
        headlineInput.style.height = 'auto';
        headlineInput.style.height = headlineInput.scrollHeight + 'px';
    });

    // Analysis
    btnAnalyze.addEventListener('click', runAnalysis);

    // New Article
    btnNewArticle.addEventListener('click', startNewArticle);

    // Panel
    btnClosePanel.addEventListener('click', closePanel);

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // Reload Titles
    document.getElementById('btn-reload-titles').addEventListener('click', reloadTitles);
}

// Editor Logic
function handleInput() {
    const text = editor.innerText;
    state.text = text;

    // Word Count
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    wordCountEl.textContent = `${words} words`;

    // Read Time (avg 200 wpm)
    const minutes = Math.ceil(words / 200);
    readTimeEl.textContent = `${minutes} min read`;
}

function resizeEditor() {
    // focus editor on load
    editor.focus();
}

// Analysis Logic
async function runAnalysis() {
    if (!state.text.trim()) {
        alert('Please write some content first.');
        return;
    }

    // Show loading overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';

    const typeSelect = document.getElementById('article-type');
    const articleType = typeSelect.value;

    try {
        const [data] = await Promise.all([
            mockService.analyzeArticle(state.text, { articleType }),
            new Promise(resolve => setTimeout(resolve, 2000)) // Wait minimum 2 seconds for animation
        ]);

        // Hide loading overlay
        loadingOverlay.style.display = 'none';

        renderResults(data);
        openPanel();
    } catch (e) {
        console.error(e);
        alert("Analysis failed.");
    } finally {
        btnAnalyze.innerHTML = originalBtnText;
        btnAnalyze.disabled = false;
    }
}

function renderResults(data) {
    // Score & Score Details
    impactScoreEl.textContent = data.score;

    const detailsContainer = document.getElementById('score-details');
    const meaningEl = document.getElementById('score-meaning');
    const targetEl = document.getElementById('score-target');
    const tipsEl = document.getElementById('score-tips');

    if (data.scoreContext) {
        detailsContainer.style.display = 'block';
        meaningEl.textContent = data.scoreContext.meaning;
        targetEl.textContent = data.scoreContext.target;

        tipsEl.innerHTML = '';
        data.scoreContext.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsEl.appendChild(li);
        });
    }

    // Store problem sentences in state
    state.problemSentences = data.problemSentences;

    // Chart
    renderChart(data.radarData);

    // Strengths & Weaknesses (replaces Suggestions)
    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = '';

    // Strengths section
    if (data.strengths && data.strengths.length > 0) {
        const strengthsHeader = document.createElement('div');
        strengthsHeader.style.cssText = 'font-size: 13px; font-weight: 600; color: var(--success-color); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;';
        strengthsHeader.textContent = '✓ Strengths';
        strengthsList.appendChild(strengthsHeader);

        data.strengths.forEach(item => {
            const el = document.createElement('div');
            el.className = 'list-item';
            el.style.borderLeft = '3px solid var(--success-color)';
            el.innerHTML = `
                <div class="list-item-title">${item.title}</div>
                <div class="list-item-body">${item.message}</div>
            `;
            strengthsList.appendChild(el);
        });
    }

    // Weaknesses section
    if (data.weaknesses && data.weaknesses.length > 0) {
        const weaknessesHeader = document.createElement('div');
        weaknessesHeader.style.cssText = 'font-size: 13px; font-weight: 600; color: var(--warning-color); margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;';
        weaknessesHeader.textContent = '⚠ Areas for Improvement';
        strengthsList.appendChild(weaknessesHeader);

        data.weaknesses.forEach(item => {
            const el = document.createElement('div');
            el.className = 'list-item';
            el.style.borderLeft = '3px solid var(--warning-color)';
            el.innerHTML = `
                <div class="list-item-title">${item.title}</div>
                <div class="list-item-body">${item.message}</div>
            `;
            strengthsList.appendChild(el);
        });
    }

    // Titles & Lede
    renderTitles(data.titles);
    state.currentTitles = data.titles;

    const ledeEl = document.getElementById('lede-tips');
    ledeEl.innerHTML = '';
    if (data.ledeTips) {
        ledeEl.insertAdjacentHTML('beforeend', `<div class="list-item suggestion"><div class="list-item-body">${data.ledeTips}</div></div>`);
    }

    // AP Style (clickable to jump to error)
    const apList = document.getElementById('ap-list');
    apList.innerHTML = '';
    if (data.apStyle.length === 0) {
        apList.innerHTML = '<div class="list-item"><div class="list-item-body">AP Style looks clean.</div></div>';
    }
    data.apStyle.forEach(item => {
        const el = document.createElement('div');
        el.className = 'list-item ap-item-clickable';
        el.innerHTML = `<div class="list-item-title">${item.title}</div><div class="list-item-body">${item.message} <span style="font-size: 11px; opacity: 0.7;">(Click to locate)</span></div>`;

        // Click to jump to error location
        el.onclick = () => {
            if (item.position !== undefined) {
                // Find and highlight the error in the editor
                const range = document.createRange();
                const textNode = findTextNodeAtPosition(editor, item.position);

                if (textNode) {
                    const offset = item.position - getNodeOffset(editor, textNode);
                    range.setStart(textNode, offset);
                    range.setEnd(textNode, offset + item.length);

                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // Scroll to the selection
                    editor.focus();
                    const rect = range.getBoundingClientRect();
                    window.scrollTo({
                        top: rect.top + window.scrollY - 200,
                        behavior: 'smooth'
                    });

                    showToast('Error highlighted in editor');
                }
            }
        };

        apList.appendChild(el);
    });

    // Highlighting (no modal, just highlight)
    if (data.problemSentences.length > 0) {
        highlightProblemSentences(data.problemSentences);
    }

    // Audience
    const audienceEl = document.getElementById('audience-info');
    audienceEl.innerHTML = `<div class="list-item"><div class="list-item-title">Target Audience</div><div class="list-item-body" style="font-size: 16px; font-weight: 600; color: var(--accent-color);">${data.audience.primary}</div></div>`;

    // Score Card Click Handler - Toggle highlighting
    const scoreCard = document.querySelector('.score-card');
    const newScoreCard = scoreCard.cloneNode(true);
    scoreCard.parentNode.replaceChild(newScoreCard, scoreCard);

    newScoreCard.addEventListener('click', () => {
        if (data.problemSentences.length > 0) {
            highlightProblemSentences(data.problemSentences);
        }
    });

    // Wire up click handler for highlighted sentences to show modal
    editor.onclick = (e) => {
        if (e.target.classList.contains('highlight-warning')) {
            const textContent = e.target.textContent;
            const problem = state.problemSentences.find(p => p.text === textContent);
            if (problem) {
                showModal("Improvement Suggestion", `
                    <p><b>Issue:</b> ${problem.issue}</p>
                    <p><b>Why:</b> ${problem.rationale}</p>
                    <div class="co-create-example">
                        ${problem.cocreation}
                    </div>
                `);
            }
        }
    };
}

function renderTitles(titles) {
    const titlesList = document.getElementById('titles-list');
    titlesList.innerHTML = '';

    if (!titles || titles.length === 0) {
        titlesList.innerHTML = '<div class="list-item"><div class="list-item-body">No title suggestions.</div></div>';
        return;
    }

    titles.forEach(title => {
        const el = document.createElement('div');
        el.className = 'list-item title-option';
        el.style.cursor = 'pointer';
        el.innerHTML = `<div class="list-item-body" style="font-weight: 600; color: var(--text-primary);">${title}</div>`;
        el.onclick = () => {
            headlineInput.value = title;
            showToast('Title inserted!');
        };
        titlesList.appendChild(el);
    });
}

function reloadTitles() {
    const typeSelect = document.getElementById('article-type');
    const articleType = typeSelect.value;
    state.titleSetIndex = (state.titleSetIndex + 1) % 5; // Cycle through 5 sets
    const newTitles = mockService.generateTitles(state.text, articleType, state.titleSetIndex);
    renderTitles(newTitles);
    state.currentTitles = newTitles;
    showToast('New titles generated!');
}

function startNewArticle() {
    // Save current article if it has content
    if (state.text.trim() || headlineInput.value.trim()) {
        const article = {
            id: Date.now(),
            headline: headlineInput.value || 'Untitled Article',
            text: state.text,
            date: new Date().toISOString(),
            articleType: document.getElementById('article-type').value
        };
        state.savedArticles.unshift(article);
        saveSavedArticles();
        renderSavedArticles();
    }

    // Clear editor
    editor.innerHTML = '';
    headlineInput.value = '';
    state.text = '';
    state.currentArticle = null;
    state.titleSetIndex = 0; // Reset title index
    closePanel();

    showToast('Started new article');
}

function loadArticle(article) {
    headlineInput.value = article.headline;
    editor.innerText = article.text;
    state.text = article.text;
    state.currentArticle = article;
    document.getElementById('article-type').value = article.articleType || 'hard-news';
    handleInput();
    showToast('Article loaded');
}

function loadSavedArticles() {
    const saved = localStorage.getItem('newsrm-articles');
    if (saved) {
        state.savedArticles = JSON.parse(saved);
        renderSavedArticles();
    }
}

function saveSavedArticles() {
    localStorage.setItem('newsrm-articles', JSON.stringify(state.savedArticles));
}

function renderSavedArticles() {
    const savedList = document.getElementById('saved-list');
    savedList.innerHTML = '';

    if (state.savedArticles.length === 0) {
        savedList.innerHTML = '<div style="padding: 12px; font-size: 12px; opacity: 0.6; text-align: center;">No saved articles yet</div>';
        return;
    }

    state.savedArticles.forEach((article, index) => {
        const el = document.createElement('div');
        el.className = 'saved-item';
        el.draggable = true;
        el.dataset.index = index;

        const date = new Date(article.date);
        const timeAgo = getTimeAgo(date);

        el.innerHTML = `
            <div class="saved-item-content">
                <div class="saved-item-title">${article.headline}</div>
                <div class="saved-item-date">${timeAgo}</div>
            </div>
            <button class="saved-item-delete" title="Delete article">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Click to load (only on content area, not delete button)
        el.querySelector('.saved-item-content').onclick = () => loadArticle(article);

        // Delete button
        el.querySelector('.saved-item-delete').onclick = (e) => {
            e.stopPropagation();
            deleteArticle(article.id);
        };

        // Drag and drop handlers
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('drop', handleDrop);
        el.addEventListener('dragend', handleDragEnd);

        savedList.appendChild(el);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);

        // Reorder array
        const [removed] = state.savedArticles.splice(draggedIndex, 1);
        state.savedArticles.splice(targetIndex, 0, removed);

        saveSavedArticles();
        renderSavedArticles();
    }

    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function deleteArticle(articleId) {
    if (confirm('Delete this saved article?')) {
        state.savedArticles = state.savedArticles.filter(a => a.id !== articleId);
        saveSavedArticles();
        renderSavedArticles();
        showToast('Article deleted');
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--text-primary);
        color: var(--bg-app);
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function showModal(title, contentHTML) {
    const backdrop = document.getElementById('modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.getElementById('modal-close');

    modalTitle.textContent = title;
    modalContent.innerHTML = contentHTML;
    backdrop.style.display = 'flex';

    closeBtn.onclick = () => { backdrop.style.display = 'none'; };
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.style.display = 'none'; };
}

function highlightProblemSentences(problems) {
    if (!problems || problems.length === 0) return;
    const editorContent = editor.innerText;
    let newHTML = editorContent;
    let count = 0;
    problems.forEach(p => {
        // Simple replacement (safe for demo, risks loops in real apps if duplicate text)
        if (newHTML.includes(p.text)) {
            newHTML = newHTML.replace(p.text, `<span class="highlight-warning" style="cursor:pointer;">${p.text}</span>`);
            count++;
        }
    });
    editor.innerHTML = newHTML;
    if (count > 0) {
        alert(`Highlighted ${count} sentences that need improvement. Click on them for details.`);
    }
}

function renderChart(chartData) {
    const ctx = document.getElementById('radarChart').getContext('2d');

    if (state.chartInstance) {
        state.chartInstance.destroy();
    }

    state.chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Current',
                    data: chartData.current,
                    fill: true,
                    backgroundColor: 'rgba(124, 179, 66, 0.2)', // Light green with transparency
                    borderColor: 'rgba(124, 179, 66, 1)', // Light green
                    pointBackgroundColor: 'rgba(124, 179, 66, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(124, 179, 66, 1)'
                },
                {
                    label: 'Target',
                    data: chartData.target,
                    fill: false,
                    backgroundColor: 'rgba(85, 139, 47, 0.1)', // Darker green with transparency
                    borderColor: 'rgba(85, 139, 47, 0.8)', // Darker green
                    borderDash: [5, 5],
                    pointBackgroundColor: 'rgba(85, 139, 47, 0.8)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(85, 139, 47, 0.8)'
                }
            ]
        },
        options: {
            layout: {
                padding: 20 // Ensure labels don't get cut off
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const label = chartData.labels[index];
                    const definitions = mockService.getDefinitions();
                    showModal(label, `<p>${definitions[label]}</p>`);
                }
            },
            elements: {
                line: { borderWidth: 2 }
            },
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: { display: false }, // clean look
                    pointLabels: {
                        font: { size: 10 } // Smaller labels to fit
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { boxWidth: 10, font: { size: 11 } }
                }
            },
            maintainAspectRatio: false
        }
    });
}

// Panel Management
function openPanel() {
    panel.classList.add('open');
    state.isPanelOpen = true;
    // Resize main content if we wanted to squeeze it, but overlap is fine for now
}

function closePanel() {
    panel.classList.remove('open');
    state.isPanelOpen = false;
}

function switchTab(tabId) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `tab-${tabId}`) pane.classList.add('active');
    });
}

// Run
init();
