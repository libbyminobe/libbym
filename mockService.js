// 10 Elements of Journalism Definitions
const elementDefinitions = {
    "Truth": "Journalism's first obligation is to the truth. Does this piece rely on verifiable facts rather than just assertions?",
    "Loyalty to Citizens": "Journalism's first loyalty is to citizens. Is this piece written for the public interest, rather than special interests?",
    "Discipline of Verification": "The essence of journalism is a discipline of verification. Are quotes and facts checked? Is there transparency?",
    "Independence": "Journalists must maintain an independence from those they cover. Is the tone neutral and unbiased?",
    "Monitor Power": "Journalism must serve as an independent monitor of power. Does this piece hold powerful figures or institutions accountable?",
    "Public Forum": "Journalism must provide a forum for public criticism and compromise. Does it represent multiple viewpoints?",
    "Significance": "Journalism must make the significant interesting and relevant. Is the 'so what?' clear?",
    "Comprehensiveness": "Journalism should keep the news comprehensive and proportional. Does it avoid sensationalism?",
    "Personal Conscience": "Journalists must be allowed to exercise their personal conscience. Does the piece have moral clarity?"
};

window.mockService = {
    analyzeArticle: (text, context = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(generateMockData(text, context));
            }, 1000);
        });
    },
    getDefinitions: () => elementDefinitions,
    generateTitles: (text, articleType, setIndex = 0) => {
        return generateTitleOptions(text, articleType, setIndex);
    }
};

function generateTitleOptions(text, articleType, setIndex = 0) {
    const words = text.trim().split(/\s+/);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    // Extract key themes with better analysis
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'said', 'says', 'also', 'more', 'about', 'into', 'than', 'other', 'some', 'such', 'only', 'over', 'just', 'like', 'when', 'where', 'who', 'what', 'which', 'how', 'why'];

    // Find important words and phrases
    const wordFrequency = {};
    words.forEach(w => {
        const word = w.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length > 4 && !commonWords.includes(word)) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
    });

    // Get most frequent meaningful words
    const topWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    const mainTopic = topWords[0] || 'Story';
    const secondTopic = topWords[1] || 'Issue';
    const thirdTopic = topWords[2] || 'Development';

    // Extract compelling phrases from first sentence
    const firstSentence = sentences[0] || text.substring(0, 100);
    const verbMatch = firstSentence.match(/\b(reveals|shows|proves|demands|challenges|transforms|threatens|promises|exposes|uncovers|questions)\b/i);
    const actionVerb = verbMatch ? verbMatch[0] : 'Changes';

    // Generate 25 unique titles (5 sets of 5) - cycle through based on setIndex
    const allTitleSets = {
        'hard-news': [
            // Set 0
            [`${mainTopic} ${actionVerb}: What You Need to Know`,
            `Breaking: ${mainTopic} Sparks Immediate Controversy`,
            `Inside the ${mainTopic} Decision That Changed Everything`,
            `${mainTopic} Crisis: Officials Scramble to Respond`,
            `Exclusive: The Real Story Behind ${mainTopic}`],
            // Set 1
            [`${mainTopic} Shakes Up ${secondTopic}`,
            `New ${mainTopic} Policy Draws Sharp Criticism`,
            `${mainTopic}: The Facts Behind the Headlines`,
            `How ${mainTopic} Will Impact Your Community`,
            `${mainTopic} Controversy: What Happens Next`],
            // Set 2
            [`${mainTopic} Scandal Deepens`,
            `Breaking Down the ${mainTopic} Situation`,
            `${mainTopic}: A Timeline of Events`,
            `Officials Face Questions Over ${mainTopic}`,
            `${mainTopic} Fallout Continues to Spread`],
            // Set 3
            [`${mainTopic} Takes Center Stage`,
            `The ${mainTopic} Story No One Saw Coming`,
            `${mainTopic}: Key Developments You Missed`,
            `Behind Closed Doors: ${mainTopic} Revealed`,
            `${mainTopic} Raises Urgent Questions`],
            // Set 4
            [`${mainTopic}: The Complete Picture`,
            `What ${mainTopic} Means for ${secondTopic}`,
            `${mainTopic} Update: Latest Information`,
            `Critical ${mainTopic} Details Emerge`,
            `${mainTopic}: Everything We Know So Far`]
        ],
        'feature': [
            // Set 0
            [`The Untold Story of ${mainTopic}`,
            `How ${mainTopic} Quietly Transformed ${secondTopic}`,
            `Inside the World Where ${mainTopic} Rules`,
            `${mainTopic}: A Journey Through ${secondTopic}`,
            `The Day ${mainTopic} Changed Forever`],
            // Set 1
            [`Living With ${mainTopic}: One Person's Story`,
            `The Hidden World of ${mainTopic}`,
            `${mainTopic}: Then and Now`,
            `Voices from the ${mainTopic} Movement`,
            `When ${mainTopic} Met ${secondTopic}`],
            // Set 2
            [`${mainTopic}: A Portrait in Time`,
            `The People Shaping ${mainTopic}`,
            `${mainTopic}'s Surprising Origins`,
            `Life on the Front Lines of ${mainTopic}`,
            `${mainTopic}: The Human Cost`],
            // Set 3
            [`Discovering ${mainTopic}: A Personal Journey`,
            `The Art and Science of ${mainTopic}`,
            `${mainTopic} Through the Generations`,
            `What ${mainTopic} Taught Me About ${secondTopic}`,
            `The Soul of ${mainTopic}`],
            // Set 4
            [`${mainTopic}: An Intimate Look`,
            `The Legacy of ${mainTopic}`,
            `${mainTopic} in Their Own Words`,
            `Finding Meaning in ${mainTopic}`,
            `${mainTopic}: Where We Go From Here`]
        ],
        'op-ed': [
            // Set 0
            [`Why ${mainTopic} Is the Defining Issue of Our Time`,
            `The Uncomfortable Truth About ${mainTopic}`,
            `We're Getting ${mainTopic} All Wrong`,
            `${mainTopic} Isn't the Problem—${secondTopic} Is`,
            `It's Time to Rethink Everything We Know About ${mainTopic}`],
            // Set 1
            [`${mainTopic}: A Call to Action`,
            `The ${mainTopic} Debate We're Not Having`,
            `Stop Ignoring ${mainTopic}`,
            `${mainTopic} Demands Better From Us`,
            `Why I Changed My Mind About ${mainTopic}`],
            // Set 2
            [`The ${mainTopic} Myth That Won't Die`,
            `${mainTopic}: Let's Be Honest`,
            `We Can't Afford to Get ${mainTopic} Wrong`,
            `${mainTopic} Is a Symptom, Not the Disease`,
            `The Real Lesson of ${mainTopic}`],
            // Set 3
            [`${mainTopic}: The Conversation We Need`,
            `Don't Believe the Hype About ${mainTopic}`,
            `${mainTopic} Reveals Who We Really Are`,
            `The ${mainTopic} Question No One Wants to Answer`,
            `${mainTopic}: Time to Choose a Side`],
            // Set 4
            [`What ${mainTopic} Says About Our Values`,
            `${mainTopic}: Beyond the Talking Points`,
            `The Future of ${mainTopic} Is in Our Hands`,
            `${mainTopic}: A Moral Imperative`,
            `Why ${mainTopic} Matters More Than You Think`]
        ],
        'soft-news': [
            // Set 0
            [`You Won't Believe What's Happening With ${mainTopic}`,
            `The ${mainTopic} Trend Everyone's Talking About`,
            `How ${mainTopic} Became This Year's Biggest Surprise`,
            `Meet the People Behind ${mainTopic}`,
            `${mainTopic}: The Feel-Good Story We All Need`],
            // Set 1
            [`${mainTopic} Is Taking Over—Here's Why`,
            `The ${mainTopic} Phenomenon Explained`,
            `5 Reasons ${mainTopic} Is So Popular Right Now`,
            `${mainTopic}: Your Complete Guide`,
            `The Best ${mainTopic} Moments of the Year`],
            // Set 2
            [`${mainTopic}: What's the Big Deal?`,
            `Everyone's Obsessed With ${mainTopic}`,
            `The ${mainTopic} Craze: A Deep Dive`,
            `${mainTopic} Tips From the Experts`,
            `Why ${mainTopic} Is Everywhere Right Now`],
            // Set 3
            [`${mainTopic}: The Ultimate Explainer`,
            `Get Ready for the ${mainTopic} Revolution`,
            `${mainTopic} Success Stories That Will Inspire You`,
            `The ${mainTopic} Community You Need to Know`,
            `${mainTopic}: Fun Facts and Trivia`],
            // Set 4
            [`${mainTopic}: A Beginner's Guide`,
            `The ${mainTopic} Movement Is Here to Stay`,
            `${mainTopic} Hacks That Actually Work`,
            `Celebrating ${mainTopic} in All Its Forms`,
            `${mainTopic}: The Joy Is Real`]
        ]
    };

    const titleSets = allTitleSets[articleType] || allTitleSets['hard-news'];
    const index = setIndex % 5; // Cycle through 5 sets
    return titleSets[index];
}

function generateMockData(text, context) {
    const wordCount = text.trim().split(/\s+/).length;
    const hasText = wordCount > 5;

    // 1. Elements of Journalism
    const elements = Object.keys(elementDefinitions);
    const radarData = elements.map(() => 70 + Math.floor(Math.random() * 25));
    const targetData = elements.map(() => 85 + Math.floor(Math.random() * 10));
    const avgScore = Math.floor(radarData.reduce((a, b) => a + b, 0) / elements.length);

    // Score Context
    let scoreContext = { meaning: "Good Start", target: "85-100", tips: ["Add more verified sources.", "Sharpen the lede."] };
    if (avgScore >= 90) scoreContext = { meaning: "Excellent", target: "85-100", tips: ["Ready for final review."] };

    // 2. Titles & Lede Generation
    const titles = generateTitleOptions(text, context.articleType);

    let ledeTips = "";
    if (context && context.articleType) {
        switch (context.articleType) {
            case 'hard-news':
                ledeTips = "<strong>Hard News:</strong> Start with the most critical new information. Example: 'City Council voted 5-2 Tuesday to...'";
                break;
            case 'feature':
                ledeTips = "<strong>Feature:</strong> Focus on a scene or a character. Draw the reader in with narrative detail before getting to the nut graf.";
                break;
            case 'op-ed':
                ledeTips = "<strong>Op-Ed:</strong> Be bold. State your premise clearly and provocatively in the first paragraph.";
                break;
            case 'soft-news':
                ledeTips = "<strong>Soft News:</strong> Keep it light and conversational. Address the reader directly ('You might be wondering...').";
                break;
        }
    }

    // 3. Strengths & Weaknesses (Professorial tone, content-focused)
    const strengths = [];
    const weaknesses = [];

    // Analyze based on scores
    const topScores = radarData.map((score, idx) => ({ element: elements[idx], score }))
        .sort((a, b) => b.score - a.score);

    // STRENGTHS - Encouraging, specific praise
    if (topScores[0].score >= 85) {
        const element = topScores[0].element;
        let message = '';

        if (element === "Truth") {
            message = "Excellent work grounding your piece in verifiable facts. Your commitment to accuracy is evident and builds trust with readers.";
        } else if (element === "Significance") {
            message = "You've done a wonderful job establishing why this matters. The relevance to your audience is clear and compelling.";
        } else if (element === "Monitor Power") {
            message = "Strong accountability journalism here. You're asking the right questions and holding power to account effectively.";
        } else {
            message = `Your ${element.toLowerCase()} shines through. This is exactly the kind of thoughtful approach that elevates journalism.`;
        }

        strengths.push({ title: element, message });
    }

    if (hasText && wordCount > 150) {
        strengths.push({
            title: 'Depth & Development',
            message: "You've given yourself room to explore this topic thoroughly. The length allows for nuance and context, which readers appreciate."
        });
    } else if (hasText && wordCount > 50) {
        strengths.push({
            title: 'Focused Approach',
            message: "Nice concise treatment. You're respecting your reader's time while still delivering substance."
        });
    }

    // WEAKNESSES - Constructive, content-focused, professorial
    const bottomScores = topScores.slice(-2);

    bottomScores.forEach(item => {
        if (item.element === "Significance") {
            weaknesses.push({
                title: 'Clarify the Stakes',
                message: "I'd encourage you to think more deeply about <i>why this matters right now</i>. What's at stake for your readers? What changes if they understand this issue? Adding a paragraph that explicitly connects this to their lives would strengthen the piece considerably."
            });
        } else if (item.element === "Comprehensiveness") {
            weaknesses.push({
                title: 'Broaden Your Scope',
                message: "Consider whether you're giving readers the full picture. Are there perspectives or voices missing? Historical context that would illuminate the present? The piece would benefit from a wider lens—think about what your reader doesn't yet know that would help them understand this more fully."
            });
        } else if (item.element === "Monitor Power") {
            weaknesses.push({
                title: 'Sharpen Your Critical Edge',
                message: "This is solid reporting, but I'd push you to dig deeper into the power dynamics at play. Who benefits from the current situation? What questions aren't being answered? Your readers rely on you to ask the uncomfortable questions—don't be afraid to challenge authority more directly."
            });
        } else if (item.element === "Truth" || item.element === "Discipline of Verification") {
            weaknesses.push({
                title: 'Strengthen Your Evidence',
                message: "The central argument needs more support. Where can you add authoritative sources, data, or expert voices? Think about what would make a skeptical reader believe your claims. More attribution and verification will make this piece much more persuasive."
            });
        } else if (item.element === "Public Forum") {
            weaknesses.push({
                title: 'Include More Voices',
                message: "I'd love to see more perspectives represented here. Journalism at its best creates space for dialogue and multiple viewpoints. Who else has a stake in this issue? What do they have to say? Adding these voices would enrich the piece and serve your readers better."
            });
        } else if (item.element === "Independence") {
            weaknesses.push({
                title: 'Maintain Critical Distance',
                message: "Watch your tone here—are you maintaining enough distance from your subject? The best journalism is fair but not neutral. Make sure you're serving your readers' need for truth, not any particular agenda. Step back and ask: am I being an independent observer?"
            });
        }
    });

    // Add a general content weakness if we don't have enough
    if (weaknesses.length < 2 && hasText) {
        weaknesses.push({
            title: 'Develop Your Central Idea',
            message: "What's the one thing you want readers to take away from this? I'd encourage you to identify your core thesis more clearly and then build everything around it. Every paragraph should serve that central idea. Ask yourself: what's the 'so what?' of this piece?"
        });
    }

    // 4. Problem Sentences (Grammar/Structure - for Impact Score highlighting)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const problemSentences = [];

    sentences.forEach(sent => {
        const s = sent.trim();
        if (s.split(' ').length > 30) {
            problemSentences.push({
                text: s,
                issue: "Run-on Sentence",
                rationale: "This sentence is trying to do too much. It risks losing the reader's attention.",
                cocreation: "<strong>Try splitting it:</strong> <br>\"This is the first idea. This is the second idea.\"<br><strong>Or using a semicolon:</strong> <br>\"This is the first idea; this is the consequence.\""
            });
        } else if (s.toLowerCase().includes('very') || s.toLowerCase().includes('really') || s.toLowerCase().includes('literally')) {
            problemSentences.push({
                text: s,
                issue: "Weak Descriptor",
                rationale: `Words like 'very' dilute your meaning instead of strengthening it.`,
                cocreation: `<strong>Instead of "${s}":</strong><br>Try using a stronger specific word. e.g., swap "very big" for "colossal" or "very angry" for "furious".`
            });
        }
    });

    // 5. AP Style (with position tracking)
    const apStyle = [];
    if (hasText) {
        // Find numeral errors with positions
        const numeralMatches = [...text.matchAll(/\b([0-9])\b/g)];
        numeralMatches.forEach(match => {
            apStyle.push({
                title: 'Numerals',
                message: `Spell out "${match[1]}" as a word.`,
                position: match.index,
                length: match[0].length
            });
        });
    }

    // 6. Audience Detection (keyword-based)
    let specificAudience = "General Interest Readers";
    const lowerText = text.toLowerCase();

    // Build keyword frequency map
    const audienceKeywords = {
        'Sports Fans & Alumni': ['coach', 'player', 'team', 'game', 'score', 'season', 'championship', 'athletic', 'tournament', 'league'],
        'Local Community Members': ['council', 'mayor', 'city', 'town', 'local', 'community', 'neighborhood', 'resident', 'municipal'],
        'Students & Faculty': ['student', 'campus', 'university', 'college', 'professor', 'class', 'academic', 'education', 'semester'],
        'Business Professionals': ['business', 'company', 'market', 'economy', 'investment', 'corporate', 'industry', 'financial', 'revenue'],
        'Parents & Families': ['parent', 'child', 'family', 'school', 'kids', 'children', 'parenting', 'elementary'],
        'Tech Enthusiasts': ['technology', 'software', 'digital', 'app', 'platform', 'data', 'innovation', 'startup', 'tech'],
        'Health & Wellness Readers': ['health', 'medical', 'doctor', 'patient', 'hospital', 'wellness', 'treatment', 'disease', 'care']
    };

    let maxScore = 0;
    Object.entries(audienceKeywords).forEach(([audience, keywords]) => {
        let score = 0;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}`, 'gi');
            const matches = lowerText.match(regex);
            if (matches) score += matches.length;
        });
        if (score > maxScore) {
            maxScore = score;
            specificAudience = audience;
        }
    });

    return {
        score: avgScore,
        scoreContext: scoreContext,
        radarData: { labels: elements, current: radarData, target: targetData },
        strengths: strengths,
        weaknesses: weaknesses,
        titles: titles,
        ledeTips: ledeTips,
        apStyle: apStyle,
        problemSentences: problemSentences,
        audience: { primary: specificAudience }
    };
}
