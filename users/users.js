class User {
    constructor(id, firstName, lastName, age, email, image) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.email = email;
        this.image = image;
    }
}

const pageUsers = [];

function displayUsers() {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";
    pageUsers.forEach(user => {
        const listItem = document.createElement("li");
        listItem.setAttribute("class", "card");

        // ...

        listItem.innerHTML = `<div class="space"><strong>Nome:</strong> ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}</div>
        <div class="space"><strong>Idade:</strong> ${user.age || 'N/A'}</div>
        <div class="space"><strong>Email:</strong> ${user.email || 'N/A'}</div>
        ${user.image ? `<div class="space img-center"><img src="${user.image}" alt="Foto do usuário"></div>` : ''}
        <button onclick="removeUser(${user.id})" class="remove-btn">
          <i class="bi bi-trash"></i> Remover Usuário
        </button>`;


        // ...


        userList.appendChild(listItem);
    });
}

function fetchUsers() {
    const apiUrl = "https://dummyjson.com/users";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const users = data && data.users;

            if (Array.isArray(users)) {
                users.forEach(user => {
                    // Certifique-se de ajustar aqui para pegar os nomes corretamente da API
                    pageUsers.push(new User(user.id, user.firstName, user.lastName, user.age, user.email, user.image));
                });
                displayUsers();
            } else {
                console.error("Resposta da API não contém uma lista de usuários válida");
            }
        })
        .catch(error => console.error("Erro ao obter dados da API:", error));
}

// para realizar as validações, precisamos chamar as funções de validações dentro da função addUser.
function addUser() {
    const addUserForm = document.getElementById("add-user-form");

    const id = pageUsers.length > 0 ? pageUsers[pageUsers.length - 1].id + 1 : 1;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const age = document.getElementById("age").value;
    const email = document.getElementById("email").value;
    const image = document.getElementById("image").value;

    // realizamos a chamada da função de validação do tamanho minímo e máximo do nome e sobrenome
    if (!validateUserInput(firstName, lastName)) {
        alert("Nome e sobrenome não pode ser vazio e número de caracteres deve estar entre 3 e 50 caracteres.");
        return;
    }
    // realizamos a verificação do tamanho da IDADE, se a IDADE for negativa ou maior que 120, informamos ao usuário a necessidade de mudar.
    // cria-se um alerta quando o usuário realiza o preenchimento de um valor negativo ou => que 120.
    // vamos analisar cada parte desse condicional:
    // isNaN(price) é uma função que verifica o valor da variavel "age", se é ou não um número.
    // || é um operador lógico que retorna verdadeiro se pelo menos uma das condições em ambos os lados for verdadeira.
    if (isNaN(age) || age <= 0 || age >= 120) {
        alert("O campo 'Idade' deve ser um número positivo menor que 120.");
        return false;
    }

    // realizamos a chamada da função de validação do email
    if (!isRequired(email) || !isBetween(email.length, 5, 50) || !isEmailValid(email)) {
        alert("Por favor, preencha o email corretamente.");
        return;
    }

    // nesta parte do código, reailizamos a validação a URL da imagem, somente me relação a validade da URL, pois não é obrigatório a submissão de uma imagem
    if (image && !isValidImageUrl(image)) {
        alert("A URL da imagem não é válida.");
        return;
    }

    pageUsers.push(new User(id, firstName, lastName, age, email, image));
    addUserForm.reset();
    displayUsers();
}

//função com a lógica de validação do tamanho do NOME e SOBRENOME no formulário. 

function validateUserInput(firstName, lastName) {
    const minLength = 3;// definimos aqui a constante que representa o tamanho minímo
    const maxLength = 50;// definimos aqui a constante que representa o tamanho máximo
    // lógica condicional da validação do tamanho do NOME e SOBRENOME
    // lógica condicional da validação do tamanho do NOME e da SOBRENOME
    // aqui usamos o operador || novamente.
    if (
        !firstName || firstName.length < minLength || firstName.length > maxLength ||
        !lastName || lastName.length < minLength || lastName.length > maxLength
    ) {
        return false;
    }// o if realiza a verificação das condições estabelecidas, se pelo menos uma estiver verdadeira, a função retorna false.
    // se o condicional if não for verdadeiro a função retorna true.

    return true;
}
// lógica de validação do email.
// essa lógica de validação utilizei o que foi determinado no slide do desafio.
// utilizamos a mesma estrutura que foi usada no desafio anterior e nos exemplos em aula.
const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;
const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

// criamos a função para validar a URL da imagem a ser submetida ao cadastro de usuário
function isValidImageUrl(url) {
    // Lógica para validar a URL da imagem
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    // explicação da lógica de validação da URL
    // primeiro criamos a expressão urlRegex, para validar a URL
    // "^" indica o início de uma string
    // ftp|http|https especifica que a URL deve começar com ftp, http ou https
    // ":\/\/" representa os dois pontos e duas barras que seguem os protocolos
    // "[^ "]+" representa um ou mais caracteres que não sejam espaços ou aspas. Isso significa que não deve haver espaços ou aspas no meio da URL
    // "$" indica o final da string
    return urlRegex.test(url);
    // urlRegex.test(url) é usada para realizar o teste se a URL fornecida corresponde à expressão de validação urlRegex

}

function removeUser(userId) {
    const userIndexToRemove = pageUsers.findIndex((user) => user.id === userId);
    pageUsers.splice(userIndexToRemove, 1);
    displayUsers();
}

document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();
});
