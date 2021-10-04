
var cct = gtask.concat(task);
var calcType = "tasks";
var presType = "dep";
var factType = "f";

function Search(e){
    var t = e.currentTarget;
    var v = t.value;
    var c = document.querySelector('.search .custom h4');
    c.textContent = v;
    
    SearchTask(v);
}

function SearchTask(v){

    var main = document.querySelector('.search > main');
    main.innerHTML = '';

    if(v && v !== ''){

        var array = scoreIt(v, cct, {path: ['nom']});
        
        for(var i=0; i<array.length; i++){

            if(array[i].score < 50){i=array.length;continue;}

            var s = array[i].obj.sub;
            ul = '', g = '';
            if(s){
                ul = subTasks(s)
                g = 'group';
            }

            let p = array[i].obj.prix;
            let n = array[i].obj.nom;
            let id = array[i].id
            let c = currentTasks[id];
            let h = c || c === 0 ? 'h' : '';
            let e = c || c === 0 ? '' : `onclick="addTask(${id});"`;

            var template = 
            `<div class="task ${g} ${h}" ${e}>
                <div class="title">
                    <h4>${n}</h4>
                    <p>${(p > 0 ? p+devise : 'offert')}</p>
                </div>
                ${ul}
            </div>`

            main.insertAdjacentHTML('beforeend', template);

        }

    }

}

function addTask(id){

    // update in current active tasks
    closeSearch();

    var exist = currentTasks[id];

    if(!exist){
        
        var main = document.querySelector('.formulaire .bloc.task .task_list');
        var t = cct[id];

        var p = t.prix;
        var s = t.sub, ul = '';

        currentTasks[id] = p;
        updatePrice();

        if(s){
            ul = subTasks(s)
        }

        var template =
        `<section data-id="${id}">
            <div class="desc">
                <div class="title">
                    <h4>${t.nom}</h4>
                    <p>${(p > 0 ? p+devise : 'offert')}</p>
                </div>
                ${ul}
            </div>
            <button onclick="delTask(${id});">
                <svg><use xlink:href="#icon-delete"></use></svg>
            </button>
        </section>`;

        main.insertAdjacentHTML('beforeend', template);

    }

}

function delTask(id){

    currentTasks[id] = false;
    var main = document.querySelector('.formulaire .bloc.task .task_list');
    var child = main.querySelector('[data-id="'+id+'"]')

    main.removeChild(child);
    updatePrice();

}

function subTasks(array){

    var li = '';

    for(var i=0; i<array.length; i++){
        li+= '<li>'+task[array[i]].nom+'</li>';
    }

    return '<ul>'+li+'</ul>';

}

// add the task into cct array[]
function addCustomTask(){

    var p = Number(document.querySelector('.search .custom p').textContent.replace(/[^0-9]/gi, ''));
    var n = document.querySelector('.search .custom h4').textContent;

    if(n !== ''){

        var obj = {
            nom: n,
            prix: p,
        }
        
        var genID = cct.length;

        // push the task
        cct.push(obj);
        addTask(genID);

    }

}

function closeSearch(){
    var search = document.querySelector('.search');
    search.classList.add('h');
}

function updatePrice(){

    var b = document.querySelector('.formulaire .task .total b');
    var total = 0;
    var v = 0;

    if(calcType === 'tasks'){

        for(var key in currentTasks){
            var r = currentTasks[key];
            if(r){
                total += r;
            }
        }

    }
    
    else if(calcType === 'hours'){

        var input = document.querySelector('.formulaire .task .total input');
        v = input.value;

        total = heure * v;

    }

    b.textContent = total + devise;
    return {total: total, h: v};

}