import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import IPrato from '../../../interfaces/IPrato';
import http from '../../../http';
import { ITag } from '../../../interfaces/ITag';
import IRestaurante from '../../../interfaces/IRestaurante';

const FormularioPrato = () => {
  const parametros = useParams();
  const [nomePrato, setNomePrato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<ITag[]>([]);
  const [restaurante, setRestaurante] = useState('');
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [imagem, setImagem] = useState<File | null>(null);

  useEffect(() => {
    http
      .get<{ tags: ITag[] }>('tags/')
      .then((resposta) => setTags(resposta.data.tags));
    http
      .get<IRestaurante[]>('restaurantes/')
      .then((resposta) => setRestaurantes(resposta.data));
  }, []);

  useEffect(() => {
    if (parametros.id) {
      http
        .get<IPrato>(`pratos/${parametros.id}/`)
        .then((resposta) => {
          setNomePrato(resposta.data.nome);
          setDescricao(resposta.data.descricao);
          setTag(resposta.data.tag);
          setRestaurante(resposta.data.restaurante.toString());
        })
        .catch(() => {
          alert(`Ocorreu um erro ao recuperar prato ID ${parametros.id}!`);
        });
    }
  }, [parametros]);

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData();
    formData.append('nome', nomePrato);
    formData.append('descricao', descricao);
    formData.append('tag', tag);
    formData.append('restaurante', restaurante);

    if (imagem) {
      formData.append('imagem', imagem);
    }

    if (parametros.id) {
      http
        // .put(`pratos/${parametros.id}/`, {
        //   nome: nomePrato,
        // })
        .request({
          url: `pratos/${parametros.id}/`,
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
        })
        .then(() => {
          alert('Prato atualizado com sucesso!');
        })
        .catch(() => {
          alert('Ocorreu um erro ao atualizar prato!');
        });
    } else {
      http
        .request({
          url: 'pratos/',
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
        })
        .then(() => {
          alert('Prato cadastrado com sucesso!');
          setNomePrato('');
          setDescricao('');
          setTag('');
          setRestaurante('');
          setImagem(null);
        })
        .catch((erro) => {
          console.log(erro);
          alert('Ocorreu um erro ao cadastradar prato!');
        });
    }
  };

  const selecionarArquivo = (evento: ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files?.length) {
      setImagem(evento.target.files[0]);
    } else {
      setImagem(null);
    }
  };

  return (
    <>
      <Box>
        <Container maxWidth="lg" sx={{ mt: 1 }}>
          <Paper sx={{ p: 2 }}>
            {/* Conteudo da pagina */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <Typography component="h1" variant="h6">
                Formulário de Pratos
              </Typography>
              <Box
                component="form"
                onSubmit={aoSubmeterForm}
                sx={{ width: '100%' }}
              >
                <TextField
                  value={nomePrato}
                  onChange={(evento) => setNomePrato(evento.target.value)}
                  id="standard-basic"
                  label="Nome do Prato"
                  variant="standard"
                  fullWidth
                  required
                  margin="dense"
                />
                <TextField
                  value={descricao}
                  onChange={(evento) => setDescricao(evento.target.value)}
                  id="standard-basic"
                  label="Descrição do Prato"
                  variant="standard"
                  fullWidth
                  required
                  margin="dense"
                />
                <FormControl margin="dense" fullWidth>
                  <InputLabel id="select-tag">Tag</InputLabel>
                  <Select
                    labelId="select-tag"
                    value={tag}
                    onChange={(evento) => setTag(evento.target.value)}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.value}>
                        {tag.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl margin="dense" fullWidth>
                  <InputLabel id="select-restaurante">Restaurante</InputLabel>
                  <Select
                    labelId="select-restaurante"
                    value={restaurante}
                    onChange={(evento) => setRestaurante(evento.target.value)}
                  >
                    {restaurantes.map((restaurante) => (
                      <MenuItem key={restaurante.id} value={restaurante.id}>
                        {restaurante.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <input
                  type="file"
                  onChange={(evento) => selecionarArquivo(evento)}
                />
                <Button
                  sx={{ margin: 1 }}
                  type="submit"
                  variant="outlined"
                  fullWidth
                >
                  Salvar
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default FormularioPrato;
