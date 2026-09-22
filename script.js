const universities = [
    {
        name: "University of Technology and Entrepreneurship",
        location: "Phnom Penh, Cambodia",
        programs: ["Digital Marketing", "Entrepreneurship", "Business Administration"],
        tuition: "$1,200 - $2,000 per year",
        admissionRequirements: ["High school diploma", "Academic transcripts", "English proficiency interview"],
        website: "https://example.com/university-of-technology-and-entrepreneurship",
        description: "A sample institution focused on practical business, entrepreneurship, and digital skills."
    },
    {
        name: "Royal University of Phnom Penh",
        location: "Phnom Penh, Cambodia",
        programs: ["Computer Science", "Information Technology", "Engineering"],
        tuition: "$800 - $1,500 per year",
        admissionRequirements: ["High school diploma", "Entrance examination", "Academic transcripts"],
        website: "https://example.com/royal-university-of-phnom-penh",
        description: "A sample public university offering technology and engineering pathways for future-focused students."
    },
    {
        name: "National University of Management",
        location: "Phnom Penh, Cambodia",
        programs: ["Marketing", "Finance", "International Business"],
        tuition: "$1,000 - $1,800 per year",
        admissionRequirements: ["High school diploma", "Academic transcripts", "English placement test"],
        website: "https://example.com/national-university-of-management",
        description: "A sample management-focused institution with programs in business, finance, and international commerce."
    }
];
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchStatus = document.querySelector('#search-status');
const searchResults = document.querySelector('#search-results');
const detailsPanel = document.querySelector('#university-details');
const backToResults = document.querySelector('#back-to-results');
const detailsTitle = document.querySelector('#details-title');
const detailsLocation = document.querySelector('#details-location');
const detailsTuition = document.querySelector('#details-tuition');
const detailsPrograms = document.querySelector('#details-programs');
const detailsAdmission = document.querySelector('#details-admission');
const fieldFilter = document.querySelector('#field-filter');
const locationFilter = document.querySelector('#location-filter');
const comparisonPanel = document.querySelector('#comparison-panel');
const comparisonGrid = document.querySelector('#comparison-grid');
const fieldCards = document.querySelectorAll('.field-card');
const comparedUniversities = [];

function addFilterOptions(select, values) {
    values.sort().forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.append(option);
    });
}

addFilterOptions(fieldFilter, [...new Set(universities.flatMap((university) => university.programs))]);
addFilterOptions(locationFilter, [...new Set(universities.map((university) => university.location))]);

function getFilteredUniversities() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedField = fieldFilter.value;
    const selectedLocation = locationFilter.value;

    return universities.filter((university) => {
        const matchesQuery = !query || `${university.name} ${university.programs.join(' ')}`.toLowerCase().includes(query);
        const matchesField = !selectedField || university.programs.includes(selectedField);
        const matchesLocation = !selectedLocation || university.location === selectedLocation;
        return matchesQuery && matchesField && matchesLocation;
    });
}

function updateSearchResults() {
    const query = searchInput.value.trim();
    const matches = getFilteredUniversities();

    searchStatus.textContent = matches.length
        ? `${matches.length} ${matches.length === 1 ? 'study path' : 'study paths'} found.`
        : 'No study paths match your search and filters.';
    renderResults(matches);
}

function showDetails(university) {
    detailsTitle.textContent = university.name;
    detailsLocation.textContent = university.location;
    detailsTuition.textContent = university.tuition;
    detailsPrograms.textContent = university.programs.join(', ');
    detailsAdmission.textContent = university.admissionRequirements.join(', ');
    searchResults.hidden = true;
    detailsPanel.hidden = false;
    searchStatus.textContent = `Viewing details for ${university.name}.`;
    detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showResults() {
    detailsPanel.hidden = true;
    searchResults.hidden = false;
    searchStatus.textContent = 'Choose a university to view its details.';
    searchResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderComparison() {
    comparisonGrid.replaceChildren();
    comparisonPanel.hidden = comparedUniversities.length === 0;

    comparedUniversities.forEach((university) => {
        const column = document.createElement('article');
        column.className = 'comparison-column';

        const name = document.createElement('h3');
        name.textContent = university.name;

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-comparison';
        removeButton.type = 'button';
        removeButton.textContent = 'Remove from comparison';
        removeButton.dataset.university = university.name;

        const data = document.createElement('dl');
        const comparisonFields = [
            ['Location', university.location],
            ['Programs', university.programs.join(', ')],
            ['Tuition', university.tuition],
            ['Admission requirements', university.admissionRequirements.join(', ')],
            ['Website', university.website],
            ['Description', university.description]
        ];

        comparisonFields.forEach(([label, value]) => {
            const term = document.createElement('dt');
            term.textContent = label;
            const description = document.createElement('dd');
            if (label === 'Website') {
                const link = document.createElement('a');
                link.href = value;
                link.textContent = value;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                description.append(link);
            } else {
                description.textContent = value;
            }
            data.append(term, description);
        });

        column.append(name, removeButton, data);
        comparisonGrid.append(column);
    });
}

function toggleComparison(university) {
    const selectedIndex = comparedUniversities.findIndex((item) => item.name === university.name);

    if (selectedIndex >= 0) {
        comparedUniversities.splice(selectedIndex, 1);
        searchStatus.textContent = `${university.name} removed from comparison.`;
    } else if (comparedUniversities.length >= 3) {
        searchStatus.textContent = 'You can compare up to 3 universities.';
        return;
    } else {
        comparedUniversities.push(university);
        searchStatus.textContent = `${university.name} added to comparison.`;
    }

    renderComparison();
    renderResults(getFilteredUniversities());
    if (comparedUniversities.length) {
        comparisonPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function renderResults(matches) {
    searchResults.replaceChildren();
    detailsPanel.hidden = true;
    searchResults.hidden = false;

    matches.forEach((university) => {
        const card = document.createElement('article');
        card.className = 'result-card';

        const details = document.createElement('div');
        const name = document.createElement('h3');
        name.textContent = university.name;
        const program = document.createElement('p');
        program.textContent = university.programs[0];
        details.append(name, program);

        const actions = document.createElement('div');
        actions.className = 'result-actions';

        const detailsButton = document.createElement('button');
        detailsButton.type = 'button';
        detailsButton.className = 'view-details';
        detailsButton.textContent = 'View details';
        detailsButton.dataset.university = university.name;

        const compareButton = document.createElement('button');
        compareButton.type = 'button';
        compareButton.className = 'compare-button';
        compareButton.classList.toggle('selected', comparedUniversities.some((item) => item.name === university.name));
        compareButton.textContent = comparedUniversities.some((item) => item.name === university.name) ? 'Compared' : 'Compare';
        compareButton.dataset.university = university.name;

        actions.append(detailsButton, compareButton);
        card.append(details, actions);
        searchResults.append(card);
    });
}

searchForm.addEventListener('submit', (event) => {
	event.preventDefault();
	updateSearchResults();
	searchInput.focus();
});

searchResults.addEventListener('click', (event) => {
    const compareButton = event.target.closest('.compare-button');
    if (compareButton) {
        const university = universities.find((item) => item.name === compareButton.dataset.university);
        if (university) toggleComparison(university);
        return;
    }

    const detailsButton = event.target.closest('.view-details');
    if (!detailsButton) return;
    const university = universities.find((item) => item.name === detailsButton.dataset.university);
    if (university) showDetails(university);
});

comparisonGrid.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-comparison');
    if (!removeButton) return;
    const university = universities.find((item) => item.name === removeButton.dataset.university);
    if (university) toggleComparison(university);
});

backToResults.addEventListener('click', showResults);

fieldCards.forEach((card) => {
	card.addEventListener('click', () => {
		fieldCards.forEach((item) => item.classList.remove('active'));
		card.classList.add('active');
        detailsPanel.hidden = true;
        searchResults.hidden = false;
		searchInput.value = card.dataset.field;
		searchStatus.textContent = `Ready to explore ${card.dataset.field}.`;
		document.querySelector('#search-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
	});
});
