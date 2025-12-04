// ################################
//
// Variáveis globais
//
// ################################
const contas = [];
const movimentos = [];
const operacoes = ["levantamento", "deposito", "transferencia"];
const tipos = ["entrada", "saida"];

// ################################
//
// Conta (funções)
//
// ################################

function criarConta(nome, email, pin) {
  const isValidCredentials = isValidCredentials(email, pin);
  if (!isValidCredentials) {
    console.error("Email/Pin inválidos, tente novamente");
    return;
  }

  const newConta = {
    nome,
    email,
    pin,
    saldo: 0,
  };

  contas.push(newConta);
}

// Helper que valida se o email é único e o PIN tem 4 números
function isValidCredentials(email, pin) {
  const exists = contas?.find((conta) => conta.email === email) || null;
  const isFourDigits = String(pin).length === 4;
  const isNumber = isStringNumber(String(pin));

  return !exists && isFourDigits && isNumber;
}

// Helper que testa se o PIN contém apenas números
function isStringNumber(text) {
  const numeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const list = String(text).split("");
  const mapped = list.map((char) => numeros.includes(char));
  return !mapped.some((elem) => elem === false);
}

// Helper que aumenta o valor no saldo se o tipo for entrada, ou subtrai se for saída.
function atualizarSaldoConta(conta, valor, tipo) {
  if (!tipos.includes(tipo)) return;
  if (typeof valor !== "number") return;

  contas.map((account) =>
    account.email !== conta.email
      ? account
      : {
          ...account,
          saldo:
            tipo === "entrada" ? account.saldo + valor : account.saldo - valor,
        }
  );
}

// ################################
//
// Movimentos (funções)
//
// ################################

function criarMovimento(conta, operacao, tipo, valor) {
  if (!operacoes.includes(operacao)) return null;
  if (!tipos.includes(tipo)) return null;
  if (typeof valor !== "number") return null;

  const newMovimento = {
    contaEmail: conta.email,
    data: new Date(),
    operacao: operacao,
    tipo: tipo,
    valor: valor,
  };

  movimentos.push(newMovimento);

  atualizarSaldoConta(conta, valor, tipo);
  return newMovimento;
}

// ################################
//
// Operações Financeiras (funções)
//
// ################################

function levantarValor(conta, valor) {
  if (typeof valor !== "number") return;
  if (conta.saldo < valor) {
    console.error("Saldo insuficiente");
    return;
  }

  const newMovimento = criarMovimento(conta, "levantamento", "saida", valor);
  if (!newMovimento) {
    console.error("Falha ao criar movimento na conta");
  } else {
    console.log(`Levantamento de ${valor}€ realizado com sucesso!`);
  }
}

function depositarValor(conta, valor) {
  if (typeof valor !== "number") return;

  const newMovimento = criarMovimento(conta, "deposito", "entrada", valor);
  if (!newMovimento) {
    console.error("Falha ao criar movimento na conta");
  } else {
    console.log(`Depósito de ${valor}€ realizado com sucesso!`);
  }
}

// ################################
//
// Execução do programa
//
// ################################
criarConta("João", "joao@mail.com", 1234);
