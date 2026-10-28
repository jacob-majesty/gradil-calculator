# Deploy no AWS Lightsail

Guia para publicar a aplicação em uma instância Lightsail e deixar um link público
para demonstração.

## 1. Criar a instância

1. No console do Lightsail, crie uma instância **Linux/Ubuntu 24.04**.
2. Escolha o plano de **1 GB de RAM**. O plano de 512 MB pode não concluir o build
   do frontend dentro do Docker.
3. Crie e anexe um **IP estático** à instância. Ele será usado no link final.

## 2. Liberar a porta HTTP

Em **Networking → IPv4 Firewall**, adicione uma regra:

- Aplicação: **HTTP**
- Porta: **80**

A porta 22 (SSH) já vem liberada no Lightsail.

## 3. Instalar Docker

Conecte por SSH e execute:

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Saia e entre novamente no SSH para aplicar o grupo `docker`.

Confirme:

```bash
docker --version
docker compose version
```

Se `docker-compose-v2` não estiver disponível na sua imagem, instale o plugin
oficial do Docker Compose conforme a documentação do Docker.

## 4. Baixar e subir a aplicação

```bash
git clone https://github.com/jacob-majesty/gradil-calculator.git
cd gradil-calculator
APP_PORT=80 docker compose up -d --build
```

O `APP_PORT=80` publica a aplicação na porta HTTP da instância. O padrão local
continua sendo `3000`.

Verifique:

```bash
curl http://localhost/health
docker compose ps
```

O health check deve aparecer como `healthy`.

## 5. Acessar

Abra no navegador:

```text
http://SEU_IP_ESTATICO/
```

## Persistência

Os pedidos ficam no volume Docker `gradil-calculator_gradil-data`, persistente
entre reinícios da instância e atualizações da aplicação.

- `docker compose down` mantém os dados.
- `docker compose down -v` apaga o volume e o histórico.

Para atualizar o código:

```bash
git pull
APP_PORT=80 docker compose up -d --build
```

## Observações

- Esta configuração é intencional para uma demonstração: não há autenticação e
  qualquer visitante pode criar pedidos.
- Se quiser HTTPS, o próximo passo é colocar um proxy como Caddy na frente do
  container e apontar um domínio para o IP estático.
- Se o build falhar por falta de memória, faça o build localmente, publique a
  imagem em um registry e use `image:` no compose em vez de `build:`.
