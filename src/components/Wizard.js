import React, { Component } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import { withRouter } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
//import Select from '@material-ui/core/Select';
import Back from './common/Back'
import Select from "react-select";
import api from "../services/api";
import Spinner from "../loading";
import swal from "sweetalert";

const qs = require('query-string');
const backgroundShape = require('../images/shape.svg');

const numeral = require('numeral');
numeral.defaultFormat('0,000');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary['A100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    marginTop: 10,
    padding: 20,
    paddingBottom: 200
  },
  grid: {
    margin: `0 ${theme.spacing(2)}px`
  },
  smallContainer: {
    width: '60%'
  },
  bigContainer: {
    width: '80%'
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stepGrid: {
    width: '80%'
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1)
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 42
  },
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  borderColumn: {
    borderBottom: `1px solid ${theme.palette.grey['100']}`,
    paddingBottom: 24,
    marginBottom: 24
  },
  flexBar: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'center'
  }
})

const getSteps = () => {
  return [
    'Tipo Pedido',
    'Cliente',
    'Frete',
    'Pagamento',
    'Itens',
    'Confirma'
  ];
}

class Wizard extends Component {

  constructor(props) {
    super(props);
  this.state = {
    activeStep: 0,
    receivingAccount: 'Home Account',
    repaimentAccount: 'Saving Account',
    termsChecked: false,
    labelWidth: 0,
     cod_cliente: "",
       tab_preco: "",
       cod_tp_pedido: "",
       cod_pagamento: "",
       cod_frete: "",
       produtos: [],
       clientes: [],
       tipo_pedido: [{
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
       frete: [{
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
  }
}

  async componentDidMount() {
    let dadosusuario = await this.lerValores("USUARIO");
    this.setState({
      dadosusuariologado: JSON.parse(dadosusuario)
    });
    
    
  }

  lerValores = async valor => await localStorage.getItem(valor);

   cargaclientes = async () => {
     this.setState({
       mensagemloader: "Carregamento Clientes",
       loading: true
     });

     const response = await api.post(
       "http://localhost:4000/meusclientes", {
         cod_representante: this.state.dadosusuariologado.codrepresentante
       }, {}
     );

     this.setState({
       clientes: response.data.ttRetorno,
       loading: false
     });
     //this.handleClose();
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

  cargaitens = async cliente => {
    this.setState({
      mensagemloader: "Carregamento Itens da Tabela de Preço"
    });

    const response = await api.post(
      "http://localhost:4000/itemvenda", {
        tabpreco: cliente
      }, {
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
      "http://localhost:4000/formapagamento", {
        cod_representante: cliente
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    this.setState({
      pagamento: response.data.ttRetorno
    });
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTerms = event => {
    this.setState({ termsChecked: event.target.checked });
  };

  stepActions() {
    if(this.state.activeStep === 3) {
      return 'Accept';
    }
    if(this.state.activeStep === 4) {
      return 'Enviar';
    }
    if(this.state.activeStep === 5) {
      return 'Enviar Pedido';
    }
    return 'Avançar';
  }

  goToDashboard = event => {
    const queryString = this.props.location.search

    this.props.history.push({
      pathname: '/dashboard',
      search: queryString
    })
  }

  render() {

    const { classes } = this.props;
    const queryString = this.props.location.search
    const parsed = queryString ? qs.parse(queryString) : {}
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Grid container justify="center">
            < Spinner isFetching = {
              this.state.loading
            }
            color = "#5A6AAA" / >
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <Back />
                <div className={classes.stepContainer}>
                  <div className={classes.bigContainer}>
                    <Stepper classes={{root: classes.stepper}} activeStep={activeStep} alternativeLabel>
                      {steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  { activeStep === 0 && (
                  <div className={classes.bigContainer}>
                    <Paper className={classes.paper}>
                      <div className={classes.topInfo}>
                        <div>
                          <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                            Escolha o tipo do pedido abaixo
                          </Typography>
                         </div>
                        <div>
                        <Button variant="outlined" size="large" className={classes.outlinedButtom}>
                          Ultimos Pedidos
                        </Button>
                        </div>
                      </div>
                      <Grid item container xs={12}>
                        <Grid item xs={12}>
                             <Typography style = {
                               {
                                 textTransform: 'uppercase',
                                 marginBottom: 20
                               }
                             }
                             color = 'secondary'
                             gutterBottom >
                               Tipo </Typography>
                           <FormControl variant="outlined" className={classes.formControl}>
                              <Select
                                onChange={this.handleTipoPedido}
                                options={this.state.tipo_pedido}
                                isLoading={this.state.loading}
                                isDisabled={this.state.temproduto}
                              ></Select>
                          
                          </FormControl>
                         
                        </Grid>
                       
                      </Grid>
                    </Paper>
                    </div>
                  )}
                  { activeStep === 1 && (
                  <div className={classes.smallContainer}>
                    <Paper className={classes.paper}>
                      <div>
                        <div style={{marginBottom: 32}}>
                          <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                            Escoha o Cliente
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Selecione o cliente para qual o pedido será enviado
                          </Typography>
                        </div>
                        <div>
                          <Typography style={{textTransform: 'uppercase', marginBottom: 20}} color='secondary' gutterBottom>
                            Cliente
                          </Typography>
                          <FormControl variant="outlined" className={classes.formControl}>
                            <Select
                            onChange={this.handleCliente}
                            options={this.state.clientes}
                            isDisabled={this.state.temproduto}
                          ></Select>
                          </FormControl>
                        </div>
                      </div>
                    </Paper>
                    </div>
                  )}
                  { activeStep === 2 && (
                  <div className={classes.bigContainer}>
                    <Paper className={classes.paper}>
                      <div className={classes.topInfo}>
                        <div>
                          <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                            Details
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            We need some details about any information
                          </Typography>
                        </div>
                        <div>
                          <Button variant="outlined" size="large" className={classes.outlinedButtom}>
                            Edit
                          </Button>
                        </div>
                      </div>
                      <div className={classes.borderColumn}>
                        <Grid item container xs={12} style={{marginBottom: 32}}>
                          <Grid item xs={6}>
                            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                              Amount
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                              { parsed ? numeral(parsed.amount).format() : '75,000'} DKK
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                              Total fees
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                              0 DKK
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item container xs={12}>
                          <Grid item xs={6}>
                            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                              Total price
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                              { parsed ? numeral(parsed.interest).format() : '6,600'} USD
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                              Total cost
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                              { parsed ? numeral(parsed.cost).format() : '81,600'} USD
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                      <Grid item container xs={12}>
                        <Grid item container xs={12} style={{marginBottom: 32}}>
                          <Grid item xs={6}>
                            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                              How often
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                              Once a month
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                            When to start
                          </Typography>
                          <Typography variant="h5" gutterBottom>
                            01 February 2019
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                            When it ends?
                          </Typography>
                          <Typography variant="h5" gutterBottom>
                            01 May 2019
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item container xs={12} style={{marginTop: 24}}>
                        <Grid item xs={6}>
                          <Typography style={{textTransform: 'uppercase', marginBottom: 20}} color='secondary' gutterBottom>
                            Destination account
                          </Typography>
                          <FormControl variant="outlined" className={classes.formControl}>
                            <Select
                              value={this.state.repaimentAccount}
                              onChange={this.handleChange}
                              input={
                                <OutlinedInput
                                  labelWidth={this.state.labelWidth}
                                  name="repaimentAccount"
                                />
                              }
                            >
                              <MenuItem value="">
                                <em></em>
                              </MenuItem>
                              <MenuItem value={'0297 00988200918'}>Account one</MenuItem>
                              <MenuItem value={'0235 00235233332'}>Account two</MenuItem>
                              <MenuItem value={'1256 00864222212'}>Other account</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Paper>
                    </div>
                  )}
                  { activeStep === 3 && (
                    <div className={classes.bigContainer}>
                      <Paper className={classes.paper}>
                        <div style={{marginBottom: 24}}>
                          <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                            Terms & Conditions
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Please read through and accept the terms & conditions
                          </Typography>
                        </div>
                        <div style={{ height: 330, padding: 16, border: '2px solid #ccc', borderRadius: '3px', overflowY: 'scroll' }}>
                          <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                            1. Your agreement
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                          By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.

PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
                          </Typography>
                          <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                            2. Privacy
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.
                            By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.

PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
                          </Typography>
                        </div>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.termsChecked}
                                onChange={this.handleTerms}
                                value='check'
                              />
                            }
                            label="I have read and understood the terms & conditions"
                          />
                        </FormGroup>
                      </Paper>
                    </div>
                  )}
                  { activeStep === 4 && (
                  <div className={classes.smallContainer}>
                    <Paper className={classes.paper}>
                      <Grid item container xs={12}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" style={{fontWeight: 'bold'}} gutterBottom>
                            Sign & confirm
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Sign and confirm your agreement
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                    </div>
                  )}
                  { (activeStep === 5 || activeStep === 6) && (
                  <div className={classes.smallContainer}>
                    <Paper className={classes.paper}>
                      <Grid item container xs={12}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            Congratulations <span role="img" aria-label="conrats emoji">🎉</span>
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            We have now a positive response
                          </Typography>
                          <Button fullWidth variant='outlined'>
                            Download the service invoice or whatever
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                    </div>
                  )}
                  <div className={classes.flexBar}>
                    { activeStep !== 5 && (
                      <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.backButton}
                      size='large'
                      >
                        Voltar
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={activeStep !== 5 ? this.handleNext : this.goToDashboard}
                      size='large'
                      disabled={this.state.activeStep === 3 && !this.state.termsChecked}
                    >
                      {this.stepActions()}
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Wizard));
