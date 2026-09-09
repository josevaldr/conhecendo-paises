// Ativadores de evento
document.getElementById('buscarBtn').addEventListener('click', buscarPais);
document.getElementById('paisEntrada').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        buscarPais();
    }
});

const btnVoz = document.getElementById('btnVoz');
const paisEntrada = document.getElementById('paisEntrada');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    recognition.onstart = () => {
        btnVoz.classList.add('gravando');
    };

    recognition.onresult = (event) => {
        const termo = event.results[0][0].transcript.replace(/\.$/, '').trim();
        paisEntrada.value = termo;
        buscarPais();
    };

    recognition.onend = () => {
        btnVoz.classList.remove('gravando');
    };

    recognition.onerror = (event) => {
        console.error("Erro no reconhecimento de voz:", event.error);
        btnVoz.classList.remove('gravando');
    };

    btnVoz.addEventListener('click', () => {
        recognition.start();
    });
} else {
    btnVoz.style.display = 'none';
}

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

        const response = await fetch(`https://api.restcountries.com/countries/v5?q=${nomePais}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados.');
        }

        const data = await response.json();
        console.log("Dados brutos:", data);

        const pais = data.data.objects[0];

        if (!pais) {
            throw new Error('País não encontrado.');
        }

        const nome = pais.names?.native?.por?.common || pais.names?.common || pais.name?.common || 'Nome Indisponível';
        const bandeiraUrl = pais.flag?.url_svg || pais.flag?.url_png || '';
        const capital = pais.capitals?.[0]?.name || 'Não informada';
        const regiao = pais.region || (pais.continents ? pais.continents[0] : 'Não informada');
        const populacao = pais.population ? Number(pais.population).toLocaleString('pt-BR') : 'Não informada';

        resultSection.innerHTML = `
            <article class="card">
                ${bandeiraUrl ? `<img src="${bandeiraUrl}" alt="Bandeira de ${nome}" style="width: 150px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">` : ''}
                <h2>${nome}</h2>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Continente:</strong> ${regiao}</p>
                <p><strong>População:</strong> ${populacao} habitantes</p>
            </article>
        `;
    } catch (error) {
        console.error("Erro:", error);
        resultSection.innerHTML = `<p style="color: #d9534f; font-weight: 600;">País não encontrado ou indisponível no momento.</p>`;
    }
}