import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

// Criar a classe UpdateUserAvatarService
class UpdateUserAvatarService {
  // Criar um método public chamado "execute". Esse método receberá o id do usuário que eu quero atualizar o avatar e o nome do avatar(da imagem).
  // eslint-disable-next-line consistent-return
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    // Precisamos atualizar o usuário. Logo, aqui dentro, precisamos acessar o repositório do usuário(lá do typeorm). Para isso, vamos importar o "getRepository" do "typeorm" e Userd do arquivo "User.ts".
    // Recebemos as informações do User aqui
    const usersRepository = getRepository(User);
    // Verificamos se o id(user_id) que estamos recebendo do usuário é válido. Para isso, temos que achar primeiro o id do usuário e depois fazer a verificação
    const user = await usersRepository.findOne(user_id);

    // Verificando
    if (!user) {
      throw new Error('Sorry. Only authenticated users can change avatar!!!');
    }
    // Se o usuário for encontrado
    // Se o usuário já tinha um avatar
    if (user.avatar) {
      // Deletar o avatar anterior.
      // "user.avatar" é o nome do caminho do arquivo que queremos deletar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // Verificando se o arquivo existe. Para isso importamos o "fs ou file system" do Node
      //  "fs.promises" garante que vou estar utilizando as funçoes do file system no Node no formato promise ao envez de utilizar o callback. Colocando "fs.promises" permite utilizar o "await"
      // A função "stat" traz o status de um arquivo se ela existir
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      // Se existir, então delete-o
      if (!userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // Agora que já deletamos, precisamos atualizar
    user.avatar = avatarFilename;
    // O "save" funciona tanto para criar assim como para atualizar o usuário
    // Se o usuário não tiver o id, ele vai criar o usuário. Se o usuário existir(como nescaso que nós já buscamos o usuário que já que já foi cadastrado no banco), então e
    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
