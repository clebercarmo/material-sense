import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Back from "./common/Back";
import Select from "react-select";
import api from "../services/api";
import Spinner from "../loading";
import swal from "sweetalert";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Slide from "@material-ui/core/Slide";
import TextMaskPercent from "./mask/maskporcentagem";
import TextMaskQuantidade from "./mask/maskquantidade";
import Divider from "@material-ui/core/Divider";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import DateFnsUtils from "@date-io/date-fns";
import ptLocale from "date-fns/locale/pt-BR";
import "date-fns";
import { format } from "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
const backgroundShape = require("../images/shape.svg");

const numeral = require("numeral");
numeral.defaultFormat("0,000");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
  },
  grid: {
    width: 1800,
    margin: `0 ${theme.spacing(2)}px`,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 10px)"
    }
  },
  gridtotais: {
    width: 1200,
    margin: `0 ${theme.spacing(2)}px`,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  smallContainer: {
    width: "60%"
  },
  bigContainer: {
    width: "80%"
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  stepGrid: {
    width: "80%"
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1)
  },
  buttonBar: {
    display: "flex"
  },
  actionButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1),
    width: 152,
    height: 36
  },
  stepper: {
    backgroundColor: "transparent"
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42
  },
  select: {
    width: "50%"
    //fontSize: 18
  },

  formControl: {
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  borderColumn: {
    borderBottom: `1px solid ${theme.palette.grey["100"]}`,
    paddingBottom: 24,
    marginBottom: 24
  },
  flexBar: {
    marginTop: 32,
    display: "flex",
    justifyContent: "center"
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  totais: {
    display: "inline-block",
    marginRight: 10
  }
});

function getModalStyle() {
  const top = 25;

  return {
    top: `${top}%`,
    margin: "auto"
    // left: `${left}%`,
    // transform: `translate(-${top}%, -${left}%)`,
  };
}

class Pedido extends Component {
  focusQuantidadeInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textQuantidadeInput.current.focus();
  }

  constructor(props) {
    super(props);

    this.textQuantidadeInput = React.createRef();
    this.focusQuantidadeInput = this.focusQuantidadeInput.bind(this);

    this.state = {
      pedidomongo: [],
      produto_clicado: null,
      data_entrega_formatado: "",
      data_entrega: null,
      data_atendimento_formatado: "",
      data_atendimento: null,
      cod_cliente: "",
      peso_total: 0,
      valor_bruto_total: null,
      total_volumes: 0,
      peso_produto: 0,
      forma_pagamento_default: null,
      tab_preco: "",
      cod_tp_pedido: "",
      cod_pagamento: "",
      cod_frete: "",
      pedidosvenda: null,
      produtos: [],
      clientes: [],
      tipo_pedido: [
        {
          value: "V",
          label: "Venda"
        },
        {
          value: "B",
          label: "Bonificação"
        },
        {
          value: "C",
          label: "Consumo"
        },
        {
          value: "I",
          label: "Industrialização"
        }
      ],
      tipo_pedido_escolhido: "",
      pagamento: [],
      frete: [
        {
          value: "CIF",
          label: "Ingleza entrega - (CIF)"
        },
        {
          value: "FOB",
          label: "Cliente retira - (FOB)"
        }
      ],
      tabelaprecocliente: "",
      observacaopedido: "",
      ordemcompra: "",
      descontocanal: null,
      loading: false,
      isBonificacao: false,
      isescolheucliente: false,
      mensagem: "",
      precotabela: null,
      produto: null,
      produtoscarrinho: [],
      produtoslocalstorge: null,
      descontoitem: "0",
      descontocampanha: "0",
      quantidadeitem: null,
      open: false,
      checked: false,
      temproduto: false,
      mensagemloader: "",
      tipopedidodescricao: "",
      escolheutipopedido: false,
      appaberto: false,
      pedidoemandamento: false,
      dadosusuariologado: null,
      pedidoclientefinalizado: null,
      forma_pagamento_escolhida: null,
      pedidoorigeminformado: "",
      pedidos: []
    };

    this.handleCliente = this.handleCliente.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    let dadosusuario = await this.lerValores("USUARIO");
    this.setState({
      dadosusuariologado: JSON.parse(dadosusuario)
    });
    const query = {
      usuario: JSON.parse(dadosusuario).nomerepresentante
    };
    const pedidomongo = await this.consultapedidoandamento(query);

    this.setState({
      loading: false,
      pedidomongo: pedidomongo.data.pedido
    });
    let itenssalvos = await this.lerValores("itenspedido");
    if (itenssalvos !== null) {
      this.setState({
        pedidoemandamento: true
      });
    } else {
      this.setState({
        pedidoemandamento: false
      });
    }

    this.state.data_entrega = new Date();
    this.state.data_atendimento = new Date();
    this.ultimospedidos();
  }

  ultimospedidos = async () => {
    this.setState({
      loading: true
    });

    const response = await api.post(
      "https://inglezaonline.com.br/microservices/pedido",
      { cod_representante: this.state.dadosusuariologado.codrepresentante },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    //console.log(response.data.ttRetorno);

    let pedidosvenda = response.data.ttRetorno.filter(pedido => {
      return pedido.tp_pedido === "V";
    });

    this.setState({
      loading: false,
      pedidosvenda: pedidosvenda
    });
  };

  cargaitens = async cliente => {
    this.setState({
      mensagemloader: "Carregamento Itens da Tabela de Preço"
    });

    const response = await api.post(
      "https://inglezaonline.com.br/microservices/itemvenda",
      {
        tabpreco: cliente
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    this.setState({
      produtos: response.data.ttRetorno
    });
  };

  cargaformapagamento = async cliente => {
    this.setState({
      mensagemloader: "Carregando forma de pagamento do cliente"
    });

    const response = await api.post(
      "https://inglezaonline.com.br/microservices/formapagamento",
      {
        cod_representante: cliente
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    this.setState({
      pagamento: response.data.ttRetorno
    });
  };

  valorvendaitem = async (
    codcliente,
    tabpreco,
    formapagamento,
    coditem,
    descontoitem,
    descontocampanha,
    quantidade
  ) => {
    this.setState({
      mensagemloader: "Inserindo item no pedido...",
      loading: true
    });

    try {
      const response = await api.post(
        "https://inglezaonline.com.br/microservices/detalheitem",
        {
          codcliente: codcliente,
          tabpreco: tabpreco,
          formapagamento: formapagamento,
          coditem: coditem,
          descontoitem: descontoitem,
          descontocampanha: descontocampanha,
          quantidade: quantidade
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      this.setState({
        loading: false
      });

      return response.data.ttrelatorio;
    } catch (err) {
      this.setState({
        loading: false
      });

      swal({
        title: "Não foi possivel processar a informação!",
        text: err,
        icon: "danger",
        closeOnClickOutside: false,
        closeOnEsc: false
        //timer: 4000,
        //button: false
      });
    }
  };

  cargaclientes = async () => {
    this.setState({
      mensagemloader: "Carregamento Clientes",
      loading: true
    });

    const response = await api.post(
      "https://inglezaonline.com.br/microservices/meusclientes",
      {
        cod_representante: this.state.dadosusuariologado.codrepresentante
      },
      {}
    );

    this.setState({
      clientes: response.data.ttRetorno,
      loading: false
    });
    //this.handleClose();
  };

  handleCreate = e => {
    e.preventDefault();
  };

  handleSubmit(event) {
    event.preventDefault();
  }

  /*
    handleCliente(event){

        this.setState({
            cod_cliente: event.value
        });
    }
    */

  handleCliente = async e => {
    try {
      this.setState({
        loading: true
      });
      await this.cargaformapagamento(e.value);
      await this.cargaitens(e.tabeladepreco);
      
      this.setState({
        loading: false,
        cod_cliente: e.value,
        tabelaprecocliente: e.tabeladepreco,
        descontocanal: e.descontocanal,
        isescolheucliente: true,
        forma_pagamento_default: e.condpagamento
      });
      /*
      this.setState({
        cod_cliente: e.value,
        tabelaprecocliente: e.tabeladepreco,
        descontocanal: e.descontocanal,
        isescolheucliente: true
      });*/
    } catch (err) {
      console.log(err);
    }
  };

  handleProduto = async e => {
    //this.focusQuantidadeInput();
    try {
      this.setState({
        precotabela: e.tabela,
        peso_produto: e.price,
        produto: e
      });
    } catch (err) {
      alert(err);
    }
  };

  handleTipoPedido = async e => {
    if (e.value === "B") {
      this.setState({
        isBonificacao: true,
        tipopedidodescricao: "Pedido de Bonificação",
        tipo_pedido_escolhido: "B"
      });
    }

    if (e.value === "V") {
      this.setState({
        isBonificacao: false,
        tipopedidodescricao: "Pedido de Venda",
        tipo_pedido_escolhido: "V"
      });
    }

    if (e.value === "C") {
      this.setState({
        isBonificacao: false,
        tipopedidodescricao: "Pedido de Consumo",
        tipo_pedido_escolhido: "C"
      });
    }

    if (e.value === "I") {
      this.setState({
        isBonificacao: false,
        tipopedidodescricao: "Pedido de Industrialização",
        tipo_pedido_escolhido: "I"
      });
    }
    this.setState({
      cod_tp_pedido: e.value,
      escolheutipopedido: true
    });
    await this.cargaclientes();
  };

  handlePagamento = e => {
    this.setState({
      forma_pagamento_escolhida: e.value
      //forma_pagamento_default: null
    });
  };

  handleFrete = e => {
    this.setState({
      cod_frete: e.value
    });
  };

  handleQuantidade = e => {
    console.log("QUANTIDADE");

    console.log(e.target.value);
    this.setState({
      quantidadeitem: e.target.value
    });
  };

  formatadata = data => format(data, "dd'/'MM'/'yy");

  handleDataEntrega = e => {
    let resultado = this.formatadata(e);
    console.log(resultado);

    this.setState({
      data_entrega: e,
      data_entrega_formatado: resultado
    });
  };

   handleDataAtendimento = e => {
    let resultado = this.formatadata(e);
    console.log(resultado);

    this.setState({
      data_atendimento: e,
      data_atendimento_formatado: resultado
    });
  };

  handleOrdemCompra = e => {
    this.setState({
      ordemcompra: e.target.value
    });
  };

  handleDescontoItem = e => {
    if (e.target.value > 100) {
      swal({
        title: "Desconto Alem do Limite",
        text: "Você digitou um desconto além do limite",
        icon: "error",
        closeOnClickOutside: false,
        closeOnEsc: false
        //timer: 4000,
        //button: false
      });
    }
    this.setState({
      descontoitem: e.target.value
    });
  };

  handlePedidoOrigem = e => {
    this.setState({
      pedidoorigeminformado: e.target.value
    });
  };

  handleObservacaoPedido = e => {
    this.setState({
      observacaopedido: e.target.value
    });
  };

  handleDescontoCampanha = e => {
    if (e.target.value > 100) {
      swal({
        title: "Desconto Alem do Limite",
        text: "Você digitou um desconto além do limite",
        icon: "error",
        closeOnClickOutside: false,
        closeOnEsc: false
        //timer: 4000,
        //button: false
      });
    }
    this.setState({
      descontocampanha: e.target.value
    });
  };

  PedidoOrigem = props => {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
      return (
        <TextField
          id="outlined-name"
          label="Pedido Origem"
          //value={values.valor}
          margin="normal"
          variant="outlined"
        />
      );
    }
  };

  handleClickExcluirPedido = async () => {
    let excluido = false;
    await swal({
      buttons: {
        cancel: true,
        confirm: true
      },
      title: "Excluir Pedido Salvo?",
      text: "Deseja excluir o pedido em andamento?",
      icon: "warning",
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        excluido = true;
        try {
          this.setState({
            pedidoemandamento: false
          });
        } catch (err) {
          alert(err);
        }
      }
    });

    if (excluido) {
      console.log("estou aqui dentro");
      await this.apagarValores("itenspedido");
    }
  };

  handleRecuperarPedido = async () => {
    /* METODO ANTIGO
    let produtoscarrinholocalstorage = await this.lerValores("itenspedido");
    produtoscarrinholocalstorage = JSON.parse(produtoscarrinholocalstorage);
    */
    const { pedidomongo } = this.state;
    await this.cargaclientes();
    this.setState({
      produtoscarrinho: pedidomongo.pedido
    });
  };

  AlterarItempedido = e => {
    console.log("Valor da linha da tabela");
    console.log(e);
  };

  _handleKeyDown = async e => {
    e.persist();

    try {
      if (e.key === "Enter" || e.key === "Escape") {
        console.log(e.key);
        console.log("value", e.target.value);
        console.log("Produto Clicado dentro do enter");
        console.log(
          this.state.produto_clicado[5].props.control.props.value.replace(
            ".",
            ","
          )
        );

        let lista_pedido = JSON.parse(await this.lerValores("itenspedido"));
        let pedido = lista_pedido.filter(p => {
          return p.item === this.state.produto_clicado[0];
        });
        console.log("Registro Encontrado");
        console.log(pedido);

        const j_retorno_item = await this.valorvendaitem(
          pedido[0].cod_cliente,
          pedido[0].tabela,
          pedido[0].cond_pagamento,
          pedido[0].codigo,
          this.state.produto_clicado[5].props.control.props.value.replace(
            ".",
            ","
          ),
          this.state.produto_clicado[6].props.control.props.value.replace(
            ".",
            ","
          ),
          e.target.value
        );
        console.log("Retorno Recalculo");
        console.log(j_retorno_item);
        console.log("carrinho de compras");
        console.log(this.state.produtoscarrinho);
        //let pedido_busca = JSON.parse(this.state.produtoscarrinho);
        const pedido_alterado = lista_pedido.map((value, index, array) => {
          if (value.item === this.state.produto_clicado[0]) {
            value.precoitem = j_retorno_item[0].prc_liquido;
            value.prc_tabela = j_retorno_item[0].prc_tabela;
            value.total = j_retorno_item[0].prc_compra_cx;
            value.quantidade = j_retorno_item[0].quantidade;
            value.peso = j_retorno_item[0].peso_bruto;
          }
          return value;
        });
        console.log("ITEM ALTERADO");
        console.log(pedido_alterado);
        this.gravarValores("itenspedido", JSON.stringify(pedido_alterado));

        this.setState({
          produtoscarrinho: pedido_alterado
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  isLetter = async c => {
    return c.toLowerCase() !== c.toUpperCase();
  };

  _handleMouseLeave = async event => {
    if (event.target.value === "") {
      swal({
        title: "Erro ao digitar desconto",
        text: "Somente digitos são permitidos",
        icon: "error",
        closeOnClickOutside: false,
        closeOnEsc: false
      });
    }
  };

  _handleKeyDownDescontoCampanha = async e => {
    e.persist();
    console.log(e.key);
    if (e.key !== "Enter" && e.key !== "Escape" && e.key !== "Backspace") {
      if (await this.isLetter(e.key)) {
        swal({
          title: "Erro ao digitar desconto",
          text: "Somente digitos são permitidos",
          icon: "error",
          closeOnClickOutside: false,
          closeOnEsc: false
        });
      }
    }

    if (e.key === "Enter" || e.key === "Escape") {
      console.log(e.key);
      console.log("value", e.target.value);
      let novo_desconto = null;
      novo_desconto = e.target.value;
      console.log("Produto Clicado dentro do enter");
      console.log(this.state.produto_clicado);
      let lista_pedido = JSON.parse(await this.lerValores("itenspedido"));
      let pedido = lista_pedido.filter(p => {
        return p.item === this.state.produto_clicado[0];
      });
      console.log("Registro Encontrado");
      console.log(pedido);

      const j_retorno_item = await this.valorvendaitem(
        pedido[0].cod_cliente,
        pedido[0].tabela,
        pedido[0].cond_pagamento,
        pedido[0].codigo,
        e.target.value.replace(".", ","),
        this.state.produto_clicado[6].props.control.props.value.replace(
          ".",
          ","
        ),
        pedido[0].quantidade
      );
      console.log("Retorno Recalculo");
      console.log(j_retorno_item);
      console.log("carrinho de compras");
      console.log(this.state.produtoscarrinho);
      //let pedido_busca = JSON.parse(this.state.produtoscarrinho);
      const pedido_alterado = lista_pedido.map((value, index, array) => {
        if (value.item === this.state.produto_clicado[0]) {
          value.precoitem = j_retorno_item[0].prc_liquido;
          value.prc_tabela = j_retorno_item[0].prc_tabela;
          value.total = j_retorno_item[0].prc_compra_cx;
          value.quantidade = j_retorno_item[0].quantidade;
          value.peso = j_retorno_item[0].peso_bruto;
          value.campanha = novo_desconto.replace(".", ",");
        }
        return value;
      });
      console.log("ITEM ALTERADO");
      console.log(pedido_alterado);
      this.gravarValores("itenspedido", JSON.stringify(pedido_alterado));

      this.setState({
        produtoscarrinho: pedido_alterado
      });
    }
  };

  _handleKeyDownDescontoItem = async e => {
    e.persist();
    console.log(e.key);
    if (e.key !== "Enter" && e.key !== "Escape" && e.key !== "Backspace") {
      if (await this.isLetter(e.key)) {
        swal({
          title: "Erro ao digitar desconto",
          text: "Somente digitos são permitidos",
          icon: "error",
          closeOnClickOutside: false,
          closeOnEsc: false
        });
      }
    }

    if (e.key === "Enter" || e.key === "Escape") {
      console.log(e.key);
      console.log("value", e.target.value);
      let novo_desconto = null;
      novo_desconto = e.target.value;
      console.log("Produto Clicado dentro do enter");
      console.log(this.state.produto_clicado);
      let lista_pedido = JSON.parse(await this.lerValores("itenspedido"));
      let pedido = lista_pedido.filter(p => {
        return p.item === this.state.produto_clicado[0];
      });
      console.log("Registro Encontrado");
      console.log(pedido);

      const j_retorno_item = await this.valorvendaitem(
        pedido[0].cod_cliente,
        pedido[0].tabela,
        pedido[0].cond_pagamento,
        pedido[0].codigo,
        this.state.produto_clicado[5].props.control.props.value.replace(
          ".",
          ","
        ),
        e.target.value.replace(".", ","),
        pedido[0].quantidade
      );
      console.log("Retorno Recalculo");
      console.log(j_retorno_item);
      console.log("carrinho de compras");
      console.log(this.state.produtoscarrinho);
      //let pedido_busca = JSON.parse(this.state.produtoscarrinho);
      const pedido_alterado = lista_pedido.map((value, index, array) => {
        if (value.item === this.state.produto_clicado[0]) {
          value.precoitem = j_retorno_item[0].prc_liquido;
          value.prc_tabela = j_retorno_item[0].prc_tabela;
          value.total = j_retorno_item[0].prc_compra_cx;
          value.quantidade = j_retorno_item[0].quantidade;
          value.peso = j_retorno_item[0].peso_bruto;
          value.descontoitem = novo_desconto.replace(".", ",");
        }
        return value;
      });
      console.log("ITEM ALTERADO");
      console.log(pedido_alterado);
      this.gravarValores("itenspedido", JSON.stringify(pedido_alterado));

      this.setState({
        produtoscarrinho: pedido_alterado
      });
    }
  };

  metodoenviarpedido = async pedidocompleto => {
    let mensagemsucessoantes,
      mensagemsucessodepois = 0;
    let icone,
      titulo,
      texto = "";

    this.setState({
      mensagemloader: "Enviando pedido",
      loading: true
    });

    await axios({
      url: "https://inglezaonline.com.br/microservices/incluirpedido",
      method: "post",
      data: pedidocompleto
    })
      .then(function(response) {
        // your action after success

        mensagemsucessoantes =
          response.data.trim().indexOf("numeropedido") + 14;
        mensagemsucessodepois = mensagemsucessoantes + 22;

        icone = "success";
        titulo = "Pedido Incluido com Sucesso!";
        texto =
          "Numero Pedido: " +
          response.data
            .slice(mensagemsucessoantes, mensagemsucessodepois)
            .replace(/[}"\]]/g, "");
        if (mensagemsucessoantes === 13) {
          mensagemsucessoantes = response.data.trim().indexOf("mensagem") + 2;
          mensagemsucessodepois = mensagemsucessoantes + 100;
          icone = "error";
          titulo = "Erro ao inserir pedido!";
          texto =
            "Motivo: " +
            response.data
              .slice(mensagemsucessoantes, mensagemsucessodepois)
              .replace(/[}"\]]/g, "");
        }

        swal({
          buttons: {
            cancel: true,
            confirm: true
          },
          title: titulo,
          text: texto,
          icon: icone,
          dangerMode: true
        }).then(willDelete => {
          if (willDelete) {
            if (icone === "success") {
              /*
               this.setState({
                 pagamento: [],
                 clientes: [],
                 produtos: []
               });*/
            }
            window.location.reload();
          }
        });
        /*
        swal({
          title: titulo,
          text: texto,
          icon: icone,
          closeOnClickOutside: false,
          closeOnEsc: false
          //timer: 4000,
          //button: false
        });

        if (icone === "success") {
          
          this.setState({
            pagamento: [],
            clientes: [],
            produtos: []
          });
        } */
      })
      .catch(function(error) {
        // your action on error success

        alert(error);
      });

    this.setState({
      loading: false
    });

    if (icone === "success") {
      await this.apagarValores("itenspedido");
    }
    //await this.ultimospedidos();
  };

  pedidoandamento = async (...params) => {
    await api.post(
      "https://inglezaonline.com.br/microservices/salvarpedido",
      params[0],
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  };

  consultapedidoandamento = async (...params) => {
    return await api.post(
      "https://inglezaonline.com.br/microservices/consultapedidoativo",
      params[0],
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  };

  ultimospedidos = async () => {
    this.setState({
      loading: true
    });

    const response = await api.post(
      "https://inglezaonline.com.br/microservices/pedido",
      {
        cod_representante: this.state.dadosusuariologado.codrepresentante
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    this.setState({
      loading: false,
      pedidos: response.data.ttRetorno
    });
  };

  handleBlurDescontoItem = async evento => {
    console.log(evento);
  };

  handleEnviarPedido = async () => {
    let pedidocompleto = await this.lerValores("itenspedido");
    pedidocompleto = JSON.parse(pedidocompleto);
    console.log(pedidocompleto);

    await swal({
      title: "Enviar Pedido?",
      text: "Deseja enviar o Pedido?",
      icon: "warning",
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        this.metodoenviarpedido(pedidocompleto);
      }
    });

    /*
    axios({
      url: "https://inglezaonline.com.br/microservices/incluirpedido",
      method: "post",
      data: pedidocompleto
    })
      .then(function(response) {
        // your action after success
       
        alert(response.data);
        console.log(response.data);
        
      })
      .catch(function(error) {
        // your action on error success
       
        alert(error);
      });*/

    /* 
    const response = await api.post(
      "https://inglezaonline.com.br/microservices/incluirpedido",
      {
        pedidocompleto
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);*/

    //await this.apagarValores("itenspedido");
    this.goToDashboard();
  };
  /*
  handleCalculoTotais = async() => {

    let peso = 0,
        valor = null,
        volume = 0;

    await this.state.produtoscarrinho.map(pedido => {

      peso = pedido.peso + peso;
      valor = pedido.total + valor;
      volume = pedido.quantidade + volume;
      
     
    });

    console.log('TOTAIS');
    console.log(peso);
    console.log(valor);
    console.log(volume);
   this.setState({
     peso_total: peso,
     valor_bruto_total: valor,
     total_volumes: volume
   });

  };
  */

  handleClickAdicionarItemPedido = async () => {
    let desconto_campanha_f,
      desconto_item_f = "",
      tipo_forma_pagamento = 0,
      peso_calculado = 0;

    let iten_inserido = this.state.produtoscarrinho.filter(it => {
      return it.item === this.state.produto.label;
    });

    if (iten_inserido.length > 0) {
      swal({
        title: "Erro ao inserir item no pedido",
        text: "Este item selecionado já foi incluido no pedido",
        icon: "error",
        closeOnClickOutside: false,
        closeOnEsc: false
        //timer: 4000,
        //button: false
      });
    } else {
      /*
    let valoratuallocalstorage = await this.lerValores("itenspedido");
    if(valoratuallocalstorage !== null){
        valoratuallocalstorage.concat({
          item: this.state.produto.label,
          quantidade: this.state.quantidadeitem,
          tabela: this.state.produto.tabela,
          campanha: this.state.descontocampanha,
          descontoitem: this.state.descontoitem,
          total: 0
      });
    }else{

      valoratuallocalstorage = {
          item: this.state.produto.label,
          quantidade: this.state.quantidadeitem,
          tabela: this.state.produto.tabela,
          campanha: this.state.descontocampanha,
          descontoitem: this.state.descontoitem,
          total: 0
      };

    }*/

      //produtoslocalstorge;

      if (
        this.state.produto !== null &&
        this.state.quantidadeitem !== null
        //this.state.descontocampanha !== null &&
        //this.state.descontoitem !== null
      ) {
        if (this.state.descontocampanha !== null) {
          desconto_campanha_f = this.state.descontocampanha.replace(".", ",");

          this.setState({
            descontocampanha: desconto_campanha_f
          });
        } else {
          this.setState({
            descontocampanha: "0"
          });
        }

        if (this.state.descontoitem !== null) {
          desconto_item_f = this.state.descontoitem.replace(".", ",");
          console.log(desconto_item_f);

          this.setState({
            descontoitem: desconto_item_f
          });
        } else {
          this.setState({
            descontoitem: "0"
          });
        }

        //buscar os dados do item
        const j_retorno_item = await this.valorvendaitem(
          this.state.cod_cliente,
          this.state.tabelaprecocliente,
          this.state.forma_pagamento_escolhida,
          this.state.produto.value,
          this.state.descontoitem.replace(".", ","),
          this.state.descontocampanha.replace(".", ","),
          this.state.quantidadeitem
        );

        console.log(j_retorno_item);

        if (!this.state.isBonificacao) {
          tipo_forma_pagamento = this.state.forma_pagamento_escolhida;
        }
        console.log("PRODUTO");
        console.log(this.state.produto);
        peso_calculado =
          Number(this.state.quantidadeitem) * Number(this.state.peso_produto);

        let qt_ajustada = 0;
        try {
          if (
            this.state.quantidadeitem === "" ||
            this.state.quantidadeitem === 0 ||
            !this.state.quantidadeitem
          ) {
            qt_ajustada = 1;
          } else {
            qt_ajustada = this.state.quantidadeitem;
          }
        } catch (err) {
          qt_ajustada = 1;
        }

        let colecao = this.state.produtoscarrinho.concat([
          {
            tp_pedido: this.state.tipo_pedido_escolhido,
            cod_cliente: this.state.cod_cliente,
            cond_pagamento: tipo_forma_pagamento,
            ordem_compra: this.state.ordemcompra,
            dt_entrega: this.state.data_entrega_formatado,
            tabela: this.state.tabelaprecocliente,
            precoitem: j_retorno_item[0].prc_liquido,
            prc_tabela: j_retorno_item[0].prc_tabela,
            per_desc_canal: j_retorno_item[0].per_desc_canal,
            pedido_origem: this.state.pedidoorigeminformado,
            data_atendimento: "",
            observacoes: "",
            frete: this.state.cod_frete,
            dt_atendimento: this.state.data_atendimento_formatado,
            observacao_logistica: this.state.observacaopedido,
            codigo: this.state.produto.value,
            item: this.state.produto.label,
            quantidade: qt_ajustada,
            peso: peso_calculado,
            campanha: this.state.descontocampanha.replace(".", ","),
            descontoitem: this.state.descontoitem.replace(".", ","),
            total: j_retorno_item[0].prc_compra_cx
          }
        ]);

        let pedido_andamento = JSON.stringify({
          usuario: this.state.dadosusuariologado.nomerepresentante,
          pedido: colecao
        });

        await this.pedidoandamento(pedido_andamento);
        this.gravarValores("pedidoandamento", pedido_andamento);
        this.gravarValores("itenspedido", JSON.stringify(colecao));
        this.gravarValores("itenspedidoarray", colecao);

        this.setState({
          produtoscarrinho: colecao,
          peso_total: this.state.peso_total + peso_calculado,
          valor_bruto_total:
            Number(j_retorno_item[0].prc_compra_cx) +
            Number(this.state.valor_bruto_total),
          total_volumes:
            Number(this.state.total_volumes) +
            Number(this.state.quantidadeitem),
          temproduto: true
        });

        this.limpacampos();
      } else {
        swal({
          title: "Erro ao inserir um item no pedido",
          text: "Favor inserir a quantidade do item",
          icon: "error",
          closeOnClickOutside: false,
          closeOnEsc: false
        });
      }
    }
  };

  handleMeusPedidos = async () => {
    this.props.history.push("/vendadireta/pedidos");
  };

  handleOpen = () => {
    this.setState({
      open: true,
      checked: !this.state.checked
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  limpacampos = () => {
    this.setState({
      quantidadeitem: null,
      descontoitem: "0",
      descontocampanha: "0"
    });
  };

  gravarValores = async (chave, valor) =>
    await localStorage.setItem(chave, valor);

  lerValores = async valor => await localStorage.getItem(valor);

  apagarValores = async valor => await localStorage.removeItem(valor);

  apagaTodosValores = async () => await localStorage.clear();

  DeletaLinhaTabela = async e => {};

  handleDrawerOpen = () => {
    this.setState({
      appaberto: true
    });
  };

  handleDrawerClose = () => {
    this.setState({
      appaberto: false
    });
  };

  deixeiproduto = () => {
    alert("sim");
  };

  goToDashboard = event => {
    const queryString = this.props.location.search;

    this.props.history.push({
      pathname: "/vendadireta/dashboard",
      search: queryString
    });
  };

  render() {
    const { classes } = this.props;

    const isBonificacao = this.state.isBonificacao;
    let pedidoorigem,
      descontoitemcomponent,
      descontocampanhacomponent,
      quantidadecomponent,
      recuperarpedido;

    const options = {
      filterType: "dropdown",
      filter: true,
      print: false,
      download: false,
      viewColumns: false,
      responsive: "stacked",
      rowsPerPage: 10,
      onRowsDelete: rowsDeleted => {
        console.log("item a ser deletado");
        console.log(this.state.produtoscarrinho[rowsDeleted.data[0].dataIndex]);
        /*
        let antes = this.state.produtoscarrinho.find(
          el =>
            el.item ===
            this.state.produtoscarrinho[rowsDeleted.data[0].dataIndex].item
        );
        console.log('antes ');*/
        //console.log(antes);
        //const indiceexcluido = rowsDeleted.data[0].dataIndex + 1;
        const indiceexcluido = rowsDeleted.data[0].dataIndex;
        console.log(indiceexcluido);
        console.log("REGISTRO");
        console.log(rowsDeleted.data[0]);
        /*let depois = this.state.produtoscarrinho.splice(
          this.state.produtoscarrinho.indexOf(indiceexcluido),
          1
        );*/
        let depois = this.state.produtoscarrinho.filter(p => {
          return (
            p.codigo !==
            this.state.produtoscarrinho[rowsDeleted.data[0].dataIndex].codigo
          );
        });
        /*let depois = this.state.produtoscarrinho.splice(
          indiceexcluido,
          1
        );*/
        this.gravarValores("itenspedido", JSON.stringify(depois));
        this.setState({
          produtoscarrinho: depois
        });

        if (this.state.produtoscarrinho.length === 0) {
          this.setState({
            temproduto: false
          });
        }
        /* UMA TRATATIVA DE NAO EXCLUIR DETERMINADO ITEM.
        if (rowsDeleted.data[0].dataIndex === 0) {
          window.alert("Can't delete this!");
          return false;
        }*/
        //console.log(rowsDeleted, "were deleted!");
      },
      onRowClick: (rowData, rowState) => {
        this.setState({
          produto_clicado: rowData
        });
        console.log(rowData, rowState);
      },
      textLabels: {
        pagination: {
          next: "Próximo",
          previous: "Anterior",
          rowsPerPage: "linhas por Pagina:",
          displayRows: "de"
        },
        body: {
          noMatch: "Favor inserir um item ao pedido",
          toolTip: "Ordenar",
          columnHeaderTooltip: column => `Ordenado por ${column.label}`
        },
        filter: {
          all: "Todos",
          title: "FILTRO",
          reset: "LIMPAR"
        }
      }
    };

    const columns = [
      {
        name: "item",
        label: "item",
        options: {
          filter: true
          //display: "excluded"
        }
      },
      {
        name: "quantidade",
        label: "Quantidade",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              control={
                <TextField
                  value={value || ""}
                  type="number"
                  className={classes.textField}
                />
              }
              onKeyDown={this._handleKeyDown}
              onChange={event => {
                //this.AlterarItempedido(event)
                updateValue(event.target.value);
              }}
            />
          )
        }
      },
      {
        name: "prc_tabela",
        label: "Tabela",
        options: {
          filter: false
        }
      },
      {
        name: "precoitem",
        label: "Valor Venda",
        options: {
          filter: false
        }
      },
      {
        name: "per_desc_canal",
        Label: "Desconto Canal",
        options: {
          filter: false
        }
      },
      {
        name: "campanha",
        Label: "Desconto Campanha",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              control={
                <TextField
                  value={value || ""}
                  type="text"
                  className={classes.textField}
                />
              }
              onKeyDown={this._handleKeyDownDescontoCampanha}
              onMouseLeave={this._handleMouseLeave}
              onChange={event => {
                updateValue(event.target.value);
              }}
            />
          )
        }
      },

      {
        name: "descontoitem",
        label: "Desconto Item",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              control={
                <TextField
                  value={value || ""}
                  type="text"
                  className={classes.textField}
                />
              }
              onKeyDown={this._handleKeyDownDescontoItem}
              onMouseLeave={this._handleMouseLeave}
              onChange={event => {
                //this.AlterarItempedido(event)
                updateValue(event.target.value);
              }}
            />
          )
        }
      },
      {
        name: "peso",
        label: "Peso",
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: "total",
        label: "Total",
        options: {
          filter: false,
          sort: false
        }
      }
    ];

    if (isBonificacao) {
      pedidoorigem = (
        <TextField
          id="outlined-name"
          label="Pedido Origem"
          value={this.state.pedidoorigeminformado}
          onChange={this.handlePedidoOrigem}
          margin="normal"
          variant="outlined"
        />
      );
    }

    descontoitemcomponent = (
      <React.Fragment>
        <Typography
          variant="h6"
          style={{
            margin: 10
          }}
        >
          Desconto Item %
        </Typography>
        <TextField
          id="outlined-name"
          //label="Desconto Item"
          className={classes.textField}
          value={this.state.descontoitem}
          onChange={this.handleDescontoItem}
          margin="normal"
          variant="outlined"
          InputProps={{
            inputComponent: TextMaskPercent,
            value: this.state.descontoitem,
            label: "Desconto Item",
            onChange: this.handleDescontoItem
          }}
        />
       
      </React.Fragment>
    );

    descontocampanhacomponent = (
      <React.Fragment>
        <Typography
          variant="h6"
          style={{
            margin: 10
          }}
        >
          Desconto Campanha %
        </Typography>
        <TextField
          id="outlined-name"
          className={classes.textField}
          value={this.state.descontocampanha}
          margin="normal"
          variant="outlined"
          InputProps={{
            inputComponent: TextMaskPercent,
            value: this.state.descontocampanha,
            label: "Desconto Campanha",
            onChange: this.handleDescontoCampanha
          }}
        />
      </React.Fragment>
    );

    quantidadecomponent = (
      <React.Fragment>
        <Typography
          variant="h6"
          style={{
            margin: 10
          }}
        >
          Quantidade UN
        </Typography>
        <TextField
          id="standard-number"
          className={classes.textField}
          //label="Quantidade"
          value={this.state.quantidadeitem}
          //onChange={this.handleQuantidade}
          type="number"
          //ref={this.textQuantidadeInput}
          //margin="normal"
          variant="outlined"
          //margin="normal"
          InputProps={{
            inputComponent: TextMaskQuantidade,
            value: this.state.quantidadeitem,
            //label: "Quantidade",
            onChange: this.handleQuantidade
            //inputRef: this.textQuantidadeInput
          }}
        />
      </React.Fragment>
    );

    if (this.state.pedidoemandamento) {
      recuperarpedido = (
        <React.Fragment>
          <Paper className={classes.paper}>
            <Typography
              className={classes.inlining}
              color="secondary"
              variant="h6"
              gutterBottom
            >
              Existe um pedido em Andamento o que você deseja fazer ?
            </Typography>
            <Divider />
            <div className={classes.buttonBar}>
              <Button
                color="primary"
                variant="contained"
                className={classes.actionButtom}
                onClick={this.handleRecuperarPedido}
                startIcon={<HowToVoteIcon />}
              >
                Recuperar
              </Button>
              <Button
                variant="outlined"
                className={classes.actionButtom}
                onClick={this.handleClickExcluirPedido}
                startIcon={<DeleteIcon />}
              >
                Excluir
              </Button>
            </div>
          </Paper>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Grid container justify="center">
            <Spinner isFetching={this.state.loading} color="#5A6AAA" />
            <Grid
              spacing={2}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid item xs={12}>
                <Back />

                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>
                      Pedido
                    </Typography>
                    <Typography variant="body1">
                      Envie um novo pedido de Venda, Bonificação ou Consumo.
                    </Typography>
                  </div>
                  <div>{recuperarpedido}</div>
                </div>

                <Paper
                  className={classes.paper}
                  style={{
                    position: "relative"
                  }}
                >
                  {this.state.isescolheucliente && (
                    <React.Fragment>
                      <Typography variant="h6" gutterBottom>
                        <Box color="primary.main">
                          Tabela : {this.state.tabelaprecocliente}
                        </Box>
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        <Box color="primary.main">
                          Canal: {this.state.descontocanal}
                        </Box>
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        <Box color="primary.main">
                          {this.state.tipopedidodescricao}
                        </Box>
                      </Typography>
                    </React.Fragment>
                  )}

                  <TextField
                    id="outlined-name"
                    label="Numero Pedido (Opcional)"
                    value={this.state.ordemcompra}
                    onChange={this.handleOrdemCompra}
                    //value={values.valor}
                    margin="normal"
                    variant="outlined"
                    inputProps={{
                      maxLength: 12,
                    }}
                    autoFocus
                  />

                  <Typography variant="h6" gutterBottom>
                    Tipo do Pedido
                  </Typography>
                  <Select
                    onChange={this.handleTipoPedido}
                    options={this.state.tipo_pedido}
                    isLoading={this.state.loading}
                    isDisabled={this.state.temproduto}
                  ></Select>
                  {pedidoorigem}
                  {this.state.escolheutipopedido && (
                    <Typography variant="h6" gutterBottom>
                      Escolha o Cliente
                    </Typography>
                  )}
                  {this.state.escolheutipopedido && (
                    <Select
                      onChange={this.handleCliente}
                      options={this.state.clientes}
                      isDisabled={this.state.temproduto}
                    ></Select>
                  )}

                  {!this.state.isBonificacao && (
                    <React.Fragment>
                      {this.state.isescolheucliente && (
                        <Typography variant="h6" gutterBottom>
                          Pagamento
                        </Typography>
                      )}
                      {this.state.isescolheucliente && (
                        <Select
                          onChange={this.handlePagamento}
                          options={this.state.pagamento}
                          isDisabled={this.state.temproduto}

                          //value={this.state.pagamento.filter(
                          //  option =>
                          //    option.value ===
                          //    this.state.forma_pagamento_default
                          //)}
                        ></Select>
                      )}
                    </React.Fragment>
                  )}
                  {this.state.isescolheucliente && (
                    <Typography variant="h6" gutterBottom>
                      Frete
                    </Typography>
                  )}
                  {this.state.isescolheucliente && (
                    <Select
                      onChange={this.handleFrete}
                      options={this.state.frete}
                      isDisabled={this.state.temproduto}
                    ></Select>
                  )}
                  <Divider />
                  {this.state.isescolheucliente && (
                    <Typography variant="h6" gutterBottom>
                      Data Limite de Atendimento
                    </Typography>
                  )}
                  {this.state.isescolheucliente && (
                    <MuiPickersUtilsProvider
                      utils={DateFnsUtils}
                      locale={ptLocale}
                    >
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        format="dd/MM/yyyy"
                        value={this.state.data_atendimento}
                        onChange={this.handleDataAtendimento}
                        KeyboardButtonProps={{
                          "aria-label": "change date"
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  )}
                  {this.state.isescolheucliente && (
                    <Typography variant="h6" gutterBottom>
                      Observação
                    </Typography>
                  )}
                  {this.state.isescolheucliente && (
                    <TextareaAutosize
                      id="observacaopedido"
                      label="Opcional"
                      rowsMin="6"
                      value={this.state.observacaopedido}
                      onChange={this.handleObservacaoPedido}
                      readOnly={this.state.temproduto}
                      margin="normal"
                      style={{ height: 180, width: 700, fontSize: 18 }}
                    />
                  )}
                </Paper>
                {this.state.isescolheucliente && (
                  <Grid item xs={12}>
                    <Paper
                      className={classes.paper}
                      style={{ position: "relative" }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Escolha os Produtos
                      </Typography>
                      <div className={classes.inlining}>
                        <IconButton aria-label="cart">
                          <Badge
                            className={classes.badge}
                            badgeContent={this.state.produtoscarrinho.length}
                            color="primary"
                          >
                            <ShoppingCartIcon />
                          </Badge>
                        </IconButton>
                        <Typography
                          className={classes.inlining}
                          variant="subtitle2"
                          gutterBottom
                        >
                          Produtos no Carrinho
                        </Typography>
                      </div>
                      <Select
                        options={this.state.produtos}
                        onChange={this.handleProduto}
                        onLeave={this.deixeiproduto}
                        className={classes.selectproduto}
                      ></Select>
                      <Divider />

                      <div className={classes.totais}>
                        <Grid
                          alignItems="center"
                          justify="center"
                          container
                          className={classes.gridtotais}
                        >
                          <Typography variant="h6" gutterBottom>
                            <Box color="primary.main">
                              Tabela: R$: {this.state.precotabela}
                            </Box>
                          </Typography>

                          <Typography variant="h6" gutterBottom>
                            <Box color="primary.main">
                              Peso Bruto Total: KG: {this.state.peso_total}
                            </Box>
                          </Typography>

                          <Typography variant="h6" gutterBottom>
                            <Box color="primary.main">
                              Valor Bruto Total: R$:{" "}
                              {this.state.valor_bruto_total}
                            </Box>
                          </Typography>

                          <Typography variant="h6" gutterBottom>
                            <Box color="primary.main">
                              Volume Total: UN: {this.state.total_volumes}
                            </Box>
                          </Typography>
                        </Grid>
                      </div>

                      <div className={classes.inlining}>
                        <Grid alignItems="center" justify="center" container>
                          {quantidadecomponent}
                          {descontoitemcomponent}
                          {descontocampanhacomponent}
                        </Grid>
                      </div>
                      <Divider />

                      <Button
                        variant="outlined"
                        className={classes.outlinedButtom}
                        onClick={this.handleClickAdicionarItemPedido}
                        startIcon={<CloudUploadIcon />}
                      >
                        Adicionar
                      </Button>
                      <Divider />
                      <Typography variant="h6" gutterBottom>
                        <Box color="primary.main">
                          Pressione Enter para recalcular os valores do pedido.
                        </Box>
                      </Typography>
                    </Paper>

                    <Paper
                      //className={classes.papermuitables}
                      style={{ position: "relative" }}
                    >
                      <div style={{ boxSizing: "content-box" }}>
                        <MUIDataTable
                          title={"Produtos"}
                          //key={this.state.produtoscarrinho}
                          data={this.state.produtoscarrinho}
                          columns={columns}
                          options={options}
                        />
                      </div>
                    </Paper>
                  </Grid>
                )}
                {this.state.produtoscarrinho.length > 0 && (
                  <Paper className={classes.paper}>
                    <div className={classes.buttonBar}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.actionButtom}
                        onClick={this.handleEnviarPedido}
                        startIcon={<CloudUploadIcon />}
                      >
                        Enviar
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={this.handleClickExcluirPedido}
                        className={classes.actionButtom}
                        startIcon={<DeleteIcon />}
                      >
                        Excluir
                      </Button>
                    </div>
                  </Paper>
                )}
                <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={this.state.open}
                  onClose={this.handleClose}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Slide
                    direction="up"
                    in={this.state.open}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div style={getModalStyle()} className={classes.paper}>
                      <Typography variant="title" id="modal-title">
                        Text in a modal
                      </Typography>
                      <Typography
                        variant="subheading"
                        id="simple-modal-description"
                      >
                        Duis mollis, est non commodo luctus, nisi erat porttitor
                        ligula.
                      </Typography>
                    </div>
                  </Slide>
                </Modal>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Pedido));
