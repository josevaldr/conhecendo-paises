// Ativadores de evento
document.getElementById('buscarBtn').addEventListener('click', buscarPais);
document.getElementById('paisEntrada').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        buscarPais();
    }
});

async function buscarPais() {
    const nomePais = document.getElementById('paisEntrada').value.trim();
    const resultSection = document.getElementById('result');

    if (nomePais === '') {
        resultSection.innerHTML = '<p>Por favor, digite o nome de um país.</p>';
        return;
    }

    resultSection.innerHTML = '<p>Buscando informações...</p>';

    try {
        const apiKey = 'rc_live_cb22292f1b3448eb820c4b9b95d4791c'; 

        const opcoes = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        };

        const response = await fetch(`https://api.restcountries.com/countries/v5?q=${nomePais}`, opcoes);
        
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados.');
        }

        const data = await response.json();
        const pais = Array.isArray(data) ? data[0] : data; 

        const nome = pais.name?.common || pais.name || 'Nome Indisponível';
        const bandeira = pais.flags?.svg || pais.flags?.png || '';
        const capital = pais.capital ? pais.capital[0] : 'Não informada';
        const regiao = pais.region || 'Não informada';
        const populacao = pais.population ? pais.population.toLocaleString('pt-BR') : 'Não informada';

        resultSection.innerHTML = `
            <article class="card">
                ${bandeira ? `<img src="${bandeira}" alt="Bandeira de ${nome}">` : ''}
                <h2>${nome}</h2>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Continente:</strong> ${regiao}</p>
                <p><strong>População:</strong> ${populacao} habitantes</p>
            </article>
        `;
    } catch (error) {
        resultSection.innerHTML = `<p style="color: #d9534f; font-weight: 600;">País não encontrado.</p>`;
    }
}
