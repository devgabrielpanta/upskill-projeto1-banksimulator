import { contas, movimentos, operacoes, tipos } from "./globals.js";

// Adiciona uma nova conta ao BankSimulator
export function criarConta(nome, email, pin) {
  const validCredentials = isValidCredentials(email, pin);
  if (!validCredentials) {
    console.error("Email/Pin inválidos, tente novamente");
    return;
  }

  const newConta = {
    nome,
    email,
    pin,
    saldo: 0,
    movimentos: [],
  };

  contas.push(newConta);
}

// Retorna o saldo de uma conta específica
function consultarSaldo(conta) {
  const saldo = conta.saldo;
  console.log(`Saldo da conta: ${saldo.toFixed(2)}`);
  return saldo;
}

// Altera o PIN de uma conta específica
function alterarPin(conta, pin) {
  const isValidPin = isValidPin(pin);
  if (!isValidPin) {
    console.error("Informe um PIN válido para alteração.");
    return;
  }
  contas.map((account) =>
    account.email !== conta.email ? account : { ...account, pin: pin }
  );
  console.log("PIN alterado com sucesso");
}

function gerarExtrato(conta) {
  const extrato = conta.movimentos
    .sort((a, b) => a.data - b.data)
    .map((mov) => ({
      data: mov.data,
      operacao: mov.operacao,
      entrada: mov.tipo === "entrada" ? mov.valor : 0,
      saida: mov.tipo === "saida" ? mov.valor : 0,
    }));
  console.table(extrato);
  return extrato;
}

function criarMovimento(conta, operacao, tipo, valor) {
  if (!operacoes.includes(operacao)) return null;
  if (!tipos.includes(tipo)) return null;
  if (typeof valor !== "number") return null;

  const newMovimento = {
    data: new Date(),
    operacao: operacao,
    tipo: tipo,
    valor: valor,
  };

  conta.movimentos.push(newMovimento);

  atualizarSaldoConta(conta, valor, tipo);
  return newMovimento;
}

// ################################
//
// Helpers
//
// ################################

// Valida se o email é único e o PIN tem 4 números
function isValidCredentials(email, pin) {
  const validEmail = isValidEmail(email);
  const validPin = isValidPin(pin);
  return validEmail && validPin;
}

// Valida se o email é único
function isValidEmail(email) {
  const exists = contas?.find((conta) => conta.email === email) || null;
  return !exists;
}

// Valida se o PIN tem 4 números
function isValidPin(pin) {
  const isFourDigits = String(pin).length === 4;
  const isNumber = isStringNumber(String(pin));
  return isFourDigits && isNumber;
}

// Testa se o PIN contém apenas números
function isStringNumber(text) {
  const numeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const list = String(text).split("");
  const mapped = list.map((char) => numeros.includes(char));
  return !mapped.some((elem) => elem === false);
}

// Aumenta o valor no saldo se o tipo for entrada, ou subtrai se for saída.
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
