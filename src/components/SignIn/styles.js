import styled from "styled-components";

export const Container = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #064F73;
`;

export const Imagem = styled.img `
  width: 2000 px;
  height: 80px;
`;

export const Form = styled.form `
  width: 400px;
  background: #064F73;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 300px;
    margin: 10px 0 15px;
  }
  p {
    color: #ffff;
    margin-bottom: 15px;
    border: 1px solid #ffff;
    padding: 10px;
    width: 90%;
    text-align: center;
  }
  input {
    flex: 1;
    height: 46px;
    margin-bottom: 15px;
    padding: 15px 12px;
    font-size: 16px;
    width: 90%;
    border: 1px solid #ddd;
    &::placeholder {
      color: #999;
    }
  }
  button {
    font-size: 20px;
    background: #046952;
    color: #ffff;
    height: 56px;
    border: 0;
    border-radius: 5px;
    width: 98%;
  }
  hr {
    margin: 20px 0;
    border: none;
    border-bottom: 1px solid #cdcdcd;
    width: 100%;
  }
  a {
    font-size: 16;
    font-weight: bold;
    color: #ffff;
    text-decoration: none;
  }
`;
