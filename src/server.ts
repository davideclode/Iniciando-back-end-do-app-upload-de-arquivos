import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
// Essa importação deve ser feito logo depois da impotação do "expess". Lembrando também que antes dessa importação é obrigatório instalat o "yarn add express-async-errors"
import 'express-async-errors';
// src/server.ts
import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

// Importamos a conexão aqui. Como não precisamos nomear esta conexão, ou seja, como não vamos passar nenhum dado desse arquivo para outra variável então temos simplesmente que importar.
import './database';

const app = express();

app.use(express.json());

// Toda rota que começa com o prefixo "file",  o que vem depois dela eu vou servir de forma estática. Ou seja, o que vem depois vai ser o nome do arquivo e vai mostrar para o usuário final exatamente o arquivo/ a imagem. Dentro do "static" vamos passar o endereço da pasta ou arquivo. Para isso, precisamos importar o "uploadConfig" do './config/upload';
app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

//  É muito importante colocar o middleware de tratativa de erro depois das rotas. Isto porque como os erros vão ser originados nas rotas então o middleware de tratativa de erros deve ser colocada depois das rotas "app.use(routes);".
// O middleware para tratativa de erro recebe 4 parâmetros: O erro(err), a requisição(request), a resposta(response) e a função "next". Trocamos o "next" pelo underline(_) fomos para o ".eslintrc.json"  e escrevemos dentro de "rules" o seguinte: "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "_" }], para ignorar o erro quando a variável tiver underline.
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // Aqui, vou verificar se o meu erro(err) é uma instancia da classe AppError
  if (err instanceof AppError) {
    // Se for verdade, então é um erro gerado pela minha aplicação
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);
  // Se for um erro que não conheço, ou seja, um erro que não é da instancia da classe AppError, então: vou retornar algo mais genérico.
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error!!!',
  });
});

// app.get('/', (request, response) => {
//   response.json({ message: 'Hello my dudes!!!' })
// });

app.listen(3333, () => {
  console.log('✈✈✈ Server started on port 3333');
});
