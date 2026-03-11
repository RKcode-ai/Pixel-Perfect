// We assume the model files are in the same directory as index.html
const URL = "./";
let model, maxPredictions;

// Load the model as soon as the window loads
window.onload = async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("AI Model Loaded Successfully!");
    } catch (error) {
        console.error("Model failed to load. Did you upload the 3 Teachable Machine files?", error);
        document.getElementById("label-container").innerText = "⚠️ Error: Please upload your model.json, metadata.json, and weights.bin files to GitHub.";
    }
};

// Handle the image upload preview
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const predictBtn = document.getElementById('predict-btn');

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            predictBtn.style.display = 'inline-block'; // Show the scan button
            document.getElementById('label-container').innerHTML = ''; // Clear old results
        }
        reader.readAsDataURL(file);
    }
});

// Run the image through the AI model
async function predict() {
    if (!model) {
        alert("Model is still loading or failed to load. Check console.");
        return;
    }

    document.getElementById('label-container').innerHTML = "Scanning...";

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(imagePreview, false);
    
    let resultHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        // Format the percentage beautifully
        const probability = (prediction[i].probability * 100).toFixed(2);
        resultHTML += `
            <div class="result-row">
                <span>${prediction[i].className}</span>
                <span style="color: var(--accent-color); font-weight: bold;">${probability}%</span>
            </div>
        `;
    }
    
    document.getElementById('label-container').innerHTML = resultHTML;
}