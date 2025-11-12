# Network Project

Este é um projeto full-stack que utiliza um frontend em Next.js, um backend em Node.js com Express e um banco de dados PostgreSQL. A aplicação é totalmente containerizada com Docker para garantir um ambiente de desenvolvimento consistente e fácil de configurar.

## Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em sua máquina:

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/) (geralmente já vem incluído na instalação do Docker Desktop)

## Como Configurar e Executar o Projeto

Siga os passos abaixo para colocar a aplicação em funcionamento.

### 1. Clone o Repositório

Primeiro, clone este repositório para a sua máquina local:

```bash
git clone git@github.com:Kevin-Amaral165/network-project.git
cd network-project
```

### 2. Configure as Variáveis de Ambiente

O Docker Compose utiliza um arquivo `.env` na raiz do projeto (`network-project`) para configurar as variáveis de ambiente, incluindo as credenciais do banco de dados e segredos da aplicação.

Crie um arquivo chamado `.env` na raiz do diretório `network-project` e adicione o seguinte conteúdo a ele:

```env
    # Banco de Dados
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=network_db

    # Docker (host = db)
    DATABASE_URL=postgresql://postgres:postgres@db:5432/network_db?schema=public

    # Backend
    PORT=3001
    JWT_SECRET=minha_chave_secreta

    # Frontend
    NEXT_PUBLIC_API_URL=http://backend:3001/api
    # Local: http://localhost:3001/api
```

**Importante:** O `DATABASE_URL` deve usar `db` como hostname, pois é o nome do serviço do banco de dados definido no `docker-compose.yml`.

### 3. Construa as Imagens e Inicie os Contêineres

Com o arquivo `.env` configurado, você pode construir as imagens Docker e iniciar todos os serviços com um único comando:

```bash
docker-compose up --build
```

-   O comando `docker-compose up` irá iniciar os contêineres definidos no arquivo `docker-compose.yml`.
-   A flag `--build` força a reconstrução das imagens Docker a partir dos `Dockerfiles`, garantindo que quaisquer alterações no código-fonte sejam aplicadas.

Na primeira vez que você executar este comando, o Docker fará o download da imagem do PostgreSQL e construirá as imagens para o frontend e o backend, o que pode levar alguns minutos.

### 4. Acesse a Aplicação

Depois que todos os contêineres estiverem em execução, você poderá acessar os serviços:

-   **Frontend:** Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000)
-   **Backend:** A API estará disponível em [http://localhost:3001](http://localhost:3001)

## Gerenciando os Contêineres

Aqui estão alguns comandos úteis do Docker Compose para gerenciar seu ambiente:

-   **Para parar todos os serviços:**
    (Pressione `Ctrl + C` no terminal onde o `docker-compose up` está rodando) ou execute em outro terminal:
    ```bash
    docker-compose down
    ```

-   **Para iniciar os serviços em modo "detached" (em segundo plano):**
    ```bash
    docker-compose up -d
    ```

-   **Para ver os logs de todos os serviços (ou de um serviço específico):**
    ```bash
    docker-compose logs
    docker-compose logs backend
    docker-compose logs frontend
    ```

-   **Para forçar a reconstrução de uma imagem específica:**
    ```bash
    docker-compose build backend
    ```

Com isso, você tem um ambiente de desenvolvimento completo e portátil!
