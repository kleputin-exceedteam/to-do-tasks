const input = $("#input_task");
const taskList = $("#task_list");
const button_del_comp = $("#del_comp_task");
const mark_as_compl = $("#mark_all_comp");
const active_task_button = $("#active_tasks");
const complite_task_button = $("#completed_tasks");
const all_task_button = $("#all_tasks");


let all_tasks = [];
const comp = "comp";
const active = "active";
let id_counter = 0;


function hideTask(index) {
    $("#" + index).hide();
}

function del_task_by_id(index){
    $("#" + index).remove();
}
function showTask(index) {
    $("#" + index).show();
}

function clearInput() {
    input.val('');
}
function change_checkbox_listner(){
    $("input[type=checkbox]").last().change(function () {
        const ident = this.closest('li').id;
        const index = all_tasks.findIndex((val) => {
            return val.id == ident;
        })
        if (this.checked){
            all_tasks[index].status = comp;
        } else {
            all_tasks[index].status = active;
        }
    })
}


function add_delete_listner() {
    $(".close").last().click(function () {
        const splice_id = this.closest('li').id;
        const index = all_tasks.findIndex((val) => {
            return val.id.toString() === splice_id;
        });
        all_tasks.splice(index, 1);
        this.parentNode.remove();
        if (all_tasks.length === 0){
            hideTask("filter");
            hideTask('mark_icon');
        }
    })
}


function add_html_elem(new_task){
    taskList.append(
        "<li id = \"" + (id_counter) + "\" class=\"list-group-item\">" +
        "<span class=\"span_checkboxes\">" +
        "<input class=\"checkboxes\" type=\"checkbox\" value=\"\">" +
        "</span>" +"<span class=\"name_task\">" +
        new_task.name + "</span>" +
    "<button type=\"button\" class=\"close\" aria-label=\"Close\">\n" +
        "                    <span aria-hidden=\"true\">&times;</span>\n" +
        "                </button>" +
        "</li>"
    );
}


input.keypress(function(event){
    const keyCode = event.key;
    if (keyCode === 'Enter'){
        if (input.val().trim().length > 0) {
            const new_task = {name: input.val().trim(), status: active, id: (id_counter)};
            all_tasks.push(new_task);
            add_html_elem(new_task);
            id_counter++;
            add_delete_listner();
            change_checkbox_listner();
            clearInput();
        }
    }
    if (all_tasks.length > 0){
        showTask("filter");
        showTask('mark_icon');
    }
});


mark_as_compl.click(function () { //отметить все как выполненное.
    $(".checkboxes").not(':checked').trigger('click');
})


active_task_button.click(function () {
    all_tasks.forEach((val) => {
        if (val.status === comp){
            hideTask(val.id);
        } else {
            showTask(val.id);
        }
    })
})


complite_task_button.click(function () {
    all_tasks.forEach((val) => {
        if (val.status === active){
            hideTask(val.id);
        } else {
            showTask(val.id);
        }
    })
})


all_task_button.click(function () {
    all_tasks.forEach((val) => {
        showTask(val.id);
    })
})


button_del_comp.click(function () {
    let id_for_del = [];
    all_tasks.forEach((val) => {
        if (val.status === comp){
            del_task_by_id(val.id);
            id_for_del.push(val.id);
        }
    })
    id_for_del.forEach((val_id) => {
        const index = all_tasks.findIndex((val) => { return val.id === val_id});
        if (index !== -1){
            all_tasks.splice(index, 1);
        }
    })
    if (all_tasks.length === 0){
        hideTask("filter");
        hideTask('mark_icon');
    }
})