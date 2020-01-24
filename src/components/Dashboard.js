import React, {
  Component
} from 'react';
import withStyles from '@material-ui/styles/withStyles';
import {
  withRouter,
  Link
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import SimpleLineChart from './SimpleLineChart';
import Months from './common/Months';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Loading from './common/Loading';
import MUIDataTable from "mui-datatables";
import api from "../services/api";
import Spinner from "../loading";
import Chip from "@material-ui/core/Chip";
import Topbar from './Topbar';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import DoneIcon from "@material-ui/icons/Done";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import SwipeDialog from "./dialogs/SwipeDialog";
const numeral = require('numeral');
numeral.defaultFormat('0,000');

const backgroundShape = require('../images/shape.svg');

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
    width: 1200,
    margin: `0 ${theme.spacing(2)}px`,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  loadingState: {
    opacity: 0.05
  },
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  papermuitables: {
    //padding: theme.spacing(3),
    margin: theme.spacing(2),
    //textAlign: "left",
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2)
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1)
  },
  actionButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1),
    width: 152,
    height: 36
  },
  blockCenter: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  block: {
    padding: theme.spacing(2)
  },
  loanAvatar: {
    display: "inline-block",
    verticalAlign: "center",
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  interestAvatar: {
    display: "inline-block",
    verticalAlign: "center",
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  mainBadge: {
    textAlign: "center",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  }
});

const monthRange = Months;

class Dashboard extends Component {
  state = {
    loading: true,
    learnMoredialog:false,
    Pedidodialog: false,
    amount: 15000,
    period: 3,
    start: 0,
    monthlyInterest: 0,
    totalInterest: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    data: [],
    detalhepedido: [],
    dadosgraficobarras: [],
    listapedidossuspensos: [],
    dadosusuariologado: null,
    aguardando_atendimento: 0,
    assessoria: 0,
    financeiro: 0,
    logistica: 0
  };

  lerValores = async valor => await localStorage.getItem(valor);

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
    
    
    let pedidossuspensos = response.data.ttRetorno.filter(pedido => {
      return pedido.cod_sit_str === "Suspenso";
    });


    let aguardando_atendimento = response.data.ttRetorno.filter(x => {
      return x.proxi_pendencia === "NA";
    }).length;

    let assessoria = response.data.ttRetorno.filter(x => {
      return x.proxi_pendencia === "ASSESSORIA";
    }).length;

     let financeiro = response.data.ttRetorno.filter(x => {
       return x.proxi_pendencia === "FINANCEIRO";
     }).length;

      let logistica = response.data.ttRetorno.filter(x => {
        return x.proxi_pendencia === "LOGISTICA";
      }).length;

    let z = [
      { Name: "Aguadando Atendimento", count: aguardando_atendimento },
      { Name: "Assessoria", count: assessoria },
      {
        Name: "Logistica",
        count: logistica
      },
      {
        Name: "Financeiro",
        count: financeiro
      }
    ];
   


    this.setState({
      loading: false,
      listapedidossuspensos: pedidossuspensos,
      pedidos: response.data.ttRetorno,
      dadosgraficobarras: z,
      assessoria: assessoria,
      logistica: logistica,
      financeiro: financeiro,
      aguardando_atendimento: aguardando_atendimento
      //aprovados: response.data.ttRetorno[0].aprovadospie,
      //aguardandoatendimento: response.data.ttRetorno[0].aquardandoatendimentopie
    });
  };

  detalhepedido = async (cliente, pedido) => {
    this.setState({
      loading: true
    });

    const response = await api.post(
      "https://inglezaonline.com.br/microservices/detalhe-pedido",
      { pedido: pedido, nomeabrev: cliente },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (response.data.ttRetorno !== undefined) {
      this.setState({
        loading: false,
        detalhepedido: response.data.ttRetorno
        //aprovados: response.data.ttRetorno[0].aprovadospie,
        //aguardandoatendimento: response.data.ttRetorno[0].aquardandoatendimentopie
      });
    }else{
       this.setState({
         loading: false
        
       });

    }
    
  };

  openDialog = event => {
    this.setState({ learnMoredialog: true });
  };

  dialogClose = event => {
    this.setState({ learnMoredialog: false });
  };

  

  updateValues() {
    const { amount, period, start } = this.state;
    const monthlyInterest =
      (amount * Math.pow(0.01 * 1.01, period)) / Math.pow(0.01, period - 1);
    const totalInterest = monthlyInterest * (period + start);
    const totalPayment = amount + totalInterest;
    const monthlyPayment =
      period > start ? totalPayment / (period - start) : totalPayment / period;

    const data = Array.from({ length: period + start }, (value, i) => {
      const delayed = i < start;
      return {
        name: monthRange[i],
        Type: delayed ? 0 : Math.ceil(monthlyPayment).toFixed(0),
        OtherType: Math.ceil(monthlyInterest).toFixed(0)
      };
    });

    this.setState({
      monthlyInterest,
      totalInterest,
      totalPayment,
      monthlyPayment,
      data
    });
  }

  apagarValores = async valor => await localStorage.removeItem(valor);
  
  async componentDidMount() {
    await this.apagarValores("itenspedido");
    let dadosusuario = await this.lerValores("USUARIO");
    this.setState({
      dadosusuariologado: JSON.parse(dadosusuario)
    });
    await this.ultimospedidos();
    this.updateValues();
  }

  handleChangeAmount = (event, value) => {
    this.setState({ amount: value, loading: false });
    this.updateValues();
  };

  handleChangePeriod = (event, value) => {
    this.setState({ period: value, loading: false });
    this.updateValues();
  };

  handleChangeStart = (event, value) => {
    this.setState({ start: value, loading: false });
    this.updateValues();
  };

  render() {
    const { classes } = this.props;
    const {
      loading
    } = this.state;
    const currentPath = this.props.location.pathname;

    const opcoesdetalhe = {
      filter: true,
      print: false,
      download: false,
      viewColumns: false,
      selectableRows: "none",
      filterType: "dropdown",
      responsive: "stacked",
      rowsPerPage: 5
    };

    const options = {
      filter: true,
      print: false,
      download: false,
      viewColumns: false,
      selectableRows: 'none',
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
          noMatch: "Você não possui pedidos enviados",
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
        name: "nrpedcli",
        label: "Pedido",
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
        name: "cod_sit_str",
        label: "Situação"
      },
      {
        name: "atendido",
        label: "Atendido",
         options: {
           customBodyRender: (value, tableMeta, updateValue) => { 
             
             if (tableMeta.rowData[3] === "sim"){
              return (
                <Chip
                  label="Sim"
                  color="primary"
                  style={{ backgroundColor: "#04BF33" }}
                />
              );
             }else{
                return (
                  <Chip
                    label="Não"
                    color="primary"
                    style={{ backgroundColor: "#F23005" }}
                  />
                );
             }

           }
         }
      },
      {
        name: "Detalhe",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            
            if (tableMeta.rowData[3] === "sim"){

            return (
              <Chip
                icon={<FindInPageIcon />}
                label="Mais Detalhes"
                clickable
                color="primary"
                style={{ backgroundColor: "#04D9C4" }}
                onClick={() => {
                  this.detalhepedido(
                    tableMeta.rowData[1],
                    tableMeta.rowData[0]
                  );
                  this.dialogClose();
                   this.openDialog();
                   this.setState({
                     detalhepedido: []
                   });
                   

                   /*
                  if (
                    this.state.detalhepedido !== null &&
                    this.state.detalhepedido.length > 0
                  ) {
                    if (this.state.detalhepedido.length === 0) {
                      swal("Alerta", "Pedido ainda não atendido!", "error");
                      this.setState({
                        detalhepedido: null
                      });
                    } else {
                      if (this.state.detalhepedido.length > 0) {
                        console.log(this.state.detalhepedido.length);
                        this.openDialog();
                        this.setState({
                          detalhepedido: []
                        });
                      }
                    }

                    this.setState({
                      detalhepedido: null
                    });
                  } else {
                    swal("Alerta", "Pedido ainda não atendido!", "error");
                    this.setState({
                      detalhepedido: null
                    });
                  }

                  */

                  //data.shift();
                  //this.setState({ data });
                }}
                deleteIcon={<DoneIcon />}
              />
              /*<button
                onClick={() => {
                  
                  
                  console.log(tableMeta.rowData);
                
                  //data.shift();
                  //this.setState({ data });
                }}
              >
                Detalhe
              </button>*/
            );

          }else{
             return (
               <Chip
                 label="Não Disponivel"
                 icon={<NotInterestedIcon/>}
                 color="primary"
                 style={{ backgroundColor: "#F29F05" }}
               />
             );
          }


          }
        }
      }
    ];

   
    const columnsdetalhepedido = [
      {
        name: "dt_alteracao",
        label: "Data",
        options: {
          filter: false
        }
      },
      {
        name: "hr_alteracao",
        label: "Hora",
        options: {
          filter: false
        }
      },
      {
        name: "cod_usuario",
        label: "Usuario",
        options: {
          filter: false
        }
      },
      {
        name: "prox_pendencia",
        label: "Próxima Pendencia",
        options: {
          filter: false
        }
      }
    ];

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
                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>
                      Dashboard
                    </Typography>
                    <Typography variant="body1">
                      Posicionamento de suas vendas.
                    </Typography>
                  </div>
                  <div>
                    <Button
                      to={{ pathname: "/vendadireta/cards", search: `?type=apply` }}
                      variant="outlined"
                      component={Link}
                      className={classes.outlinedButtom}
                    >
                      Relatorio
                    </Button>
                  </div>
                </div>
              </Grid>
              <Grid container spacing={4} justify="center">
                <Grid item xs={12} md={8}>
                  <Paper
                    className={classes.paper}
                    style={{ position: "relative" }}
                  >
                    <Loading loading={loading} />
                    <div className={loading ? classes.loadingState : ""}>
                      <Typography variant="subtitle1" gutterBottom>
                        Situação
                      </Typography>
                      <Typography variant="body1">
                        Detalhe sobre o andamento dos pedidos enviados
                      </Typography>
                      <div style={{ marginTop: 14, marginBottom: 14 }}>
                        <div className={classes.inlining}>
                          <Avatar className={classes.loanAvatar}></Avatar>
                          <Typography
                            className={classes.inlining}
                            variant="subtitle2"
                            gutterBottom
                          >
                            Aguardando Atendimento
                          </Typography>
                          <Typography
                            className={classes.inlining}
                            color="secondary"
                            variant="h6"
                            gutterBottom
                          >
                            {this.state.aguardando_atendimento} 
                          </Typography>
                        </div>
                        <div className={classes.inlining}>
                          <Avatar className={classes.interestAvatar}></Avatar>
                          <Typography
                            className={classes.inlining}
                            variant="subtitle2"
                            gutterBottom
                          >
                            Assessoria
                          </Typography>
                          <Typography
                            className={classes.inlining}
                            color="secondary"
                            variant="h6"
                            gutterBottom
                          >
                            {this.state.assessoria} 
                          </Typography>
                        </div>
                        <div className={classes.inlining}>
                          <Avatar className={classes.interestAvatar}></Avatar>
                          <Typography
                            className={classes.inlining}
                            variant="subtitle2"
                            gutterBottom
                          >
                            Financeiro
                          </Typography>
                          <Typography
                            className={classes.inlining}
                            color="secondary"
                            variant="h6"
                            gutterBottom
                          >
                            {
                              this.state.financeiro
                            }
                          </Typography>
                        </div>
                        <div className={classes.inlining}>
                          <Avatar className={classes.interestAvatar}></Avatar>
                          <Typography
                            className={classes.inlining}
                            variant="subtitle2"
                            gutterBottom
                          >
                            Logistica
                          </Typography>
                          <Typography
                            className={classes.inlining}
                            color="secondary"
                            variant="h6"
                            gutterBottom
                          >
                             {
                              this.state.logistica
                            }
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <SimpleLineChart data={this.state.dadosgraficobarras} />
                      </div>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    className={classes.paper}
                    style={{ position: "relative" }}
                  >
                    <Loading loading={loading} />
                    <div className={loading ? classes.loadingState : ""}>
                      <Typography variant="subtitle1" gutterBottom>
                        Notificações
                      </Typography>
                      <div className={classes.mainBadge}>
                        <VerifiedUserIcon
                          style={{ fontSize: 72 }}
                          fontSize={"large"}
                          color={"secondary"}
                        />
                        <Typography
                          variant="h5"
                          color={"secondary"}
                          gutterBottom
                        >
                          {this.state.listapedidossuspensos.length} Pendências
                        </Typography>
                      </div>
                      <div className={classes.buttonBar}>
                        <Button
                          to={{ pathname: "/vendadireta/dashboard", search: `?type=save` }}
                          component={Link}
                          variant="outlined"
                          className={classes.actionButtom}
                        >
                          Cancelar
                        </Button>
                        <Button
                          to={{ pathname: "/vendadireta/cards", search: `?type=apply` }}
                          component={Link}
                          color="primary"
                          variant="contained"
                          className={classes.actionButtom}
                        >
                          Verificar
                        </Button>
                      </div>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  //className={classes.papermuitables}
                  style={{ position: "relative" }}
                >
                  <Loading loading={loading} />
                  <div className={loading ? classes.loadingState : ""}>
                    <div style={{ boxSizing: "content-box" }}>
                      <MUIDataTable
                        title={"Meus Ultimos Pedidos"}
                        //className={classes.card}
                        data={this.state.pedidos}
                        columns={columns}
                        options={options}
                      />
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <SwipeDialog
            open={this.state.learnMoredialog}
            onClose={this.dialogClose}
            dados={this.state.detalhepedido}
            colunas={columnsdetalhepedido}
            opcoes={opcoesdetalhe}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Dashboard));
