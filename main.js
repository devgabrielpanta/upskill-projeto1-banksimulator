import { contas, operacoes, tipos } from "./globals.js";
// ################################
//
// Execução do programa
//
// ################################

// ilustra casos relevantes de chamadas às funções criadas
function main() {
  console.log(
    "#####\nBEM-VINDO(A) - DESCUBRA O QUE PODE SER FEITO NO SISTEMA\n#####\n"
  );

  console.log(
    `#####\nCriar uma conta: chame essa função com os parâmetros: \ncriarConta("Nome do cliente", "emaildocliente@email.com", PIN (4 números))\n#####\n`
  );
  // Criação das contas
  criarConta("João", "joao@mail.com", 1234);
  criarConta("Mafalda", "mafalda@mail.com", 4321);
  criarConta("Joana", "joana@mail.com", 4567);
  criarConta("Bartolomeu", "bartolomeu@mail.com", 7654);
  criarConta("Astolfo", "astolfo@mail.com", 6789);

  // Mockagem dos dados com loop para gerar 20 lançamentos por usuário
  contas.forEach((conta) => {
    for (let i = 0; i < 20; i++) {
      operacaoAleatoria(conta);
    }
  });
}
main();


// ################################
//
// Operações Financeiras (funções)
//
// ################################

function levantarValor(conta, valor) {
  if (typeof valor !== "number") return null;
  if (conta.saldo < valor) {
    console.error("Saldo insuficiente");
    return null;
  }

  const newMovimento = criarMovimento(conta, "levantamento", "saida", valor);
  if (!newMovimento) {
    console.error("Falha ao criar movimento na conta");
  } else {
    console.log(`Levantamento de ${valor}€ realizado com sucesso!`);
  }
}

function depositarValor(conta, valor) {
  if (typeof valor !== "number") return null;

  const newMovimento = criarMovimento(conta, "deposito", "entrada", valor);
  if (!newMovimento) {
    console.error("Falha ao criar movimento na conta");
  } else {
    console.log(`Depósito de ${valor}€ realizado com sucesso!`);
  }
}

function transferirValor(contaOrigem, contaDestino, valor) {
  if (typeof valor !== "number") return null;

  const levantado = levantarValor(contaOrigem, valor);
  if (!levantado) return;
  depositarValor(contaDestino, valor);
  console.log("Transferência concluída com sucesso!");
}

// ################################
//
// Banco / Sistema (funções)
//
// ################################

// Calcular quanto dinheiro o banco tem guardado.
function calcularCapitalTotal() {
  let total = 0;
  for (let conta of contas) {
    total += conta.saldo;
  }
  console.log(`O capital total do banco é: ${total.toFixed(2)}`);
}

// Listar titulares com saldo superior a um valor X.
function listarClientesPremium() {
  let list = [];
  for (let conta of contas) {
    if (conta.saldo > 10000) {
      list.push({ cliente: conta.email, saldo: conta.saldo });
    }
  }
  console.table(list);
}

// Registo centralizado de todas as operações efetuadas.
/**
function extratoGlobal() {
  console.table(
    movimentos
      .sort((a, b) => String(a.contaEmail).localeCompare(b.contaEmail))
      .sort((a, b) => a.data - b.data)
      .sort((a, b) => a.valor - b.valor)
      .map((mov) => ({
        cliente: mov.contaEmail,
        data: mov.data,
        operacao: mov.operacao,
        entrada: mov.tipo === "entrada" ? mov.valor : 0,
        saida: mov.tipo === "saida" ? mov.valor : 0,
      }))
  );
}
*/

// Helper para gerar valores aleatórios na mockagem dos dados
function valorAleatorio(min = 10, max = 500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper para gerar uma operação aleatória na mockagem dos dados
function operacaoAleatoria(conta) {
  const tipo = Math.floor(Math.random() * 3); // 0=depósito, 1=levantamento, 2=transferência
  const valor = valorAleatorio();

  const outraConta = contas[Math.floor(Math.random() * contas.length)];

  switch (tipo) {
    case 0:
      // DEPÓSITO
      depositarValor(conta, valor);
      break;

    case 1:
      // LEVANTAMENTO (só se tiver saldo)
      if (conta.saldo >= valor) {
        levantarValor(conta, valor);
      } else {
        depositarValor(conta, valor);
      }
      break;

    case 2:
      // TRANSFERÊNCIA (não pode ser para a própria conta e precisa de saldo)
      if (conta !== outraConta && conta.saldo >= valor) {
        transferirValor(conta, outraConta, valor);
      } else {
        depositarValor(conta, valor);
      }
      break;
  }
}

// BUG mockup
