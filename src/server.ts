import 'reflect-metadata';

import express from 'express';
// src/server.ts
import routes from './routes';
import uploadConfig from './config/upload';

// Importamos a conexão aqui. Como não precisamos nomear esta conexão, ou seja, como não vamos passar nenhum dado desse arquivo para outra variável então temos simplesmente que importar.
import './database';

const app = express();

app.use(express.json());

// Toda rota que começa com o prefixo "file",  o que vem depois dela eu vou servir de forma estática. Ou seja, o que vem depois vai ser o nome do arquivo e vai mostrar para o usuário final exatamente o arquivo/ a imagem. Dentro do "static" vamos passar o endereço da pasta ou arquivo. Para isso, precisamos importar o "uploadConfig" do './config/upload';
app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

// app.get('/', (request, response) => {
//   response.json({ message: 'Hello my dudes!!!' })
// });

app.listen(3333, () => {
  console.log('✈✈✈ Server started on port 3333');
});
