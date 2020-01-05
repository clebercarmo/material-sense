import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter, Link } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
//import Select from '@material-ui/core/Select';
import Back from "./common/Back";
import Select from "react-select";
import api from "../services/api";
import Spinner from "../loading";
import swal from "sweetalert";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import TextField from "@material-ui/core/TextField";

import Container from "@material-ui/core/Container";

import PropTypes from "prop-types";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Slide from "@material-ui/core/Slide";
import Mensagem from "./mensagem";
import { css } from "@emotion/core";
import clsx from "clsx";
import TextMaskPercent from "./mask/maskporcentagem";
import TextMaskQuantidade from "./mask/maskquantidade";
import Divider from "@material-ui/core/Divider";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const qs = require("query-string");
const backgroundShape = require("../images/shape.svg");

const numeral = require("numeral");
numeral.defaultFormat("0,000");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary["A100"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 10,
    padding: 20,
    paddingBottom: 200
  },
  grid: {
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
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42
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
  }
});

function getModalStyle() {
  const top = 25;
  const left = 25;

  return {
    top: `${top}%`,
    margin: "auto"
    // left: `${left}%`,
    // transform: `translate(-${top}%, -${left}%)`,
  };
}

const drawerWidth = 240;
let excluido = false;

class Wizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cod_cliente: "",
      tab_preco: "",
      cod_tp_pedido: "",
      cod_pagamento: "",
      cod_frete: "",
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

    this.setState({
      loading: false
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
  }

  cargaitens = async cliente => {
    this.setState({
      mensagemloader: "Carregamento Itens da Tabela de Preço"
    });

    const response = await api.post(
      "http://localhost:4000/itemvenda",
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
      "http://localhost:4000/formapagamento",
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
        "http://localhost:4000/detalheitem",
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
      "http://localhost:4000/meusclientes",
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
        isescolheucliente: true
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
    try {
      this.setState({
        precotabela: e.tabela,
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

  handleDescontoItem = e => {
    this.setState({
      descontoitem: e.target.value
    });
  };

  handlePedidoOrigem = e => {
    this.setState({
      pedidoorigeminformado: e.target.value
    });
  };

  handleDescontoCampanha = e => {
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

    console.log(excluido);

    if (excluido) {
      console.log("estou aqui dentro");
      await this.apagarValores("itenspedido");
    }
  };

  handleRecuperarPedido = async () => {
    let produtoscarrinholocalstorage = await this.lerValores("itenspedido");
    produtoscarrinholocalstorage = JSON.parse(produtoscarrinholocalstorage);
    await this.cargaclientes();
    this.setState({
      produtoscarrinho: produtoscarrinholocalstorage
    });
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
      url: "http://localhost:4000/incluirpedido",
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
            .replace(/[\}\"\]]/g, "");
        if (mensagemsucessoantes === 13) {
          mensagemsucessoantes = response.data.trim().indexOf("mensagem") + 2;
          mensagemsucessodepois = mensagemsucessoantes + 100;
          icone = "error";
          titulo = "Erro ao inserir pedido!";
          texto =
            "Motivo: " +
            response.data
              .slice(mensagemsucessoantes, mensagemsucessodepois)
              .replace(/[\}\"\]]/g, "");
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

  ultimospedidos = async () => {
    this.setState({
      loading: true
    });

    const response = await api.post(
      "http://localhost:4000/pedido",
      {
        cod_representante: this.state.dadosusuariologado.codrepresentante
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response.data.ttRetorno);
    this.setState({
      loading: false,
      pedidos: response.data.ttRetorno
    });
  };

  handleEnviarPedido = async () => {
    let pedidocompleto = await this.lerValores("itenspedido");
    pedidocompleto = JSON.parse(pedidocompleto);
    console.log(pedidocompleto);
    const bodyFormData = new FormData();

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
      url: "http://localhost:4000/incluirpedido",
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
      "http://localhost:4000/incluirpedido",
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

  handleClickAdicionarItemPedido = async () => {
    let desconto_campanha_f,
      desconto_item_f = "",
      tipo_forma_pagamento = 0;
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
        desconto_campanha_f = this.state.descontocampanha.replace("%", "");

        this.setState({
          descontocampanha: desconto_campanha_f
        });
      } else {
        this.setState({
          descontocampanha: "0"
        });
      }

      if (this.state.descontoitem !== null) {
        desconto_item_f = this.state.descontoitem.replace("%", "");
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
        this.state.descontoitem.replace("%", ""),
        this.state.descontocampanha.replace("%", ""),
        this.state.quantidadeitem
      );

      console.log(j_retorno_item);

      if (!this.state.isBonificacao) {
        tipo_forma_pagamento = this.state.forma_pagamento_escolhida;
      }

      let colecao = this.state.produtoscarrinho.concat([
        {
          tp_pedido: this.state.tipo_pedido_escolhido,
          cod_cliente: this.state.cod_cliente,
          cond_pagamento: tipo_forma_pagamento,
          ordem_compra: "",
          tabela: this.state.tabelaprecocliente,
          precoitem: j_retorno_item[0].prc_liquido,
          pedido_origem: this.state.pedidoorigeminformado,
          data_atendimento: "",
          observacoes: "",
          frete: this.state.cod_frete,
          dt_atendimento: "",
          observacao_logistica: "",
          codigo: this.state.produto.value,
          item: this.state.produto.label,
          quantidade: this.state.quantidadeitem,
          campanha: this.state.descontocampanha.replace("%", ""),
          descontoitem: this.state.descontoitem.replace("%", ""),
          total: j_retorno_item[0].prc_compra_cx
        }
      ]);

      this.gravarValores("itenspedido", JSON.stringify(colecao));
      this.gravarValores("itenspedidoarray", colecao);

      /*
       let colecao = [
         
           {
             item: this.state.produto.label,
             quantidade: this.state.quantidadeitem,
             tabela: this.state.produto.tabela,
             campanha: this.state.descontocampanha,
             descontoitem: this.state.descontoitem,
             total: 0
           }
         
       ];*/

      this.setState({
        produtoscarrinho: colecao,
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
        //timer: 4000,
        //button: false
      });
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

  goToDashboard = event => {
    const queryString = this.props.location.search;

    this.props.history.push({
      pathname: "/dashboard",
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
        const indiceexcluido = rowsDeleted.data[0].dataIndex + 1;
        console.log(indiceexcluido);
        let depois = this.state.produtoscarrinho.splice(
          this.state.produtoscarrinho.indexOf(indiceexcluido),
          1
        );
        this.gravarValores("itenspedido", JSON.stringify(depois));

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
              control={<TextField value={value || ""} type="number" />}
              onChange={event => updateValue(event.target.value)}
            />
          )
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
        name: "campanha",
        Label: "Campanha",
        options: {
          filter: false
        }
      },
      {
        name: "descontoitem",
        label: "Desconto Item",
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: "total",
        label: "Valor Total",
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
      <Typography variant="p" gutterBottom>
        Desconto Item{" "}
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
        />{" "}
      </Typography>
    );

    descontocampanhacomponent = (
      <Typography variant="p" gutterBottom>
        Desconto Campanha{" "}
        <TextField
          id="outlined-name"
          //label="Desconto Campanha"
          className={classes.textField}
          value={this.state.descontocampanha}
          //onChange={this.handleDescontoCampanha}
          margin="normal"
          variant="outlined"
          InputProps={{
            inputComponent: TextMaskPercent,
            value: this.state.descontocampanha,
            label: "Desconto Campanha",
            onChange: this.handleDescontoCampanha
          }}
        />{" "}
      </Typography>
    );

    quantidadecomponent = (
      <Typography variant="p" gutterBottom>
        Quantidade{" "}
        <TextField
          id="standard-number"
          //label="Quantidade"
          value={this.state.quantidadeitem}
          //onChange={this.handleQuantidade}
          type="number"
          margin="normal"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          //margin="normal"
          InputProps={{
            inputComponent: TextMaskQuantidade,
            value: this.state.quantidadeitem,
            label: "Quantidade",
            onChange: this.handleQuantidade
          }}
        />{" "}
      </Typography>
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
              spacing={24}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid item xs={12}>
                <Back />
                <Container>
                  
                  <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>
                       Pedido
                    </Typography>
                    <Typography variant="body1">
                      Envie um novo pedido de Venda, Bonificação ou Consumo.
                    </Typography>
                  </div>
                  <div>
                    {recuperarpedido}
                  </div>
                  </div>

                  <Paper className={classes.paper}>
                    <Mensagem
                      open={this.state.loading}
                      mensagem={this.state.mensagemloader}
                      variant={"info"}
                    />
                   
                    <Card className={classes.card} display="flex">
                      {this.state.isescolheucliente && (
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            <Box color="primary.main">
                              Tabela de preço do cliente:{" "}
                              {this.state.tabelaprecocliente}
                            </Box>
                          </Typography>
                          <Typography variant="h6" gutterBottom>
                            <Box color="primary.main">
                              Desconto Canal: {this.state.descontocanal}
                            </Box>
                          </Typography>
                          <Typography variant="h6" gutterBottom>
                            <Box color="primary.main">
                              {this.state.tipopedidodescricao}
                            </Box>
                          </Typography>
                        </CardContent>
                      )}
                    </Card>

                    <TextField
                      id="outlined-name"
                      label="Numero Pedido"
                      //value={values.valor}
                      margin="normal"
                      variant="outlined"
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
                      ></Select>
                    )}
                  </Paper>
                  {this.state.isescolheucliente && (
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
                        className={classes.selectproduto}
                      ></Select>

                      <Typography variant="h6" gutterBottom>
                        <Box color="primary.main">
                          Tabela: R$: {this.state.precotabela}
                        </Box>
                      </Typography>
                      {quantidadecomponent}
                      {descontoitemcomponent}
                      {descontocampanhacomponent}
                      <Divider />

                      <Button
                        variant="outlined"
                        className={classes.outlinedButtom}
                        onClick={this.handleClickAdicionarItemPedido}
                        startIcon={<CloudUploadIcon />}
                      >
                        Adicionar
                      </Button>

                      <div style={{ boxSizing: "content-box" }}>
                        <MUIDataTable
                          title={"Produtos"}
                          className={classes.card}
                          //key={this.state.produtoscarrinho}
                          data={this.state.produtoscarrinho}
                          columns={columns}
                          options={options}
                        />
                      </div>
                    </Paper>
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
                          Duis mollis, est non commodo luctus, nisi erat
                          porttitor ligula.
                        </Typography>
                      </div>
                    </Slide>
                  </Modal>
                </Container>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Wizard));
