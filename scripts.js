const input = $("#input_task");
const taskList = $("#task_list");
const button_del_comp = $("#del_comp_task");
const mark_as_compl = $("#mark_all_comp");
const active_task_button = $("#active_tasks");
const complite_task_button = $("#completed_tasks");
const all_task_button = $("#all_tasks");
const left_tasks_label = $("#left_items");


let all_tasks = [];
const comp = "comp";
const active = "active";
const all = "all";
let id_counter = 0;
let mark_comp_flag = false;
let active_filter = all;
let left_tasks = 0;

function update_left_tasks(){
    left_tasks_label.text(left_tasks + " items left");
}

function update_del_button() {
    const comp_tasks = $(".checkboxes:checked").length;
    if (comp_tasks > 0){
        $("#del_comp_task").css("color", "black");
    } else {
        $("#del_comp_task").css("color", "transparent");
    }
}

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
        const task = all_tasks[index];
        if (this.checked){
            this.classList.add("checked");
            this.parentNode.classList.add("checked");
            task.status = comp;
            left_tasks--;
        } else {
            task.status = active;
            left_tasks++;
            this.classList.remove("checked");
            this.parentNode.classList.remove("checked");
        }
        if (active_filter !== (task.status && all)){
            hideTask(task.id);
        }
        update_left_tasks();
        update_del_button();
    })
}


function add_delete_listner() {
    $(".close").last().click(function () {
        const splice_id = this.closest('li').id;
        const index = all_tasks.findIndex((val) => {
            return val.id.toString() === splice_id;
        });
        if(all_tasks[index].status == active){
            left_tasks--;
        }
        update_left_tasks();
        all_tasks.splice(index, 1);
        this.parentNode.remove();
        if (all_tasks.length === 0){
            hideTask("filter");
            hideTask('mark_icon');
            hideTask("task_list");
        }
        update_del_button();
    })
}


function add_html_elem(new_task){
    taskList.append(
        "<li id = \"" + (id_counter) + "\" class=\"list-group-item\">" +
        "<label class=\"span_checkboxes container\">" +
        "<input class=\"checkboxes checkbox\" type=\"checkbox\" value=\"\">" +
        "<span class='checkmark'></span>" +
        "</label>" +
        "<span class=\"name_task\">" +
         new_task.name + "</span>" +
        "<span type=\"button\" class=\"close\" aria-label=\"Close\">\n" +
        "<i class=\"fas fa-times\"></i>" +
        "                </span>" +
        "</li>"
    );
    if(active_filter === comp){
        hideTask(id_counter);
    }
}


input.keypress(function(event){
    const keyCode = event.key;
    if (keyCode === 'Enter'){
        if (input.val().trim().length > 0) {
            const new_task = {name: input.val().trim(), status: active, id: (id_counter)};
            all_tasks.push(new_task);
            add_html_elem(new_task);
            id_counter++;
            left_tasks++;
            add_delete_listner();
            change_checkbox_listner();
            clearInput();
            update_left_tasks();
        }
    }
    if (all_tasks.length > 0){
        showTask("filter");
        showTask('mark_icon');
        showTask("task_list");
    }
});


mark_as_compl.click(function () { //отметить все как выполненное.
    if (!mark_comp_flag){
        $(".checkboxes").not(':checked').trigger('click');
        mark_comp_flag = true;
        update_del_button();
    } else {
        $(".checkboxes:checked").trigger('click');
        mark_comp_flag = false;
        update_del_button();
    }
    update_left_tasks();
})


active_task_button.click(function () {
    all_tasks.forEach((val) => {
        if (val.status === comp){
            hideTask(val.id);
        } else {
            showTask(val.id);
        }
    })
    active_filter = active;
})


complite_task_button.click(function () {
    all_tasks.forEach((val) => {
        if (val.status === active){
            hideTask(val.id);
        } else {
            showTask(val.id);
        }
    })
    active_filter = comp;
})


all_task_button.click(function () {
    all_tasks.forEach((val) => {
        showTask(val.id);
    })
    active_filter = all;
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
        hideTask("task_list");
    }
    left_tasks = all_tasks.filter(val => val.status === active).length;
    update_left_tasks();
    update_del_button();
})
