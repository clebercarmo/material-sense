import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Form, Container } from "./styles";
import Logo from "../../images/fundo.png";
import api from "../../services/api";
import { login } from "../../services/auth";
import Spinner from "../../loading";
import swal from "sweetalert";

class SignIn extends Component {
  state = {
    usuario: "",
    senha: "",
    error: "",
    loading: false
  };

  async componentDidMount() {
    this.apagaTodosValores();
  }

  handleSignIn = async e => {
    e.preventDefault();
    const { usuario, senha } = this.state;
    if (!usuario || !senha) {
      this.setState({
        error: "Preencha usuário e senha para continuar!"
      });
    } else {
      try {
        this.setState({
          loading: true
        });

        const response = await api.post(
          "http://localhost:4000/api-login",
          {
            usuario,
            senha
          },
          {
            proxyHeaders: false,
            credentials: false
          }
        );

        this.setState({
          loading: false
        });
        if (response.data.ttRetorno[0].resultado === "nok") {
          swal("Erro Login!", "Usuário ou senha errada!", "error");
          this.setState({
            error: "Usuário ou senha errada"
          });
        } else {
          //console.log(response.data.ttRetorno[0]);
          login(response.data.ttRetorno[0].codrepresentante);
          localStorage.setItem(
            "USUARIO",
            JSON.stringify(response.data.ttRetorno[0])
          );
          this.props.history.push("/dashboard");
        }
      } catch (err) {
        this.setState({
          error: "Problemas de conexão com o Servidor."
        });
      }
    }
  };

  apagaTodosValores = async () => await localStorage.clear();

  render() {
    return (
      <Container>
        <Spinner isFetching={this.state.loading} color="#5A6AAA" />
        <Form onSubmit={this.handleSignIn}>
          <img src={Logo} alt="App Ingleza" />
          
          {this.state.error && <p>{this.state.error}</p>}
          <input
            type="text"
            placeholder="Usuario"
            onChange={e =>
              this.setState({
                usuario: e.target.value
              })
            }
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={e =>
              this.setState({
                senha: e.target.value
              })
            }
          />
          <button type="submit"> Entrar </button>
        </Form>
      </Container>
    );
  }
}

export default withRouter(SignIn);
