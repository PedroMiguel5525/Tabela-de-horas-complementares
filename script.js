const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

const optionsAtv = [
    {"nome": 'Selecione o tipo de atividade'},
    {"nome": 'Atividade de extensão',"lim": 90,"acum": 0},
    {"nome": 'Atividade de pesquisa',"lim": 90,"acum": 0},
    {"nome": 'Atividade de ensino',"lim": 90,"acum": 0}
];

const optionsExt = [
    {"nome": 'Selecione uma atividade de extensão'},
    {"nome": 'Projeto de extensão',"apro": 10,"lim": 40,"acum": 0},
    {"nome": 'Atividades culturais',"apro": 80,"lim": 5,"acum": 0},
    {"nome": 'Visitas Técnicas',"apro": 100,"lim": 40,"acum": 0},
    {"nome": 'Visitas a Feiras e Exposições',"apro": 20,"lim": 5,"acum": 0},
    {"nome": 'Cursos de Idiomas',"apro": 60,"lim": 20,"acum": 0},
    {"nome": 'Palestras, Seminários e Congressos Extensionistas(ouvinte)',"apro": 80,"lim": 10,"acum": 0},
    {"nome": 'Palestras, Seminários e Congressos Extensionistas(apresentador)',"apro": 100,"lim": 15,"acum": 0},
    {"nome": 'Projeto Empresa Júnior',"apro": 20,"lim": 20,"acum": 0}
];

const optionsPes = [
    {"nome": 'Selecione uma atividade de pesquisa'},
    {"nome": 'Iniciação Científica',"apro": 80,"lim": 40,"acum": 0},
    {"nome": 'Publicação de artigos em periódicos científicos',"apro": 100,"lim": 10,"acum": 0},
    {"nome": 'Publicação de artigos completos em anais de congressos',"apro": 100,"lim": 7,"acum": 0},
    {"nome": 'Publicação de capítulo de livro',"apro": 100,"lim": 7,"acum": 0},
    {"nome": 'Publicação de resumos de artigos em anais',"apro": 100,"lim": 5,"acum": 0},
    {"nome": 'Registro de patentes como autor/coautor',"apro": 100,"lim": 40,"acum": 0},
    {"nome": 'Premiação resultante de pesquisa científica',"apro": 100,"lim": 10,"acum": 0},
    {"nome": 'Colaborador em atividades como Seminários e Congressos',"apro": 100,"lim": 10,"acum": 0},
    {"nome": 'Palestras, Seminários e Congressos de Pesquisa(ouvinte)',"apro": 80,"lim": 10,"acum": 0},
    {"nome": 'Palestras, Seminários e Congressos de Pesquisa(apresentador)',"apro": 100,"lim": 15,"acum": 0},
];

const optionsEns = [
    {"nome": 'Selecione uma atividade de ensino'},
    {"nome": 'Estágio Extracurricular',"apro": 70,"lim": 40,"acum": 0},
    {"nome": 'Monitoria',"apro": 70,"lim": 40,"acum": 0},
    {"nome": 'Concursos e campeonatos de atividades acadêmicas',"apro": 70,"lim": 50,"acum": 0},
    {"nome": 'Presença comprovada a defesas de TCC do curso de Engenharia de Computação',"apro": 50,"lim": 3,"acum": 0},
    {"nome": 'Cursos Profissionalizantes Específicos na área',"apro": 80,"lim": 40,"acum": 0},
    {"nome": 'Cursos Profissionalizantes em geral',"apro": 20,"lim": 10,"acum": 0},
];

var horasRegis = [];

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

function showLoading(){

    const div = document.createElement("div");
    div.classList.add("loading","centralize");

    const span =  document.createElement("span");
    span.classList.add("loader");

    div.appendChild(span);

    document.body.appendChild(div);

}

function hideLoading(){

    const loadings = document.getElementsByClassName("loading");

    if(loadings.length){

        loadings[0].remove();

    }

}

function excHor(obj1, obj2){

    obj2.forEach(options => {

        if(obj1.nome == options.nome){

            options.acum -= obj1.horVal;

        }

    });

}

function excluir(id){

    if(horasRegis[id].atv == 'Atividade de extensão'){

        optionsAtv[1].acum -= horasRegis[id].horVal;

        excHor(horasRegis[id],optionsExt);

    }else if(horasRegis[id].atv == 'Atividade de pesquisa'){

        optionsAtv[2].acum -= horasRegis[id].horVal;

        excHor(horasRegis[id],optionsPes);

    }else if(horasRegis[id].atv == 'Atividade de ensino'){

        optionsAtv[3].acum -= horasRegis[id].horVal;

        excHor(horasRegis[id],optionsEns);
    }

    horasTotais -= horasRegis[id].horVal;

    horasRegis.splice(id,1);
    (document.getElementById('tabela')).innerHTML = "";
    (document.getElementById('total')).innerHTML = "";
    exibirTabela();

}

function exibirTabela(){

    var aux = 0;

    if(horasRegis.lenght == 0){

        return;

    }else if(horasRegis.length >= 1){

        (document.querySelector('#botoes')).innerHTML = "<button onclick='inserir()'>Inserir</button><button onclick='carregar()'>Carregar</button><button onclick='salvar()'>Salvar</button>";

        const total = document.getElementById("total");
        total.textContent = "Horas totais acumuladas: " + horasTotais;

        (document.querySelector('#tabela')).innerHTML = "<table id='mytable'></table>";
        const tabela = document.getElementById('mytable');

        var cabeca = document.createElement("thead");
        tabela.appendChild(cabeca);

        var row = document.createElement("tr");
        cabeca.appendChild(row);

        var col = document.createElement("th");
        col.textContent = "Atividade";
        row.appendChild(col);

        col = document.createElement("th");
        col.textContent = "Tipo de Atividade";
        row.appendChild(col);

        col = document.createElement("th");
        col.textContent = "Nome da atividade";
        row.appendChild(col);

        col = document.createElement("th");
        col.textContent = "Horas registradas";
        row.appendChild(col);

        col = document.createElement("th");
        col.textContent = "Aproveitadas";
        row.appendChild(col);

        col = document.createElement("th");
        col.textContent = "Válidas";
        row.appendChild(col);

        horasRegis.forEach(option => {

            row = document.createElement("tr");
            tabela.appendChild(row);
    
            col = document.createElement("td");
            col.textContent = option.atv;
            row.appendChild(col);
    
            col = document.createElement("td");
            col.textContent = option.nome;
            row.appendChild(col);

            col = document.createElement("td");
            col.textContent = option.espec;
            row.appendChild(col);
    
            col = document.createElement("td");
            col.textContent = option.horReg;
            row.appendChild(col);
    
            col = document.createElement("td");
            col.textContent = option.horApro;
            row.appendChild(col);

            col = document.createElement("td");
            col.textContent = option.horVal;
            row.appendChild(col);

            col = document.createElement("button");
            col.textContent = "excluir";
            col.setAttribute('onclick','excluir('+aux+')');
            aux+=1;
            row.appendChild(col);
    
        });

        optionsAtv.forEach(option =>{

            if(option.acum > 0){

                const div = document.getElementById("tabela");

                var tab = document.createElement("table");
                
                div.appendChild(tab);

                cabeca = document.createElement("thead");
                tab.appendChild(cabeca);

                row = document.createElement("tr");
                cabeca.appendChild(row);

                col = document.createElement("th");
                col.textContent = option.nome + " /Limite de horas: " + option.lim;
                row.appendChild(col);

                col = document.createElement("th");
                col.textContent = "Horas Totais:";
                row.appendChild(col);

                col = document.createElement("th");
                col.textContent = option.acum;
                row.appendChild(col);

                cabeca = document.createElement("thead");
                tab.appendChild(cabeca);

                row = document.createElement("tr");
                cabeca.appendChild(row);

                col = document.createElement("th");
                col.textContent = "Atividade";
                row.appendChild(col);

                col = document.createElement("th");
                col.textContent = "Horas Acumuladas";
                row.appendChild(col);

                col = document.createElement("th");
                col.textContent = "Limite de horas";
                row.appendChild(col);

                if(option.nome == 'Atividade de extensão'){

                    optionsExt.forEach(option1 => {

                        if(option1.acum > 0){

                            row = document.createElement("tr");
                            cabeca.appendChild(row);

                            col = document.createElement("th");
                            col.textContent = option1.nome;
                            row.appendChild(col);

                            col = document.createElement("th");
                            col.textContent = option1.acum;
                            row.appendChild(col);

                            col = document.createElement("th");
                            col.textContent = option1.lim;
                            row.appendChild(col);

                        }

                    });

                }else if(option.nome == 'Atividade de pesquisa'){

                    optionsPes.forEach(option1 => {

                        if(option1.acum > 0){

                            row = document.createElement("tr");
                            cabeca.appendChild(row);

                            col = document.createElement("th");
                            col.textContent = option1.nome;
                            row.appendChild(col);

                            col = document.createElement("th");
                            col.textContent = option1.acum;
                            row.appendChild(col);

                            col = document.createElement("th");
                            col.textContent = option1.lim;
                            row.appendChild(col);

                        }

                    });

                }else if(option.nome == 'Atividade de ensino'){

                    optionsEns.forEach(option1 => {

                        if(option1.acum > 0){

                            row = document.createElement("tr");
                            cabeca.appendChild(row);

                            col = document.createElement("th");
                            col.textContent = option1.nome;
                            row.appendChild(col);

                            col = document.createElement("th");
                            col.textContent = option1.acum;
                            row.appendChild(col);

                            col = document.createElement("th");
                            col.textContent = option1.lim;
                            row.appendChild(col);

                        }

                    });

                }

            }

        });

    }

}

function atividades(){

    const e = document.getElementById('customSelect');

    if(e.selectedIndex == 1){

        (document.querySelector('#select2')).innerHTML = "<select id='customSelect2'></select>";

        const selectExt = document.getElementById('customSelect2');

        optionsExt.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option.nome;
            selectExt.appendChild(optionElement);
        });

    }else if(e.selectedIndex == 2){

        (document.querySelector('#select2')).innerHTML = "<select id='customSelect2'></select>";

        const selectPes = document.getElementById('customSelect2');

        optionsPes.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option.nome;
            selectPes.appendChild(optionElement);
        });

    }else if(e.selectedIndex == 3){

        (document.querySelector('#select2')).innerHTML = "<select id='customSelect2'></select>";

        const selectEns = document.getElementById('customSelect2');

        optionsEns.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option.nome;
            selectEns.appendChild(optionElement);
        });

    }else{

        (document.querySelector('#select2')).innerHTML = null;

    }


}


function insElemRegi(atv, nome, numHoras, horaApro, horaVal, espec){

    horasRegis.push({

        atv: atv,
        nome: nome,
        horReg: numHoras,
        horApro: horaApro,
        horVal: horaVal,
        espec: espec

    });

    horasTotais+=horaVal;

}

function inserirHorReg(e,f,options,numHoras,espec,horaApro,nome,horaVal){

    horaApro = (numHoras * options[f.selectedIndex].apro)/100;

    var atv = optionsAtv[e.selectedIndex].nome;

    if(optionsAtv[e.selectedIndex].acum == optionsAtv[e.selectedIndex].lim){

        horaVal = 0;

    }else{

        if(options[f.selectedIndex].acum == options[f.selectedIndex].lim){

            horaVal = 0;

        }else{

            if((options[f.selectedIndex].acum + horaApro) >= options[f.selectedIndex].lim){

                horaVal = options[f.selectedIndex].lim - options[f.selectedIndex].acum;

                if((optionsAtv[e.selectedIndex].acum + horaVal) >= optionsAtv[e.selectedIndex].lim){

                    horaVal = optionsAtv[e.selectedIndex].lim - optionsAtv[e.selectedIndex].acum;

                    optionsAtv[e.selectedIndex].acum = optionsAtv[e.selectedIndex].lim;

                    options[f.selectedIndex].acum += horaVal;

                }else{

                    optionsAtv[e.selectedIndex].acum += horaVal;

                    options[f.selectedIndex].acum = options[f.selectedIndex].lim;

                }

            }else{

                if((optionsAtv[e.selectedIndex].acum + horaApro) >= optionsAtv[e.selectedIndex].lim){

                    horaVal = optionsAtv[e.selectedIndex].lim - optionsAtv[e.selectedIndex].acum;

                    optionsAtv[e.selectedIndex].acum = optionsAtv[e.selectedIndex].lim;

                    options[f.selectedIndex].acum += horaVal;

                }else{

                    options[f.selectedIndex].acum += horaApro;

                    optionsAtv[e.selectedIndex].acum += horaApro;

                    horaVal = horaApro;

                }

            }

        }

    } 

    nome = options[f.selectedIndex].nome;

    insElemRegi(atv, nome, numHoras, horaApro, horaVal, espec)

}

function inserir(){

    const e = document.getElementById('customSelect');

    const f = document.getElementById('customSelect2');

    if(f.selectedIndex > 0){

        const numHoras = document.querySelector('#numHor').value < 1 ? document.querySelector('#numHor').value * -1 : document.querySelector('#numHor').value;
        const espec = document.querySelector('#espec').value;
        var horaApro = 0;
        var nome = '';
        var horaVal = 0;

        if(e.selectedIndex == 1){

            inserirHorReg(e, f, optionsExt, numHoras, espec, horaApro, nome, horaVal);  

        }else if(e.selectedIndex == 2){

            inserirHorReg(e, f, optionsPes, numHoras, espec, horaApro, nome, horaVal);  
     

        }else if(e.selectedIndex == 3){

            inserirHorReg(e, f, optionsEns, numHoras, espec, horaApro, nome, horaVal);  

        }

        exibirTabela();

    }else{

        exibirTabela();

    }

}

async function salvar_opt(options, nome){

    var opt = await db.collection(nome);

    aux = 0;
    
    options.forEach(option => {

        var opt2 = opt.doc(aux.toString())

        aux+=1

        opt2.set(option)

    });

}

async function excHorDB(){

    showLoading();

    const categoria = db.collection('Horas registradas');
    const snapshot = await categoria.get()

    snapshot.forEach(doc => {

        categoria.doc(doc.id).delete()

    })

    salvar_opt(horasRegis, 'Horas registradas');

    hideLoading();

}

function salvar(){

    excHorDB();

    salvar_opt(optionsAtv, 'Opções de atividade');
    salvar_opt(optionsExt, 'Opções de extensão');
    salvar_opt(optionsPes, 'Opções de pesquisa');
    salvar_opt(optionsEns, 'Opções de ensino');
    
}

async function carHoraRegi(){

    showLoading();

    horasRegis = [];

    var opt = await db.collection('Horas registradas').get();

    opt.forEach(option => {

        var dados = option.data();

        insElemRegi(dados.atv, dados.nome, dados.horReg, dados.horApro, dados.horVal, dados.espec)

    })

    hideLoading();

    exibirTabela();

}

async function carAtvs(options, nome){

    var opt = await db.collection(nome).get();
    
    options.forEach(option => {

        opt.forEach(option2 =>{

            var dados = option2.data();

            if(option2.id != "0" && dados.nome == option.nome){

                option.acum = dados.acum;

            }


        })

    });


}

function carregar(){

    horasTotais = 0;

    carAtvs(optionsAtv, 'Opções de atividade');
    carAtvs(optionsExt, 'Opções de extensão');
    carAtvs(optionsPes, 'Opções de pesquisa');
    carAtvs(optionsEns, 'Opções de ensino');

    carHoraRegi();
    
}

var tabela;
var horasTotais = 0;

var selectElement = document.getElementById('customSelect');

optionsAtv.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.textContent = option.nome;
    selectElement.appendChild(optionElement);
});


