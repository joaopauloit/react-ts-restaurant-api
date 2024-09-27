import {
  Button,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import IRestaurante from '../../../interfaces/IRestaurante';
import { Link } from 'react-router-dom';

const AdministracaoRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    axios
      .get<IRestaurante[]>('http://localhost:8000/api/v2/restaurantes/')
      .then((resposta) => {
        setRestaurantes(resposta.data);
      })
      .catch((err) => {});
  }, []);

  const excluir = (restauranteExcluir: IRestaurante) => {
    axios
      .delete(
        `http://localhost:8000/api/v2/restaurantes/${restauranteExcluir.id}/`
      )
      .then((resposta) => {
        alert(`Restaurante "${restauranteExcluir.nome}" excluido com sucesso!`);
        const listaRestaurate = restaurantes.filter(
          (restaurante) => restaurante.id !== restauranteExcluir.id
        );
        setRestaurantes([...listaRestaurate]);
      })
      .catch((err) => {
        alert('Ocorreu um erro inesperado ao deletar');
      });
  };

  const pesquisarRestaurantes = () => {
    axios
      .get<IRestaurante[]>('http://localhost:8000/api/v2/restaurantes/', {
        params: {
          ordering: 'nome',
          search,
        },
      })
      .then((resposta) => {
        setRestaurantes(resposta.data);
      })
      .catch((err) => {});
  };

  return (
    <>
      <FormControl>
        <TextField
          value={search}
          onChange={(evento) => setSearch(evento.target.value)}
          id="standard-basic"
          label="Nome do Restaurante"
          variant="standard"
        />
        <Button
          type="submit"
          variant="outlined"
          onClick={() => pesquisarRestaurantes()}
        >
          Pesquisar
        </Button>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurantes.map((restaurante) => (
              <TableRow key={restaurante.id}>
                <TableCell>{restaurante.nome}</TableCell>
                <TableCell>
                  [
                  <Link to={`/admin/restaurantes/${restaurante.id}`}>
                    Editar
                  </Link>
                  ]
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => excluir(restaurante)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AdministracaoRestaurantes;
