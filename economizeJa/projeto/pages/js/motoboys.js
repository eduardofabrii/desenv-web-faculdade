document.addEventListener("DOMContentLoaded", carregarMotoboys);

async function carregarMotoboys() {
    const motoboysContainer = document.getElementById('motoboysContainer');

    try {
        const response = await fetch('/api/motoboys');
        if (!response.ok) throw new Error('Erro ao buscar dados dos motoboys');

        const motoboys = await response.json();
        console.log(motoboys); // Log para conferir os dados recebidos

        if (motoboys.length === 0) {
            motoboysContainer.innerHTML = `<div class="carousel-item active">
                <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
                    <h3>Nenhum motoboy cadastrado</h3>
                </div>
            </div>`;
            return;
        }

        motoboys.forEach((motoboy, index) => {
            const isActive = index === 0 ? 'active' : '';
            const motoboyItem = document.createElement('div');
            motoboyItem.className = `carousel-item ${isActive}`;
            motoboyItem.innerHTML = `
                <div class="card mx-auto" style="width: 18rem;">
                    <div class="motoboy-photo"></div> <!-- Foto padrão -->
                    <div class="card-body text-center">
                        <h5 class="card-title">${motoboy.nome || 'Nome não disponível'}</h5>
                        <p class="card-text">Email: ${motoboy.email || 'Não informado'}</p>
                        <p class="card-text">CPF: ${motoboy.cpf || 'Não informado'}</p>
                        <p class="card-text">Telefone: ${motoboy.telefone || 'Não informado'}</p>
                        <p class="card-text">CNH: ${motoboy.cnh || 'Não informado'}</p>
                        <p class="card-text">Placa: ${motoboy.placa || 'Não informado'}</p>
                    </div>
                </div>
            `;
            motoboysContainer.appendChild(motoboyItem);
        });
    } catch (error) {
        console.error(error);
        motoboysContainer.innerHTML = `<div class="carousel-item active">
            <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
                <h3>Erro ao carregar motoboys</h3>
            </div>
        </div>`;
    }
}
