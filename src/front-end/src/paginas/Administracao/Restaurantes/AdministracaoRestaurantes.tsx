import {
  AppBar,
  Box,
  Button,
  Container,
  FormControl,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import IRestaurante from '../../../interfaces/IRestaurante';
import { Link as RouterLink } from 'react-router-dom';
import http from '../../../http';

const AdministracaoRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    http
      .get<IRestaurante[]>('restaurantes/')
      .then((resposta) => {
        setRestaurantes(resposta.data);
      })
      .catch((err) => {});
  }, []);

  const excluir = (restauranteExcluir: IRestaurante) => {
    http
      .delete(`restaurantes/${restauranteExcluir.id}/`)
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
    http
      .get<IRestaurante[]>('restaurantes/', {
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
                  <RouterLink to={`/admin/restaurantes/${restaurante.id}`}>
                    Editar
                  </RouterLink>
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
