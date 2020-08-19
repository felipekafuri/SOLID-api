import { IUserRepository } from "../../repositories/IUserRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";
import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private mailProvider: IMailProvider
  ) { }

  async execute(data: ICreateUserRequestDTO) {
    const userAlreadyExistes = await this.usersRepository.findByEmail(data.email);

    if (userAlreadyExistes) {
      throw new Error('User already exits');
    }

    const user = new User(data);

    await this.usersRepository.save(user);

    await this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email
      },
      from: {
        name: 'Equipe do meu app',
        email: "contato@meuapp.com"
      },
      subject: 'Seja bem-vindo a plataforma',
      body: '<p>Você ja pode fazer login a nossa plataforma</p>'
    })
  }
}