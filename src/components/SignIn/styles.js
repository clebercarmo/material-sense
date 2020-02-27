import styled from "styled-components";

export const Container = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #FFFFF;
`;

export const Imagem = styled.img `
  width: 2000 px;
  height: 80px;
`;

export const Form = styled.form `
  width: 400px;
  background: #FFFFF;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 150px;
    margin: 10px 20px 30px 20px;
  }
  p {
    color: #000313;
    margin-bottom: 15px;
    border: 1px solid #000313;
    padding: 10px;
    width: 90%;
    text-align: center;
  }
  input {
    flex: 1;
    height: 46px;
    margin-bottom: 15px;
    padding: 15px 12px;
    font-size: 18px;
    width: 90%;
    border: 1px solid #ddd;
    &::placeholder {
      color: #999;
    }
  }
  button {
    font-size: 20px;
    background: #293577;
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
