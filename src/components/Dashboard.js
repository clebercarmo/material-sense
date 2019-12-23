import React,  { Component } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import { withRouter, Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import SimpleLineChart from './SimpleLineChart';
import Months from './common/Months';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Loading from './common/Loading';
import MUIDataTable from "mui-datatables";
import api from "../services/api";
import Spinner from "../loading";

import Topbar from './Topbar';

const numeral = require('numeral');
numeral.defaultFormat('0,000');

const backgroundShape = require('../images/shape.svg');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    margin: `0 ${theme.spacing(2)}px`,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    }
  },
  loadingState: {
    opacity: 0.05
  },
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2)
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1)
  },
  actionButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1),
    width: 152,
    height: 36
  },
  blockCenter: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  block: {
    padding: theme.spacing(2),
  },
  loanAvatar: {
    display: 'inline-block',
    verticalAlign: 'center',
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  interestAvatar: {
    display: 'inline-block',
    verticalAlign: 'center',
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light
  },
  inlining: {
    display: 'inline-block',
    marginRight: 10
  },
  buttonBar: {
    display: 'flex'
  },
  noBorder: {
    borderBottomStyle: 'hidden'
  },
  mainBadge: {
    textAlign: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  }
});

const monthRange = Months;

class Dashboard extends Component {
  state = {
    loading: true,
    amount: 15000,
    period: 3,
    start: 0,
    monthlyInterest: 0,
    totalInterest: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    data: [],
    dadosusuariologado: null
  };

  lerValores = async valor => await localStorage.getItem(valor);

  ultimospedidos = async () => {
    this.setState({
      loading: true
    });

    const response = await api.post(
      "http://localhost:4000/pedido",
      { cod_representante: this.state.dadosusuariologado.codrepresentante },
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
      //aprovados: response.data.ttRetorno[0].aprovadospie,
      //aguardandoatendimento: response.data.ttRetorno[0].aquardandoatendimentopie
    });
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

  async componentDidMount() {
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
      amount,
      period,
      start,
      monthlyPayment,
      monthlyInterest,
      data,
      loading
    } = this.state;
    const currentPath = this.props.location.pathname;

    const options = {
      filter: true,
      filterType: "dropdown",
      responsive: "stacked",
      onRowClick: (rowData, rowState) => {
        console.log(rowData, rowState);
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
        label: "Situação",
       
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
              spacing={24}
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
                      variant="outlined"
                      className={classes.outlinedButtom}
                    >
                      Relatorio de Vendas
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
                            Type
                          </Typography>
                          <Typography
                            className={classes.inlining}
                            color="secondary"
                            variant="h6"
                            gutterBottom
                          >
                            {numeral(monthlyPayment).format()} units
                          </Typography>
                        </div>
                        <div className={classes.inlining}>
                          <Avatar className={classes.interestAvatar}></Avatar>
                          <Typography
                            className={classes.inlining}
                            variant="subtitle2"
                            gutterBottom
                          >
                            Othe type
                          </Typography>
                          <Typography
                            className={classes.inlining}
                            color="secondary"
                            variant="h6"
                            gutterBottom
                          >
                            {numeral(monthlyInterest).format()} units
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <SimpleLineChart data={data} />
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
                          8 pedidos com pendências
                        </Typography>
                      </div>
                      <div className={classes.buttonBar}>
                        <Button
                          to={{ pathname: "/dashboard", search: `?type=save` }}
                          component={Link}
                          variant="outlined"
                          className={classes.actionButtom}
                        >
                          Cancelar
                        </Button>
                        <Button
                          to={{ pathname: "/cards", search: `?type=apply` }}
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
                  className={classes.paper}
                  style={{ position: "relative" }}
                >
                  <Loading loading={loading} />
                  <div className={loading ? classes.loadingState : ""}>
                    <MUIDataTable
                      title={"Meus Ultimos Pedidos"}
                      className={classes.card}
                      data={this.state.pedidos}
                      columns={columns}
                      options={options}
                    />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Dashboard));
