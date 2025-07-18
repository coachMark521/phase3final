const button = document.getElementById('searchButton');
const fields = document.getElementById('searchInput');

button.addEventListener('click', () => {
    if (fields.style.display === 'none' || fields.style.display === '') {
        fields.style.display = 'block'; // Show fields
        button.textContent = 'clear'; // Change button text
    } else {
        fields.style.display = 'none'; // Hide fields
        button.textContent = 'search'; // Change button text
        clearAllFields();
    }
});

function clearAllFields() {
        document.getElementById("ID").value = '';
        document.getElementById("email").value = '';
    }