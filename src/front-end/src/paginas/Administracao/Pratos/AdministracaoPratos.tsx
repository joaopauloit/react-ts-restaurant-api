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
import { useEffect, useState } from 'react';
import IPrato from '../../../interfaces/IPrato';
import { Link as RouterLink } from 'react-router-dom';
import http from '../../../http';

const AdministracaoPratos = () => {
  const [pratos, setPratos] = useState<IPrato[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    http
      .get<IPrato[]>('pratos/')
      .then((resposta) => {
        setPratos(resposta.data);
      })
      .catch((err) => {});
  }, []);

  const excluir = (restauranteExcluir: IPrato) => {
    http
      .delete(`pratos/${restauranteExcluir.id}/`)
      .then((resposta) => {
        alert(`Prato "${restauranteExcluir.nome}" excluido com sucesso!`);
        const listaRestaurate = pratos.filter(
          (prato) => prato.id !== restauranteExcluir.id
        );
        setPratos([...listaRestaurate]);
      })
      .catch((err) => {
        alert('Ocorreu um erro inesperado ao deletar');
      });
  };

  const pesquisarPratos = () => {
    http
      .get<IPrato[]>('pratos/', {
        params: {
          ordering: 'nome',
          search,
        },
      })
      .then((resposta) => {
        setPratos(resposta.data);
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
          label="Nome do Prato"
          variant="standard"
        />
        <Button
          type="submit"
          variant="outlined"
          onClick={() => pesquisarPratos()}
        >
          Pesquisar
        </Button>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>Imagem</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pratos.map((prato) => (
              <TableRow key={prato.id}>
                <TableCell>{prato.nome}</TableCell>
                <TableCell>{prato.descricao}</TableCell>
                <TableCell>{prato.tag}</TableCell>
                <TableCell>
                  [<a href={prato.imagem} target="_blank" rel="noreferrer">ver imagem</a>]
                </TableCell>
                <TableCell>
                  [
                  <RouterLink to={`/admin/pratos/${prato.id}`}>
                    Editar
                  </RouterLink>
                  ]
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => excluir(prato)}
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

export default AdministracaoPratos;
