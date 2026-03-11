const URL = "./";
let model, maxPredictions;

window.onload = async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("AI Model Loaded Successfully!");
    } catch (error) {
        console.error("Model missing", error);
        document.getElementById("label-container").innerHTML = 
            "<p class='placeholder-text' style='color: #EA4335;'>⚠️ Waiting for model files. Did you upload model.json and metadata.json to GitHub?</p>";
    }
};

const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const predictBtn = document.getElementById('predict-btn');

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'inline-block';
            predictBtn.style.display = 'inline-block'; 
            document.getElementById('label-container').innerHTML = 
                "<p class='placeholder-text'>Ready to scan.</p>"; 
        }
        reader.readAsDataURL(file);
    }
});

async function predict() {
    if (!model) {
        alert("Wait a sec, the AI model is still loading or missing!");
        return;
    }

    document.getElementById('label-container').innerHTML = "<p class='placeholder-text'>Scanning pixels...</p>";

    const prediction = await model.predict(imagePreview, false);
    
    let resultHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const probability = (prediction[i].probability * 100).toFixed(1);
        resultHTML += `
            <div class="result-row">
                <span>${prediction[i].className}</span>
                <span style="color: var(--g-blue); font-weight: bold;">${probability}%</span>
            </div>
        `;
    }
    
    document.getElementById('label-container').innerHTML = resultHTML;
}