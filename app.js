const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        carrinho: [],
        produto: null,
        mensagemAlerta: "Item adicionado",
        alertaAtivo: false
    },
    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0
            if(this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco
                })
            }
            return total;
        }
    },
    methods: {
        fecthProdutos() {
            fetch("./api/produtos.json")
                .then(r => r.json())
                .then(r => {
                    this.produtos = r
                })
        },
        fecthProduto(id) {
            fetch(`./api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => {
                    this.produto = r
                })
        },
        abrirModal(id) {
            this.fecthProduto(id)
            window.scrollTo({ top: 0, behavior: "smooth", })
        },
        fecharModal(event) {
            if (event.target === event.currentTarget) {
                this.produto = false
            }
        },
        adicionarItem(){
            this.produto.estoque--
            const {id, nome, preco} = this.produto
            this.carrinho.push({id, nome, preco})
            this.alerta(`${nome} adicionado ao carrinho.`)
        },
        removerItem(index){
            this.carrinho.splice(index,1)
        },
        checarLocalStorage() {
            if(window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho)
            }
        },
        alerta(mensagem){
            this.mensagemAlerta = mensagem
            this.alertaAtivo = true
            setTimeout(()=>{
                this.alertaAtivo = false
            }, 1500)
        }
    },
    watch: {
        carrinho(){
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created() {
        this.fecthProdutos();
        this.checarLocalStorage();
    }
});