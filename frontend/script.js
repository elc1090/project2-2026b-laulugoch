async function carregarPedidos() {
    const resposta = await fetch("http://127.0.0.1:5000/pedidos");

    const pedidos = await resposta.json();

    const elementoPedidos = document.getElementById("pedidos");

    for (const pedido of pedidos) {
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
        `;

        elementoPedidos.appendChild(divPedido);
    }
}

carregarPedidos();