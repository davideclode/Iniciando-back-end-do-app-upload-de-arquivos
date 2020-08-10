import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

// Temos que importar o CreateUsersService.ts
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);
// Agora, o "upload" é uma instancia do "multer". Dentro dele, temos alguns métodos como: any, none, fields. upload.single significa que vou fazer upload de um único arquivo.

// // Essa parte foi adicionada depois de "routes.use('/appointments', appointmentsRouter);" do arquivo index.ts
// // Agora, se formos criar uma rota para criar um agendamento(uma rota do tipo post), não precisamos colocar "/appointments". Podemos escrever simplesmente "/". Isto porque utilizamos "routes.use"
usersRouter.post('/', async (request, response) => {
  try {
    // Para criar usuário vamos precisar de name, email e password
    const { name, email, password } = request.body;

    // Aqui, vamos instanciar o CreateUserService
    const createUser = new CreateUserService();

    // Utilizamos o "await" porque o nosso "execute()" é "async"
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // Vamos deletar informações do password do usuário que acabou de ser criado
    delete user.password;

    return response.json(user);
    // return response.json(appointment);
  } catch (err) {
    return response.status(400).json({
      error: err.message,
    });
  }
});

// Estamos utilizando "patch" porque queremos atualizar a penas uma informação específica do usuário
// Vamos precisar que o usuário esteja autenticado. Para isso importamos o "ensureAuthenticated";
// Depois de verificar que o usuário foi autenticado, vamos colocar mais um middleware "upload.single('Nome do campo que conter a imagem quando eu chamar esta rota')".
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService();
      // Para executar o updateUserAvatar, precisamos do id e do nome do arquivo(avatarFilename);
      // O id do usuário está no nosso middleware "ensuareAuthenticated.ts"
      // O filename está no arquivo "upload.ts"
      // Como o "execute" do arquivo "UpdateUserAvatarService.ts" é uma Promise então precisamos colocar um "await" aqui.
      const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response.status(400).json({
        error: err.message,
      });
    }
  },
);
// // Vamos exportar a variável appointementesRouter
export default usersRouter;
