// const inputPesquisarEmpresas = document.getElementById('searchInputEmpresas');

// function inputPesquisarEmpresas() {
//     const filtro = inputPesquisarEmpresas.value.toUpperCase();
//     const tabela = document.getElementById('tabela-empresas');	
//     const linhas = tabela.getElementsByTagName('tr');

//     for (let i = 0; i < linhas.length; i++) {
//         const colunas = linhas[i].getElementsByTagName('td');
//         let encontrou = false;

//         for (let j = 0; j < colunas.length - 1; j++) {
//             const texto = colunas[j].innerText.toUpperCase();
//             if (texto.indexOf(filtro) > -1) {
//                 encontrou = true;
//                 break;
//             }
//         }
//         linhas[i].style.display = encontrou ? '' : 'none';
//     }
// }


// // async function carregarEmpresas() {
// //     const tabela = document.getElementById('tabela-empresas');
// //     tabela.innerHTML = '';

// //     try {
// //         const response = await fetch('/api/estabelecimentos');
// //         const empresas = await response.json();

// //         empresas.forEach(empresa => {
// //             const linha = document.createElement('tr');
// //             linha.innerHTML = `
// //                 <td>${empresa.nome}</td>
// //                 <td>${empresa.email}</td>
// //                 <td>${empresa.cnpj}</td>
// //                 <td>${empresa.endereco}</td>
// //                 <td>${empresa.cidade}</td>
// //                 <td>${empresa.telefone}</td>
// //                 <td>
// //                     <button class="btn btn-warning btn-sm" onclick="editarEmpresa(this, '${empresa.cnpj}')">Editar</button>
// //                     <button class="btn btn-danger btn-sm" onclick="excluirEmpresa('${empresa.cnpj}')">Excluir</button>
// //                 </td>
// //             `;
// //             tabela.appendChild(linha);
// //         });
// //     } catch (error) {
// //         console.error('Erro ao carregar empresas:', error);
// //     }
// // }

// // Função para editar uma empresa
// function editarEmpresa(botao, cnpj) {
//     const linha = botao.parentNode.parentNode;
//     const colunas = linha.querySelectorAll('td');

//     // Permite edição in-line para os campos, exceto o CNPJ
//     colunas.forEach((coluna, index) => {
//         if (index < colunas.length - 1) { // Não permite edição da última coluna (Ações)
//             const conteudoAtual = coluna.innerText;
//             if (index === 2) { // CNPJ (índice 2) não pode ser editado
//                 coluna.innerHTML = `<span>${conteudoAtual}</span>`;
//             } else {
//                 coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
//             }
//         }
//     });

//     botao.innerText = 'Salvar';
//     botao.onclick = function () {
//         salvarEdicaoEmpresa(linha, cnpj);
//     };
// }

// async function salvarEdicaoEmpresa(linha, cnpj) {
//     const inputs = linha.querySelectorAll('input');
//     const empresaEditada = {
//         nome: inputs[0].value,
//         email: inputs[1].value,
//         cnpj: cnpj, // O CNPJ deve ser mantido, não deve ser alterado
//         endereco: inputs[2].value,
//         cidade: inputs[3].value,
//         telefone: inputs[4].value
//     };

//     if (!empresaEditada.nome || !empresaEditada.email || !empresaEditada.endereco || !empresaEditada.cidade || !empresaEditada.telefone) {
//         alert('Por favor, preencha todos os campos!');
//         return;
//     }

//     try {
//         const response = await fetch(`/api/estabelecimentos/${cnpj}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(empresaEditada)
//         });

//         if (!response.ok) {
//             const errorResponse = await response.json();
//             throw new Error('Falha ao atualizar empresa: ' + JSON.stringify(errorResponse));
//         }

//         await carregarEmpresas();
//         linha.querySelector('button').innerText = 'Editar';
//     } catch (error) {
//         console.error('Erro ao salvar edição:', error);
//     }
// }

// // Função para excluir uma empresa
// async function excluirEmpresa(cnpj) {
//     try {
//         await fetch(`/api/estabelecimentos/${cnpj}`, { method: 'DELETE' });
//         carregarEmpresas();
//     } catch (error) {
//         console.error('Erro ao excluir empresa:', error);
//     }
// }

// // Função para atualizar os dados das empresas no localStorage
// function atualizarEmpresas() {
//     const tabela = document.getElementById('tabela-empresas');
//     const linhas = tabela.getElementsByTagName('tr');
//     let empresas = [];

//     Array.from(linhas).forEach(linha => {
//         const cells = linha.getElementsByTagName('td');
//         if (cells.length > 0) {
//             const empresa = {
//                 nome: cells[0].innerText,
//                 email: cells[1].innerText,
//                 cnpj: cells[2].innerText,
//                 endereco: cells[3].innerText,
//                 cidade: cells[4].innerText,
//                 telefone: cells[5].innerText
//             };
//             empresas.push(empresa);
//         }
//     });

//     fetch('/api/estabelecimentos', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(empresas)
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Erro ao salvar os dados no banco de dados.');
//         }
//         console.log('Dados salvos com sucesso!');
//     })
//     .catch(error => {
//         console.error('Erro:', error);
//     });
// }


// window.onload = carregarEmpresas;
