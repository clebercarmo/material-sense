import "date-fns";

import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import ptLocale from "date-fns/locale/pt-BR";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import ButtonBarEnviar from "../buttons/ButtonBarEnviar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

export default function FaixaDatas(props) {
  const { dtinicio, dtfim, click } = props;

  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDataInicio = date => {
    props.dtinicio(date);

    setSelectedDate(date);
  };

  const handleDataFim = date => {
    props.dtfim(date);

    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
      <Typography
        style={{ textTransform: "uppercase" }}
        color="secondary"
        gutterBottom
      >
        DATA
      </Typography>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Inicio"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDataInicio}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Fim"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDataFim}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
        <ButtonBarEnviar click={props.click}> </ButtonBarEnviar>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}