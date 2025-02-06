// Symptom database with icons
const symptoms = [
    { id: 'cough', name: 'Cough', icon: '🤧' },
    { id: 'fever', name: 'Fever', icon: '🌡️' },
    { id: 'headache', name: 'Headache', icon: '🤕' },
    { id: 'sneezing', name: 'Sneezing', icon: '💨' },
    { id: 'runny-nose', name: 'Runny Nose', icon: '👃' },
    { id: 'body-aches', name: 'Body Aches', icon: '💪' },
    { id: 'nausea', name: 'Nausea', icon: '🤢' },
    { id: 'fatigue', name: 'Fatigue', icon: '😴' }
];

const conditions = {
    'Common Cold': {
        symptoms: ['cough', 'sneezing', 'runny-nose'],
        weight: 0.7
    },
    'Flu': {
        symptoms: ['fever', 'body-aches', 'headache', 'fatigue'],
        weight: 0.9
    },
    'Allergies': {
        symptoms: ['sneezing', 'runny-nose'],
        weight: 0.8
    },
    'Migraine': {
        symptoms: ['headache', 'nausea'],
        weight: 0.85
    }
};

let selectedSymptoms = [];

// Initialize symptom selector
function initializeSymptoms() {
    const container = document.getElementById('symptomList');
    symptoms.forEach(symptom => {
        const card = document.createElement('div');
        card.className = 'symptom-card';
        card.innerHTML = `
            <div class="symptom-icon">${symptom.icon}</div>
            <div>${symptom.name}</div>
        `;
        card.dataset.symptomId = symptom.id;
        card.onclick = () => toggleSymptom(symptom.id);
        container.appendChild(card);
    });
}

// Toggle symptom selection
function toggleSymptom(symptomId) {
    const index = selectedSymptoms.indexOf(symptomId);
    const card = document.querySelector(`[data-symptom-id="${symptomId}"]`);
    
    if (index === -1) {
        selectedSymptoms.push(symptomId);
        card.classList.add('selected');
    } else {
        selectedSymptoms.splice(index, 1);
        card.classList.remove('selected');
    }

    // Update selected counter
    const counter = document.getElementById('selectedCounter');
    counter.textContent = selectedSymptoms.length;
    counter.style.display = selectedSymptoms.length ? 'flex' : 'none';
}

// Analyze symptoms
function analyzeSymptoms() {
    if (selectedSymptoms.length === 0) {
        showToast('⚠️ Please select at least one symptom!');
        return;
    }

    const matches = calculateProbabilities();
    showResults(matches);
    showStep(2);
}

// Calculate condition probabilities
function calculateProbabilities() {
    const results = [];
    
    for (const [condition, data] of Object.entries(conditions)) {
        const matchedSymptoms = data.symptoms.filter(s => 
            selectedSymptoms.includes(s)
        ).length;
        
        const probability = Math.min(
            (matchedSymptoms / data.symptoms.length) * data.weight * 100,
            95
        );
        
        if (probability > 20) {
            results.push({
                condition,
                probability: probability.toFixed(1)
            });
        }
    }

    return results.sort((a, b) => b.probability - a.probability);
}

// Show results
function showResults(results) {
    const container = document.getElementById('results');
    container.innerHTML = '';
    
    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <h3>${result.condition}</h3>
            <div class="probability-meter">
                <div class="probability-fill" 
                     style="width: ${result.probability}%; background: ${getGradient(result.probability)}">
                </div>
            </div>
            <p>${result.probability}% probability</p>
        `;
        container.appendChild(div);
    });
}

// Get gradient based on probability
function getGradient(probability) {
    const percent = parseFloat(probability);
    const red = Math.round(255 * (percent / 100));
    const green = Math.round(255 * ((100 - percent) / 100));
    return `linear-gradient(90deg, rgba(255, ${green}, ${green}, 0.8) 0%, rgba(${red}, 0, 0, 0.8) 100%)`;
}

// Step navigation
function showStep(stepNumber) {
    if (stepNumber === 1) {
        selectedSymptoms = [];
        document.querySelectorAll('symptom-card').forEach(card => {card.classList.remove('selected');

        });
        document.getElementById('selectedCounter').style.display = 'none';
        document.getElementById('results').innerHTML = '';
    }
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// Show toast messages
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize
window.onload = initializeSymptoms;