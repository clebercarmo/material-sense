import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import MUIDataTable from "mui-datatables";
import Topbar from "./Topbar";
import SectionHeader from "./typo/SectionHeader";
import FaixaDatas from "./faixadata/FaixaDatas";
import Paper from "@material-ui/core/Paper";
import Spinner from "../loading";
import api from "../services/api";
//import { parseISO, format, formatRelative, formatDistance } from "date-fns";
import { format } from "date-fns";
//import { zonedTimeToUtc } from "date-fns-tz";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import DoneIcon from "@material-ui/icons/Done";
import Chip from "@material-ui/core/Chip";

const backgroundShape = require("../images/shape.svg");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["A500"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 20,
    padding: 20,
    paddingBottom: 200
  },
  grid: {
    width: 1400,
    margin: `0 ${theme.spacing(2)}px`,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  avatar: {
    margin: 10,
    backgroundColor: theme.palette.grey["200"],
    color: theme.palette.text.primary
  },
  avatarContainer: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      marginBottom: theme.spacing(4)
    }
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  },
  baseline: {
    alignSelf: "baseline",
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      alignItems: "center",
      width: "100%",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginLeft: 0
    }
  },
  inline: {
    display: "inline-block",
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0
    }
  },
  inlineRight: {
    width: "30%",
    textAlign: "right",
    marginLeft: 50,
    alignSelf: "flex-end",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: 0,
      textAlign: "center"
    }
  },
  backButton: {
    marginRight: theme.spacing(2)
  }
});

class Cards extends Component {
  state = {
    datainicio: null,
    datafim: null,
    dadosusuariologado: null,
    loading: false,
    pedidos: []
  };

  async componentDidMount() {
    let dadosusuario = await this.lerValores("USUARIO");
    this.setState({
      dadosusuariologado: JSON.parse(dadosusuario)
    });
  }

  formatadata = data => format(data, "dd'/'MM'/'yy");

  calbackdatainicio = datainicio => {
    //console.log(datainicio);
    //const znDate = zonedTimeToUtc(parseISO(datainicio), "America/Sao_Paulo");
    let resultado = this.formatadata(datainicio);
    console.log(resultado);
    this.setState({
      datainicio: resultado
    });
  };

  calbackdatafim = datafim => {
    let resultado2 = this.formatadata(datafim);
    this.setState({
      datafim: resultado2
    });
  };

  calbackenviarsolicitacao = evento => {
    this.controlevendas();
  };

  lerValores = async valor => await localStorage.getItem(valor);

  controlevendas = async () => {
    this.setState({
      loading: true
    });

    const response = await api.post(
      "http://localhost:4000/microservices/controle-vendas",
      {
        codrepres: this.state.dadosusuariologado.codrepresentante,
        dtinicio: this.state.datainicio,
        dtfim: this.state.datafim
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

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    console.log(this.state.datafim);

    const columns = [
      {
        name: "nrpedcli",
        label: "Pedido",
        options: {
          filter: true
        }
      },
      {
        name: "tipo",
        label: "Tipo",
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            console.log(tableMeta);
            if (tableMeta.rowData[1] === "V") {
              return (
                <Chip
                  label="Venda"
                  color="primary"
                  style={{ backgroundColor: "#04D9C4" }}
                />
              );
            }

            if (tableMeta.rowData[1] === "B") {
              return (
                <Chip
                  label="Bonificação"
                  color="primary"
                  style={{ backgroundColor: "#04D9C4" }}
                />
              );
            }

            if (tableMeta.rowData[1] === "C") {
              return (
                <Chip
                  label="Consumo"
                  color="primary"
                  style={{ backgroundColor: "#04D9C4" }}
                />
              );
            }

            if (tableMeta.rowData[1] === "I") {
              return (
                <Chip
                  label="Industria"
                  color="primary"
                  style={{ backgroundColor: "#04D9C4" }}
                />
              );
            }
          }
        }
      },
      {
        name: "dt_implant",
        label: "Implantação",
        options: {
          filter: false
        }
      },
      {
        name: "dt_entrega",
        label: "Entrega",
        options: {
          filter: false
        }
      },
      {
        name: "cod_cliente",
        label: "Codigo",
        options: {
          filter: false
        }
      },
      {
        name: "cliente",
        label: "Cliente",
        options: {
          filter: true
        }
      },

      {
        name: "forma_pagamento",
        label: "Pagamento",
        options: {
          filter: false
        }
      },
      {
        name: "desconto_total",
        label: "Desc. Total",
        options: {
          filter: false
        }
      },
      {
        name: "vl_tot_ped",
        label: "Total",
        options: {
          filter: false
        }
      },
      {
        name: "valor_liquido",
        label: "Liquido",
        options: {
          filter: false
        }
      },
      {
        name: "pesobruto",
        label: "Peso",
        options: {
          filter: false
        }
      },
      {
        name: "volumes",
        label: "Volumes",
        options: {
          filter: false
        }
      },
      {
        name: "cod_sit_str",
        label: " ",
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <Chip
                label={tableMeta.rowData[12]}
                color="primary"
                style={{ backgroundColor: "#04D9C4" }}
              />
            );
          }
        }
      },
      {
        name: " ",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <Chip
                icon={<ShoppingCartIcon />}
                //label="Itens"
                clickable
                color="primary"
                style={{ backgroundColor: "#04D9C4" }}
                onClick={() => {
                  alert("Clicado");
                }}
                deleteIcon={<DoneIcon />}
              />
            );
          }
        }
      }
    ];

    const options = {
      filter: true,
      print: false,
      download: true,
      viewColumns: false,
      selectableRows: "none",
      filterType: "dropdown",
      responsive: "stacked",
      rowsPerPage: 10,
      /*onRowClick: (rowData, rowState) => {
        console.log(rowData, rowState);
      },*/
      /*customRowRender: data => {
          const [nrpedcli, cliente, cod_sit_str] = data;
           return (
             <tr key={nrpedcli}>
               <td colSpan={4} >
                 {nrpedcli}
               </td>
               <td colSpan={4}>
                 {cliente}
               </td>
               <td colSpan={4} >
                 {cod_sit_str}
               </td>
             </tr>
           );

       },*/

      textLabels: {
        pagination: {
          next: "Próximo",
          previous: "Anterior",
          rowsPerPage: "linhas por Pagina:",
          displayRows: "de"
        },
        body: {
          noMatch: "Favor selecionar o periodo desejado",
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

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
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
                <SectionHeader
                  title="Ultimos Pedidos"
                  subtitle="Ultimos pedidos enviados, para melhor detalhe favor usar o filtro."
                />

                <Paper
                  className={classes.paper}
                  style={{ position: "relative" }}
                >
                  <FaixaDatas
                    dtinicio={this.calbackdatainicio}
                    dtfim={this.calbackdatafim}
                    click={this.calbackenviarsolicitacao}
                  />
                </Paper>

                <Grid item xs={12}>
                  <Paper
                    //className={classes.papermuitables}
                    style={{ position: "relative" }}
                  >
                    <div style={{ boxSizing: "content-box" }}>
                      <MUIDataTable
                        title={"Pedidos"}
                        //className={classes.card}
                        data={this.state.pedidos}
                        columns={columns}
                        options={options}
                      />
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Cards);
