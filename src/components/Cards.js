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
import { parseISO, format, formatRelative, formatDistance } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

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
    width: 1000
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
      "https://inglezaonline.com.br/microservices/controle-vendas",
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
        name: "dt_implant",
        label: "Data",
        options: {
          filter: true
        }
      },
      {
        name: "cod_cliente",
        label: "Codigo",
        options: {
          filter: true
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
        name: "nrpedcli",
        label: "Pedido",
        options: {
          filter: true
        }
      },

      {
        name: "forma_pagamento",
        label: "Pagamento",
        options: {
          filter: true
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
              spacing={24}
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

                <Grid item xs={12}>
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
                </Grid>
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
