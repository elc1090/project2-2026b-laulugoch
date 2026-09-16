let pedidoSelecionadoId = null;
let pedidos = [];

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
        const divPedido = document.createElement("div");

        divPedido.classList.add("pedido");

        let itens = "";

        for (const item of pedido.itens) {
            itens += `
                <li>
                    ${item.quantidade}x ${item.item}
                    (${item.categoria})
                </li>
            `;
        }

        divPedido.innerHTML = `
            <h3>Pedido ${pedido.id}</h3>
            <p><strong>Aluno:</strong> ${pedido.aluno}</p>
            <p><strong>Endereço:</strong> ${pedido.endereco}</p>
            <p><strong>Status:</strong> ${pedido.status}</p>

            <p><strong>Itens:</strong></p>
            <ul>
                ${itens}
            </ul>

            <button class="botaoInteresse" data-pedido-id="${pedido.id}">
                Tenho interesse em ajudar
            </button>
        `;

        elementoPedidos.appendChild(divPedido);

        const botaoInteresse = divPedido.querySelector(".botaoInteresse");

        botaoInteresse.addEventListener("click", function () {
            const pedidoId = botaoInteresse.dataset.pedidoId;

            pedidoSelecionadoId = pedidoId;

            listaPedidos.style.display = "none";
            formularioDoador.style.display = "block";

            pedidoSelecionado.textContent = "Você está demonstrando interesse no pedido " + pedidoId + ".";
        });
    }
}

carregarPedidos();

const botaoAjuda = document.getElementById("botaoAjuda");
const opcoes = document.querySelector(".opcoes");
const formularioPedido = document.getElementById("formularioPedido");
const botaoDoar = document.getElementById("botaoDoar");
const listaPedidos = document.getElementById("listaPedidos");
const tituloInicial = document.getElementById("tituloInicial");
const formularioDoador = document.getElementById("formularioDoador");
const pedidoSelecionado = document.getElementById("pedidoSelecionado");
const botaoConfirmarInteresse = document.getElementById("botaoConfirmarInteresse");

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

    alert(resultadoInteresse.mensagem);
});

botaoAjuda.addEventListener("click", function () {
    opcoes.style.display = "none";
    tituloInicial.style.display = "none";
    formularioPedido.style.display = "block";
});

botaoDoar.addEventListener("click", function () {
    opcoes.style.display = "none";
    tituloInicial.style.display = "none";
    listaPedidos.style.display = "block";
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
        status: "disponível",
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