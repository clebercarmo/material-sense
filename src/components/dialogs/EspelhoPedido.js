import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import withStyles from "@material-ui/styles/withStyles";
import BaseDialog from "./BaseDialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Loading from "../common/Loading";

const styles = theme => ({
  container: {
    flexGrow: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  loadingState: {
    opacity: 0.05
  },
  bottomMargin: {
    marginBottom: theme.spacing(2)
  }
});

class EspelhoPedido extends Component {
  state = {
    activeStep: 0
  };

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1
    }));
  };

  handleStepChange = activeStep => {
    this.setState({ activeStep });
  };

  render() {
    const { classes, dados, loading } = this.props;

    if (dados !== null) {
      return (
        <Grid item xl={12} >
          
            <Loading loading={loading} />
            
              <BaseDialog {...this.props}>
                
                  <TableContainer component={Paper}>
                    <Table  aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="right">Código</TableCell>
                          <TableCell align="right">Item</TableCell>
                          <TableCell align="right">Quantidade</TableCell>
                          <TableCell align="right">Valor Tabela</TableCell>
                          <TableCell align="right">Desconto</TableCell>
                          <TableCell align="right"> Valor Liquido </TableCell>
                          <TableCell align="right"> IPI </TableCell>
                          <TableCell align="right"> ST </TableCell>
                          <TableCell align="right"> Valor Total </TableCell>
                          <TableCell align="right"> Peso Bruto </TableCell>
                          <TableCell align="right"> Volumes </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dados.map(row => (
                          <TableRow key={row.it_codigo}>
                            <TableCell align="right">{row.it_codigo}</TableCell>
                            <TableCell align="right">{row.item}</TableCell>
                            <TableCell align="right">
                              {row.quantidade}
                            </TableCell>
                            <TableCell align="right">
                              R$ {row.prc_tabela}
                            </TableCell>
                            <TableCell align="right">
                              {row.desconto_item} %
                            </TableCell>
                            <TableCell align="right">
                              R$ {row.prc_liquido}
                            </TableCell>
                            <TableCell align="right">R$ {row.val_ipi}</TableCell>
                            <TableCell align="right">R$ {row.val_st}</TableCell>
                            <TableCell align="right">R$ {row.val_total}</TableCell>
                            <TableCell align="right">
                              {row.peso_bruto} KG
                            </TableCell>
                            <TableCell align="right">{row.volumes} UN</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                
              </BaseDialog>
            
          
        </Grid>
      );
    } else {
      return (
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper} style={{ position: "relative" }}>
            <Loading loading={loading} />
            <div className={loading ? classes.loadingState : ""}></div>
          </Paper>
        </Grid>
      );
    }
  }
}

export default withRouter(withStyles(styles)(EspelhoPedido));
