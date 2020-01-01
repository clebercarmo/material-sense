import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
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

const logo = require("../../images/logo.svg");



const styles = theme => ({
  container: {
    maxWidth: 600,
    flexGrow: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
    loadingState: {
      opacity: 0.05
    },
  stepsContainer: {
    marginLeft: 72,
    textAlign: "left",
    marginTop: 20,
    height: 65
  },
  bottomMargin: {
    marginBottom: theme.spacing(2)
  }
});

class SwipeDialog extends Component {
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
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper} style={{ position: "relative" }}>
            <Loading loading={loading} />
            <div className={loading ? classes.loadingState : ""}>
              <BaseDialog {...this.props}>
                <div className={classes.container}>
                

                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="right">Data</TableCell>
                          <TableCell align="right">Hora</TableCell>
                          <TableCell align="right">Usuário</TableCell>
                          <TableCell align="right">Proxima Pendencia</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dados.map(row => (
                          <TableRow key={row.hr_alteracao}>
                            <TableCell align="right">
                              {row.dt_alteracao}
                            </TableCell>
                            <TableCell align="right">
                              {row.hr_alteracao}
                            </TableCell>
                            <TableCell align="right">
                              {row.cod_usuario}
                            </TableCell>
                            <TableCell align="right">
                              {row.prox_pendencia}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </BaseDialog>
            </div>
          </Paper>
        </Grid>
      );
    } else {
      return (
       <Grid item xs={12} md={8}>
          <Paper className={classes.paper} style={{ position: "relative" }}>
            <Loading loading={loading} />
            <div className={loading ? classes.loadingState : ""}>
              </div>
              </Paper>
              </Grid>
      );
    }
  }
}

export default withRouter(withStyles(styles)(SwipeDialog));
