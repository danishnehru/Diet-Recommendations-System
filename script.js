// ---------------------------------------------
// BMI CALCULATOR (FIXED)
// ---------------------------------------------
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (height > 0 && weight > 0) {
        const h = height / 100;
        const bmi = (weight / (h * h)).toFixed(2);

        let category =
            bmi < 18.5 ? "Underweight" :
            bmi < 25   ? "Normal" :
            bmi < 30   ? "Overweight" :
                         "Obese";

        document.getElementById("bmi-result").innerHTML =
            `<p>Your BMI: ${bmi} (${category})</p>`;
    } else {
        document.getElementById("bmi-result").innerHTML =
            "<p>Please enter valid height & weight.</p>";
    }
}

// ---------------------------------------------
// LOAD CSV WITH CACHE-BYPASS
// ---------------------------------------------
async function loadCSV() {
    try {
        const response = await fetch("foods.csv?cache=" + Math.random());
        const text = await response.text();

        const rows = text.trim().split("\n");
        const headers = rows[0].split(",");

        return rows.slice(1).map(row => {
            const cols = row.split(",");
            const obj = {};
            headers.forEach((h, i) => (obj[h] = cols[i]));
            return obj;
        });

    } catch (err) {
        console.log("CSV load error:", err);
        return [];
    }
}

// ---------------------------------------------
// RECOMMENDATION SYSTEM (WORKING)
// ---------------------------------------------
async function getRecommendations() {
    const age = Number(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const height = Number(document.getElementById("height2").value);
    const weight = Number(document.getElementById("weight2").value);

    if (!age || !gender || !height || !weight) {
        document.getElementById("recommendations").innerHTML =
            "<p>Please fill all fields.</p>";
        return;
    }

    const h = height / 100;
    const bmi = (weight / (h * h)).toFixed(2);

    let category = "";
    let rec = "";
    let filter = { min: 0, max: 500 };

    if (bmi < 18.5) {
        category = "Underweight";
        filter = { min: 200, max: 999 };
        rec = "Eat calorie-dense foods.";
    } 
    else if (bmi < 25) {
        category = "Normal";
        filter = { min: 80, max: 250 };
        rec = "Maintain with balanced meals.";
    } 
    else if (bmi < 30) {
        category = "Overweight";
        filter = { min: 50, max: 150 };
        rec = "Choose low-calorie foods.";
    } 
    else {
        category = "Obese";
        filter = { min: 0, max: 80 };
        rec = "Low-calorie, high-fiber diet.";
    }

    // load food list
    const foods = await loadCSV();

    // filter by calories
    let filtered = foods.filter(f => {
        const cal = Number(f.Calories);
        return cal >= filter.min && cal <= filter.max;
    });

    // shuffle for fresh random results
    filtered = filtered.sort(() => Math.random() - 0.5);

    // prepare output
    let html = `
        <p><b>BMI:</b> ${bmi} (${category})</p>
        <p><b>Recommendation:</b> ${rec}</p>
        <br><b>Foods:</b>
        <ul>
    `;

    filtered.slice(0, 10).forEach(f => {
        html += `<li>${f.Food} — ${f.Calories} kcal</li>`;
    });

    html += "</ul>";

    document.getElementById("recommendations").innerHTML = html;
}




                    
