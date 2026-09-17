let pedidoSelecionadoId = null;
let pedidos = [];
let modoGerenciamento = false;
let telaAtual = "inicio";

async function carregarPedidos() {
    const resposta = await fetch("http://127.0.0.1:5000/pedidos");

    pedidos = await resposta.json();

    mostrarPedidos(pedidos);
}

function mostrarPedidos(lista) {
    const elementoPedidos = document.getElementById("pedidos");

    elementoPedidos.innerHTML = "";

    if (lista.length === 0) {
        elementoPedidos.innerHTML = "<p>Nenhum pedido encontrado para esta categoria.</p>";
        return;
    }

    for (const pedido of lista) {

        if (!modoGerenciamento && pedido.status === "atendido") {
            continue;
        }

        const divPedido = document.createElement("div");

        divPedido.classList.add("pedido");

        if (!modoGerenciamento) {
            divPedido.classList.add("pedidoAjuda");
        }

        let itens = "";

        for (const item of pedido.itens) {
            itens += `
                <li>
                    ${item.quantidade}x ${item.item}
                    <span class="categoria">${item.categoria}</span>
                </li>
            `;
        }

        let etiquetaStatus = "";

        if (pedido.status === "disponivel") {
            etiquetaStatus = `<span class="status disponivel">Disponível</span>`;
        } else if (pedido.status === "em andamento") {
            etiquetaStatus = `<span class="status andamento">Em andamento</span>`;
        } else if (pedido.status === "atendido") {
            etiquetaStatus = `<span class="status atendido">Atendido</span>`;
        }

        let botaoAtendido = "";

        let botoesGerenciamento = "";

        if (modoGerenciamento) {
            if (pedido.status === "em andamento") {
                botaoAtendido = `
                    <button class="botaoAtendido" data-pedido-id="${pedido.id}">
                        Marcar como atendido
                    </button>
                `;
            }

            botoesGerenciamento = `
                <button class="botaoEditar" data-pedido-id="${pedido.id}">
                    Editar
                </button>

                <button class="botaoExcluir" data-pedido-id="${pedido.id}">
                    Excluir
                </button>
            `;
        }

        let botaoInteresse = "";

        if (!modoGerenciamento && pedido.status === "disponivel") {
            botaoInteresse = `
                <button class="botaoInteresse" data-pedido-id="${pedido.id}">
                    Tenho interesse em ajudar
                </button>
            `;
        }

        divPedido.innerHTML = `
            ${etiquetaStatus}

            <div class="botoesGerenciamento">
                ${botaoAtendido}
                ${botoesGerenciamento}
            </div>

            <h3>Pedido ${pedido.id}</h3>
            <p><strong>Aluno:</strong> ${pedido.aluno}</p>
            <p><strong>Endereço:</strong> ${pedido.endereco}</p>

            <p><strong>Itens:</strong></p>
            <ul>
                ${itens}
            </ul>

            ${botaoInteresse}
        `;

        elementoPedidos.appendChild(divPedido);

        const botaoInteresseElemento = divPedido.querySelector(".botaoInteresse");

        if (botaoInteresseElemento) {
            botaoInteresseElemento.addEventListener("click", function () {
                const pedidoId = botaoInteresseElemento.dataset.pedidoId;

                pedidoSelecionadoId = pedidoId;

                listaPedidos.style.display = "none";
                formularioDoador.style.display = "block";

                pedidoSelecionado.textContent = "Você está demonstrando interesse no pedido " + pedidoId + ".";
            });
        }

        const botaoMarcarAtendido = divPedido.querySelector(".botaoAtendido");

        if (botaoMarcarAtendido) {
            botaoMarcarAtendido.addEventListener("click", async function () {
                const pedidoId = botaoMarcarAtendido.dataset.pedidoId;

                const resposta = await fetch(
                    "http://127.0.0.1:5000/pedidos/" + pedidoId + "/atendido",
                    {
                        method: "PUT"
                    }
                );

                const resultado = await resposta.json();

                alert(resultado.mensagem);

                carregarPedidos();
            });
        }

        const botaoEditar = divPedido.querySelector(".botaoEditar");

        if (botaoEditar) {
            botaoEditar.addEventListener("click", async function () {
                const pedidoId = botaoEditar.dataset.pedidoId;

                pedidoSelecionadoId = pedidoId;

                const resposta = await fetch(
                    "http://127.0.0.1:5000/pedidos/" + pedidoId
                );

                const pedido = await resposta.json();

                telaAtual = "edicao";

                listaPedidos.style.display = "none";
                formularioEdicao.style.display = "block";
                botaoVoltar.style.display = "block";

                document.getElementById("nomeEdicao").value = pedido.aluno;
                document.getElementById("enderecoEdicao").value = pedido.endereco;
                document.getElementById("statusEdicao").value = pedido.status;

                const itensEdicao = document.getElementById("itensEdicao");

                itensEdicao.innerHTML = "";

                for (let i = 0; i < pedido.itens.length; i++) {
                    const item = pedido.itens[i];

                    const novoItem = document.createElement("div");

                    novoItem.classList.add("itemPedido");

                    novoItem.innerHTML = `
                        <h4>Item ${i + 1}</h4>

                        <label>Item:</label>
                        <input type="text" class="nomeItemEdicao" value="${item.item}">

                        <label>Categoria:</label>
                        <select class="categoriaItemEdicao">
                            <option value="Material escolar">Material escolar</option>
                            <option value="Uniforme">Uniforme</option>
                            <option value="Mochila">Mochila</option>
                            <option value="Outros">Outros</option>
                        </select>

                        <label>Quantidade:</label>
                        <input type="number" class="quantidadeItemEdicao" min="1" value="${item.quantidade}">
                    `;

                    novoItem.querySelector(".categoriaItemEdicao").value = item.categoria;

                    itensEdicao.appendChild(novoItem);
                }
            });
        }

        const botaoExcluir = divPedido.querySelector(".botaoExcluir");

        if (botaoExcluir) {
            botaoExcluir.addEventListener("click", async function () {
                const pedidoId = botaoExcluir.dataset.pedidoId;

                const confirmar = confirm("Tem certeza que deseja excluir este pedido?");

                if (!confirmar) {
                    return;
                }

                const resposta = await fetch(
                    "http://127.0.0.1:5000/pedidos/" + pedidoId,
                    {
                        method: "DELETE"
                    }
                );

                const resultado = await resposta.json();

                alert(resultado.mensagem);

                carregarPedidos();
            });
        }
    }
}

carregarPedidos();

const botaoAjuda = document.getElementById("botaoAjuda");
const opcoes = document.querySelector(".opcoes");
const formularioPedido = document.getElementById("formularioPedido");
const formularioEdicao = document.getElementById("formularioEdicao");
const botaoVoltar = document.getElementById("botaoVoltarEdicao");
const botaoDoar = document.getElementById("botaoDoar");
const listaPedidos = document.getElementById("listaPedidos");
const tituloInicial = document.getElementById("tituloInicial");
const formularioDoador = document.getElementById("formularioDoador");
const boasVindas = document.getElementById("boasVindas");
const pedidoSelecionado = document.getElementById("pedidoSelecionado");
const botaoConfirmarInteresse = document.getElementById("botaoConfirmarInteresse");
const opcoesAjuda = document.getElementById("opcoesAjuda");
const botaoCadastrarPedido = document.getElementById("botaoCadastrarPedido");
const botaoGerenciarPedidos = document.getElementById("botaoGerenciarPedidos");

botaoConfirmarInteresse.addEventListener("click", async function () {
    const nome = document.getElementById("nomeDoador").value;
    const email = document.getElementById("emailDoador").value;

    const respostaDoador = await fetch("http://127.0.0.1:5000/doadores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            email: email
        })
    });

    const resultadoDoador = await respostaDoador.json();

    const respostaInteresse = await fetch("http://127.0.0.1:5000/interesses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            doador_id: resultadoDoador.doador_id,
            pedido_id: Number(pedidoSelecionadoId)
        })
    });

    const resultadoInteresse = await respostaInteresse.json();

    if (resultadoInteresse.mensagem) {
        alert(resultadoInteresse.mensagem);
    } else {
        alert(resultadoInteresse.erro);
    }

    await carregarPedidos();

    formularioDoador.style.display = "none";
    listaPedidos.style.display = "block";

    document.getElementById("nomeDoador").value = "";
    document.getElementById("emailDoador").value = "";
});

botaoAjuda.addEventListener("click", function () {
    telaAtual = "ajuda";

    opcoes.style.display = "none";
    tituloInicial.style.display = "none";
    opcoesAjuda.style.display = "flex";
    botaoVoltar.style.display = "block";
    boasVindas.style.display = "none";
});

botaoCadastrarPedido.addEventListener("click", function () {
    telaAtual = "cadastro";

    opcoesAjuda.style.display = "none";
    formularioPedido.style.display = "block";
});

botaoGerenciarPedidos.addEventListener("click", function () {
    telaAtual = "gerenciamento";

    modoGerenciamento = true;

    opcoesAjuda.style.display = "none";
    listaPedidos.style.display = "block";

    mostrarPedidos(pedidos);
});

botaoDoar.addEventListener("click", function () {
    telaAtual = "doar";

    modoGerenciamento = false;

    opcoes.style.display = "none";
    tituloInicial.style.display = "none";
    listaPedidos.style.display = "block";
    botaoVoltar.style.display = "block";
    boasVindas.style.display = "none";

    mostrarPedidos(pedidos);
});

const filtroCategoria = document.getElementById("filtroCategoria");

filtroCategoria.addEventListener("change", function () {
    const categoriaSelecionada = filtroCategoria.value;

    if (categoriaSelecionada === "todas") {
        mostrarPedidos(pedidos);
        return;
    }

    const pedidosFiltrados = pedidos.filter(function (pedido) {
        for (const item of pedido.itens) {
            if (item.categoria === categoriaSelecionada) {
                return true;
            }
        }

        return false;
    });

    mostrarPedidos(pedidosFiltrados);
});

const botaoAdicionarItem = document.getElementById("botaoAdicionarItem");
const itensPedido = document.getElementById("itensPedido");

botaoAdicionarItem.addEventListener("click", function () {
    const novoItem = document.createElement("div");

    novoItem.classList.add("itemPedido");

    const numeroItem = itensPedido.children.length + 1;

    novoItem.innerHTML = `
        <h4>Item ${numeroItem}</h4>

        <label>Item:</label>
        <input type="text" class="nomeItem">

        <label>Categoria:</label>
        <select class="categoriaItem">
            <option value="Material escolar">Material escolar</option>
            <option value="Uniforme">Uniforme</option>
            <option value="Mochila">Mochila</option>
            <option value="Outros">Outros</option>
        </select>

        <label>Quantidade:</label>
        <input type="number" class="quantidadeItem" min="1">
    `;

    itensPedido.appendChild(novoItem);
});

const botaoEnviar = document.getElementById("botaoEnviar");

botaoEnviar.addEventListener("click", async function () {
    const nome = document.getElementById("nome").value;
    const endereco = document.getElementById("endereco").value;

    const blocosItens = document.querySelectorAll(".itemPedido");

    const itens = [];

    for (const bloco of blocosItens) {
        const item = bloco.querySelector(".nomeItem").value;
        const categoria = bloco.querySelector(".categoriaItem").value;
        const quantidade = bloco.querySelector(".quantidadeItem").value;

        itens.push({
            item: item,
            categoria: categoria,
            quantidade: Number(quantidade)
        });
    }

    const dados = {
        aluno: {
            nome: nome,
            endereco: endereco
        },
        status: "disponivel",
        itens: itens
    };

    const resposta = await fetch("http://127.0.0.1:5000/pedidos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    alert(resultado.mensagem);

    await carregarPedidos();

    formularioPedido.style.display = "none";
    tituloInicial.style.display = "block";
    opcoes.style.display = "flex";

    document.getElementById("nome").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("itensPedido").innerHTML = `
        <div class="itemPedido">

            <h4>Item 1</h4>

            <label>Item:</label>
            <input type="text" class="nomeItem">

            <label>Categoria:</label>
            <select class="categoriaItem">
                <option value="Material escolar">Material escolar</option>
                <option value="Uniforme">Uniforme</option>
                <option value="Mochila">Mochila</option>
                <option value="Outros">Outros</option>
            </select>

            <label>Quantidade:</label>
            <input type="number" class="quantidadeItem" min="1">

        </div>
    `;
});

const botaoSalvarEdicao = document.getElementById("botaoSalvarEdicao");

botaoVoltar.addEventListener("click", function () {

    if (telaAtual === "ajuda") {
        opcoesAjuda.style.display = "none";
        opcoes.style.display = "flex";
        tituloInicial.style.display = "block";
        botaoVoltar.style.display = "none";
        telaAtual = "inicio";
        boasVindas.style.display = "block";
    }

    else if (telaAtual === "cadastro") {
        formularioPedido.style.display = "none";
        opcoesAjuda.style.display = "flex";
        telaAtual = "ajuda";
    }

    else if (telaAtual === "gerenciamento") {
        listaPedidos.style.display = "none";
        opcoesAjuda.style.display = "flex";
        botaoVoltar.style.display = "block";
        telaAtual = "ajuda";
    }

    else if (telaAtual === "edicao") {
        formularioEdicao.style.display = "none";
        listaPedidos.style.display = "block";
        telaAtual = "gerenciamento";
        mostrarPedidos(pedidos);
    }

    else if (telaAtual === "doar") {
        listaPedidos.style.display = "none";
        opcoes.style.display = "flex";
        tituloInicial.style.display = "block";
        botaoVoltar.style.display = "none";
        telaAtual = "inicio";
        boasVindas.style.display = "block";
    }
});

const botaoAdicionarItemEdicao = document.getElementById("botaoAdicionarItemEdicao");
const itensEdicao = document.getElementById("itensEdicao");

botaoAdicionarItemEdicao.addEventListener("click", function () {
    const novoItem = document.createElement("div");

    novoItem.classList.add("itemPedido");

    const numeroItem = itensEdicao.children.length + 1;

    novoItem.innerHTML = `
        <h4>Item ${numeroItem}</h4>

        <label>Item:</label>
        <input type="text" class="nomeItemEdicao">

        <label>Categoria:</label>
        <select class="categoriaItemEdicao">
            <option value="Material escolar">Material escolar</option>
            <option value="Uniforme">Uniforme</option>
            <option value="Mochila">Mochila</option>
            <option value="Outros">Outros</option>
        </select>

        <label>Quantidade:</label>
        <input type="number" class="quantidadeItemEdicao" min="1">
    `;

    itensEdicao.appendChild(novoItem);
});

botaoSalvarEdicao.addEventListener("click", async function () {
    const nome = document.getElementById("nomeEdicao").value;
    const endereco = document.getElementById("enderecoEdicao").value;
    const status = document.getElementById("statusEdicao").value;

    const blocosItens = document.querySelectorAll("#itensEdicao .itemPedido");

    const itens = [];

    for (const bloco of blocosItens) {
        const item = bloco.querySelector(".nomeItemEdicao").value;
        const categoria = bloco.querySelector(".categoriaItemEdicao").value;
        const quantidade = bloco.querySelector(".quantidadeItemEdicao").value;

        itens.push({
            item: item,
            categoria: categoria,
            quantidade: Number(quantidade)
        });
    }

    const dados = {
        aluno: {
            nome: nome,
            endereco: endereco
        },
        status: status,
        itens: itens
    };

    const resposta = await fetch(
        "http://127.0.0.1:5000/pedidos/" + pedidoSelecionadoId,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }
    );

    const resultado = await resposta.json();

    alert(resultado.mensagem);

    await carregarPedidos();

    formularioEdicao.style.display = "none";
    listaPedidos.style.display = "block";
});