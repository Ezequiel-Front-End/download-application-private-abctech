const endpoint = "https://api-links-seven.vercel.app";
const loading = document.querySelector(".spinner-border");
loading.style.display = "none";

const textButton = document.querySelector(".textButton");

const dto = [
    { id: 1, nameApp: "Constata - Apontamento Digital", image: "src/assets/images/constata.jpg", description: "Constata - Apontamento Digital é um aplicativo para gestão de obras e funções na construção civil. Ele permite registrar e monitorar tarefas, prazos e progresso de forma digital e eficiente. Com o Constata, equipes podem otimizar a execução das obras, garantindo maior controle e agilidade no processo. Ideal para engenheiros e gestores." },
    { id: 2, nameApp: "Jarvis - Gestão de Obras", image: "src/assets/images/icone.png", description: "Jarvis - Gestão de Obras, da ABC Technology Group, é uma solução digital para controlar prazos, orçamentos, equipes e materiais de obras. Oferece monitoramento em tempo real, otimizando recursos e facilitando a gestão de projetos na construção civil." }
]

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

const alertFieldNullApplication = () => {
    Swal.fire({
        title: "Ops... 😕",
        text: "Você não escolheu nenhum aplicativo!",
        icon: "error"
    });
};

const appSelect = document.getElementById('app');

appSelect.addEventListener('change', (event) => {
    let btn = document.getElementById("btn-view-application");
    let appName = document.querySelector(".appName");
    let descriptionApp = document.querySelector(".descriptionApp");
    let imgLogo = document.getElementById("img-logo");
    let appLabel = event.target.value;

    if (appLabel == "") {
        btn.classList.add("disabled");
    }

    if (appLabel == "app1") {
        btn.classList.remove("disabled");

        appName.innerHTML = `${dto[0].nameApp}`;
        descriptionApp.innerHTML = `${dto[0].description}`;
        imgLogo.src = dto[0].image;
        
    }

    if (appLabel == "app2") {
        btn.classList.remove("disabled");

        appName.innerHTML = `${dto[1].nameApp}`;
        descriptionApp.innerHTML = `${dto[1].description}`;
        imgLogo.src = dto[1].image;
        
    }
});

const alertSuccess = (appName) => {
    activeLoading(true);

    if (appName == "app1") {
        setTimeout(() => {
            Swal.fire({
                title: "Tudo certo! 🥳",
                icon: "success",
                draggable: true
            });
            activeLoading(false);
            document.querySelector(".link-container").style.display = "block";
        }, 1000);
    }

    if (appName == "app2") {
        setTimeout(() => {
            Swal.fire({
                title: "Tudo certo! 🥳",
                icon: "success",
                draggable: true
            });
            activeLoading(false);
        }, 1000);
    }

    
};

const alertConfirDownload = (appName) => {
    Swal.fire({
        title: "Atenção! 🚨",
        text: "Assim que você confirmar, o download do aplicativo será iniciado automaticamente.",
        icon: "",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Manda ver, confia!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
            downloadFile(appName);
        }
      });
}

const gerarLink = async (appName) => {

    // Fazendo uma requisição GET para a API
    await fetch(`${endpoint}/getLinks`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            alertSuccess(appName);

            let objLinks = data.response;

            // console.log(objLinks);

            // Loop para verificar os links
            for (let element of objLinks) {
                if (element[1] === "FALSE") {
                    // console.log("Esse link está liberado:", element);
                    // Quando encontrar o primeiro link liberado, saia do loop
                    document.getElementById("generatedLink").value = element[0];  // Aqui você define o link gerado
                    break;  // Para o loop assim que o primeiro link liberado for encontrado
                } else {
                    // console.log("Esse link não está liberado:", element);
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

    //   console.log(dataToSend);
      
      fetch(`${endpoint}/updateLinkStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then(response => response.json())
        .then(data => {
        //   console.log('Resposta da API:', data);
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

    if (app == "app1") {
        gerarLink("app1");
        return;
    }

    if (app == "app2") {
        alertConfirDownload("app2");
        return;
    }


    // Exibe a área do link gerado
    document.getElementById("generatedLink").value = generatedUrl;
};

function downloadFile(appName){

    if(appName == "app1") {
        let link = document.getElementById("generatedLink").value;
        let status = "TRUE";
        let name = document.getElementById("name").value;
        updateLink(link, status, name);
    }

    if (appName == "app2") {
        const link = document.createElement('a'); 
        link.href = 'src/assets/apk/app-release.apk'; 
        link.download = 'Jarvis-Gestão-de-Obras.apk'; 
        link.click(); 

        alertSuccess(appName);
    }
    
};





