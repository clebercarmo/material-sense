import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import ButtonBarEnviar from "../buttons/ButtonBarEnviar";
import Typography from "@material-ui/core/Typography";

export default function FaixaDatas() {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleDataInicio = date => {
    setSelectedDate(date);
  };

    const handleDataFim = date => {
      setSelectedDate(date);
    };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
        <ButtonBarEnviar></ButtonBarEnviar>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
