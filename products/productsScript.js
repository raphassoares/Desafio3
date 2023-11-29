document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");

  const productList = document.getElementById("productList");
  const productForm = document.getElementById("productForm");

  // Adiciona um ouvinte de evento para adicionar produtos do formulário
  productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obter valores do formulário
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const brand = document.getElementById("brand").value;
    const category = document.getElementById("category").value;
    const images = document.getElementById("images").value;

    // cria uma alerta para o usuário realize o preenchimento de forma correta do formulário
    // o if será um condicional para verificar a função de validação dentro do parenteses. Caso ela seja verdadeira, executa-se o código dentro da chaves.
    // Ou seja, emite um alerta que o campo titulo e descrição estão fora do padrão estipulado.
    if (!validateProduct(title, description)) {
      alert("Certifique-se que o título e a descrição possuam mais de 3 caracteres e menos de 50 caracteres.");
      return;
    }
    // cria-se um alerta quando o usuário realiza o preenchimento de um valor negativo ou => que 120.
    // vamos analisar cada parte desse condicional:
    // isNaN(price) é uma função que verifica o valor da variavel "price", se é ou não um número.
    // || é um operador lógico que retorna verdadeiro se pelo menos uma das condições em ambos os lados for verdadeira.
    if (isNaN(price) || price <= 0 || price >= 120) {
      alert("O campo 'Preço' deve ser um número positivo menor que 120.");
      return false;
  }

    // nesta parte do código, reailizamos a validação a URL da imagem, somente em relação a validade da URL, pois não é obrigatório a submissão de uma imagem
    if (images && !isValidImageUrl(images)) {
        alert("A URL da imagem não é válida.");
        return;
  }

    // Se a API fornecer uma lista de imagens, seleciona a primeira
    const selectedImage = Array.isArray(images) ? images[0] : images;

    // Criar novo elemento li e adicionar à lista
    const productItem = document.createElement("li");
    productItem.innerHTML = `
      <strong>${title}</strong><br>
      <span><strong>Descrição:</strong> ${description}</span><br>
      <span><strong>Preço:</strong> ${price}</span><br>
      <span><strong>Marca:</strong> ${brand}</span><br>
      <span><strong>Categoria:</strong> ${category}</span><br>
      <img src="${isValidURL(selectedImage) ? selectedImage : 'https://via.placeholder.com/150'}" alt="${title}"><br>
      <button class="removeProduct">Remover Produto</button>
    `;

    productList.appendChild(productItem);

    // Limpar campos do formulário
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("category").value = "";
    document.getElementById("images").value = "";
  });
  // a função validateProduct realiza a verificação se o titulo e a descrição tem o tamanho minimo de 3 caracteres e máximo de 50 caracteres.
  function validateProduct(title, description) {
    const minLength = 3; // definimos aqui a constante que representa o tamanho minímo
    const maxLength = 50; // definimos aqui a constante que representa o tamanho máximo
    // lógica condicional da validação do tamanho do titulo e da descrição
    // aqui usamos o operador || novamente.
    if (
        !title || title.length < minLength || title.length > maxLength ||
        !description || description.length < minLength || description.length > maxLength
    ) {
        return false;
    } // o if realiza a verificação das condições estabelecidas, se pelo menos uma estiver verdadeira, a função retorna false.
      // se o condicional if não for verdadeiro a função retorna true.
    return true;
}

function isValidImageUrl(images) {
  // Lógica para validar a URL da imagem
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
   // explicação da lógica de validação da URL
    // primeiro criamos a expressão urlRegex, para validar a URL
    // "^" indica o início de uma string
    // ftp|http|https especifica que a URL deve começar com ftp, http ou https
    // ":\/\/" representa os dois pontos e duas barras que seguem os protocolos
    // "[^ "]+" representa um ou mais caracteres que não sejam espaços ou aspas. Isso significa que não deve haver espaços ou aspas no meio da URL
    // "$" indica o final da string
  return urlRegex.test(images);  
}

  // Adiciona um ouvinte de evento para remover produtos
  productList.addEventListener("click", function (event) {
    if (event.target.classList.contains("removeProduct")) {
      event.target.parentElement.remove();
    }
  });

  // Carrega dados da API e exibe na lista
  const apiUrl = 'https://dummyjson.com/products';

  console.log('URL da API:', apiUrl);

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na solicitação da API: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Verifique os dados no console

      const productsArray = Array.isArray(data.products) ? data.products : [];

      productsArray.forEach(product => {
        // Se a API fornecer uma lista de imagens, seleciona a primeira
        const selectedImage = Array.isArray(product.images) ? product.images[0] : product.images;

        const productItem = document.createElement("li");
        productItem.innerHTML = `
          <strong>${product.title}</strong><br>
          <span><strong>Descrição:</strong> ${product.description}</span><br>
          <span><strong>Preço:</strong> ${product.price}</span><br>
          <span><strong>Marca:</strong> ${product.brand}</span><br>
          <span><strong>Categoria:</strong> ${product.category}</span><br>
          <img src="${isValidURL(selectedImage) ? selectedImage : 'https://via.placeholder.com/150'}" alt="${product.title}">
          <br>
          <button class="removeProduct">Remover Produto</button>
        `;
        productList.appendChild(productItem);
      });
    })
    .catch(error => {
      console.error(error.message);
    });
});

// Função auxiliar para verificar se uma URL é válida
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
