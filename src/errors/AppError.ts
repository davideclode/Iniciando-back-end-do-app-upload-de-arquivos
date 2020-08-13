// A nossa classe AppError vai ter duas propriedades: message e o "statusCode"
// As propriedades serão públicas porque vamos precisar pegá-las/acessá-las de fora da classe(fazendo por exemplo "AppError.message ou AppError.statusCode")
// Vai ser possível ler somente as duas duas propriedades, ou seja, não vai ser possível mudar o estatus do erro fazendo por exemplo: AppError.message = "xxxx"
class AppError {
  public readonly message: string;

  public readonly statusCode: number; // Esse vai ser aquele código http do erro(ex.: 400, 401, 404, etc)

  // Criamos agora um "constructor" que vai receber "message" e o "statusCode"
  // O "400" é um tipo de erro padrão do HTTP. Que no caso será um número
  constructor(message: string, statusCode: 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
