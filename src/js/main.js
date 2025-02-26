const endpoint = "https://api-links-pied.vercel.app";
const loading = document.querySelector(".spinner-border");
loading.style.display = "none";

const textButton = document.querySelector(".textButton");

const activeLoading = (boolean) => {
    if (boolean == true) {
        loading.style.display = "block";
        textButton.style.display = "none";
    } else {
        loading.style.display = "none";
        textButton.style.display = "block";
    }
};

const alertFieldNull = () => {
    Swal.fire({
        title: "Ops... 😕",
        text: "Você esqueceu de preencher os campos!",
        icon: "error"
    });
};

const alertSuccess = () => {
    activeLoading(true);

    setTimeout(() => {
        Swal.fire({
            title: "Tudo certo! 🥳",
            icon: "success",
            draggable: true
        });
        activeLoading(false);
        document.querySelector(".link-container").style.display = "block";
    }, 1000);
};

const alertConfirDownload = () => {
    Swal.fire({
        title: "Atenção! 🚨",
        text: "Assim que você for redirecionado, o download do aplicativo será iniciado automaticamente e o link será excluído.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Manda ver, confia!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
            downloadFile();
        }
      });
}

const gerarLink = async () => {
    console.log('entrou aqui');

    // Fazendo uma requisição GET para a API
    await fetch(`${endpoint}/getLinks`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            alertSuccess();

            let objLinks = data.response;

            console.log(objLinks);

            // Loop para verificar os links
            for (let element of objLinks) {
                if (element[1] === "FALSE") {
                    console.log("Esse link está liberado:", element);
                    // Quando encontrar o primeiro link liberado, saia do loop
                    document.getElementById("generatedLink").value = element[0];  // Aqui você define o link gerado
                    break;  // Para o loop assim que o primeiro link liberado for encontrado
                } else {
                    console.log("Esse link não está liberado:", element);
                }
            }
        })
        .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
        });
};

const updateLink = (link, status, name) => {

    const dataToSend = {
        link: link, // O link que você quer atualizar
        status: status, // O novo status (TRUE ou FALSE)
        username: name  // O novo nome
      };

      console.log(dataToSend);
      
      fetch(`${endpoint}/updateLinkStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Resposta da API:', data);
        })
        .catch(error => {
          console.error('Erro ao enviar dados:', error);
        });
    
    document.querySelector(".link-container").style.display = "none";
    window.location.href = link;

};

function generateLink() {
  
    const name = document.getElementById("name").value;
    const app = document.getElementById("app").value;

    if (name === "" || app === "") {
        alertFieldNull();
        return;
    }

    // Gerando o link 
    gerarLink();

    // Exibe a área do link gerado
    document.getElementById("generatedLink").value = generatedUrl;
};

function downloadFile(){
    let link = document.getElementById("generatedLink").value;
    let status = "TRUE";
    let name = document.getElementById("name").value;
    updateLink(link, status, name);
};



