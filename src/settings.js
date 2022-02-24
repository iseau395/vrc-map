let skills = false;
const skills_switch = document.getElementById("skills-switch");
skills_switch.addEventListener("click", () => {
    skills = !skills;
    reloadCookie();
});

/**
 * Get whether the units are in cm or in
 * @returns {boolean} whether the units are cm
 */
export function isSkills() {
    return skills;
}

let imperial = false;
const unit_switch = document.getElementById("unit-switch")
unit_switch.addEventListener("click", () => {
    imperial = !imperial;
    reloadCookie();
});

/**
 * Get whether the units are in cm or in
 * @returns {boolean} whether the units are cm
 */
export function isUnitImperial() {
    return imperial;
}

function reloadCookie() {
    localStorage.setItem("settings", `skills=${skills}/imperial=${imperial}`);
}

function loadCookie() {
    const regex = /skills=((?:false)|(?:true))\/imperial=((?:false)|(?:true))/;
    const raw_save = localStorage.getItem("settings");

    if (!regex.test(raw_save)) reloadCookie();
    const cookie = regex.exec(raw_save);

    cookie[1] == "true" && skills_switch.click();
    cookie[2] == "true" && unit_switch.click();
}

if (!localStorage.getItem("settings")) reloadCookie();
loadCookie();