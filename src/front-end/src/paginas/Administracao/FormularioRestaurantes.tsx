import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const FormularioRestaurante = () => {
  const [nomeRestaurante, setNomeRestaurante] = useState('');
  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    // console.log('Preciso enviar dados para api: ');
    // console.log(nomeRestaurante)

    axios
      .post('http://localhost:8000/api/v2/restaurantes/', {
        nome: nomeRestaurante,
      })
      .then(() => {
        alert('Restaurante cadastrado com sucesso!');
      })
      .catch(() => {
        alert('Ocorreu um erro ao cadastradar restaurante!');
      });
  };
  return (
    <form
      onSubmit={(evento) => {
        aoSubmeterForm(evento);
      }}
    >
      <TextField
        value={nomeRestaurante}
        onChange={(evento) => setNomeRestaurante(evento.target.value)}
        id="standard-basic"
        label="Nome do Restaurante"
        variant="standard"
      />
      <Button type="submit" variant="outlined">
        Salvar
      </Button>
    </form>
  );
};

export default FormularioRestaurante;
