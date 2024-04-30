const themes = [
    "Basketball",
    "Donuts",
    "Musik",
    "Gesundheit",
    "Haustiere",
    "Reisen",
    "Filme",
    "Kochen",
    "Fotografie",
    "Mode",
    "Weltraumforschung",
    "Geschichte",
    "Wetter",
    "Sprachen",
    "Kunst",
    "Sportwagen",
    "Roboter",
    "Umweltschutz",
    "Kryptowährungen",
    "Fitness",
    "Social Media",
    "Architektur",
    "Videospiele",
    "Tiere in der Wildnis",
    "Bildung",
    "Wissenschaftliche Entdeckungen",
    "Gartenarbeit",
    "Astronomie",
    "Haushaltsgeräte",
    "Kulturelle Festivals"
];

// Function to select a random theme
function getRandomTheme() {
    const randomIndex = Math.floor(Math.random() * themes.length);
    return themes[randomIndex];
}

module.exports = { getRandomTheme };
