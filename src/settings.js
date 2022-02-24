let metric = true;
document.getElementById("unit-switch").addEventListener("click", () => {
    metric = !metric;
});

/**
 * Get whether the units are in cm or in
 * @returns {boolean} whether the units are cm
 */
export function isUnitMetric() {
    return metric;
}

let skills = false;
document.getElementById("skills-switch").addEventListener("click", () => {
    skills = !skills;
});

/**
 * Get whether the units are in cm or in
 * @returns {boolean} whether the units are cm
 */
export function isSkills() {
    return skills;
}