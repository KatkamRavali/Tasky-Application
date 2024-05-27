// -------------- Example Purpose --------------
// var state = {
//   taskList: [
//     {
//       ImageUrl: "",
//       taskTitle: "",
//       taskType: "",
//       taskDescription: "",
//     },
//     {
//       ImageUrl: "",
//       taskTitle: "",
//       taskType: "",
//       taskDescription: "",
//     },
//     {
//       ImageUrl: "",
//       taskTitle: "",
//       taskType: "",
//       taskDescription: "",
//     },
//     {
//       ImageUrl: "",
//       taskTitle: "",
//       taskType: "",
//       taskDescription: "",
//     },
//     {
//       ImageUrl: "",
//       taskTitle: "",
//       taskType: "",
//       taskDescription: "",
//     },
//   ],
// };

// State : It is used to store anything [but here state is just a variable]
// ------------------------- Used to store on the array list [backup storage] -----------------------------
const state = {
    taskList : [],
};

// DOM Operations syntax : dom.methods
const taskContents = document.querySelector(".task__contents"); // task__contents is the defined class [by me]
// console.log(taskContents);

const taskModal = document.querySelector(".task__modal_body"); // task__modal_body is the defined class [by me]
// console.log(taskModal);

// here id : it is used to identify the cards
// ----------------------- Template for the Card on the screen --------------------------------
// here in 18th line inside class : task__card is the define name 
const htmlTaskContents = ({id , url , title , type , description}) =>  ` 
    <div class="col-md-6 col-lg-4 mt-3 mb-10" id=${id} key=${id}>
        <div class="card shadow-sm task__card"> 
          
            <div class="card-header d-flex justify-content-end task__card_header">
                <button type="button" class="btn btn-outline-info me-2" name=${id} onclick="EditTask.apply()">
                    <i class="fa-solid fa-pen-to-square name=${id}"></i>
                </button>
                <button type="button" class="btn btn-outline-danger" name=${id} onclick="DeleteTask.apply()">
                    <i class="fa-solid fa-trash name=${id}"></i>
                </button>
            </div>

            <div class='card-body'>
                ${
                  // --------------- This is for [if we have image it will display or else no ] ----------
                  //  url &&
                  //  `<img src=${url} class="card-img-top md-3 rounded-lg" alt="Card Image" />`

                  // --------------- This is for [if we have image it will display or else no it will display default image ] ----------
                  url ?
                  `<img src=${url} class="img-fluid place__holder__image mb-3" alt="Card Image">`
                  : `<img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/DefaultImage.png" 
                          class="img-fluid place__holder__image mb-3" 
                          alt="Card Image">`
                }
                <h4 class="card-title task__card_title">${title}</h4>
                <p class="description trim-3-lines text-muted">${description}</p>
                <div class="taskType text-white d-flex flex-wrap">
                    <span class="badge text-bg-info m-1">${type}</span>
                </div>
            </div>

            <div class="card-footer">
                <button type="button" 
                    class="btn btn-outline-info float-right" 
                    data-bs-toggle="modal" 
                    data-bs-target="#OpenTask"
                    onclick="ToOpenTask()"
                    id=${id}>Open Task
                </button> 
            </div>
        </div>
    </div>
`;

// ------------------------ Template for Card when clicked on Open Task -------------------------------
const htmlTaskBody = ({id , url , title , description}) =>  {
    const date = new Date(parseInt(id));
    return `
        <div id=${id} class="card-Details">
            ${
              // --------------- This is for [if we have image it will display or else no ] ----------
              //   url &&
              //   `<img src=${url} class="img-fluid place__holder__image mb-3" alt="Card Image">`

              // --------------- This is for [if we have image it will display or else no it will display default image ] ----------
              url ?
              `<img width="100%" src=${url} class="img-fluid place__holder__image mb-1" alt="Card Image">`
              : `<img width="100%" src="https://upload.wikimedia.org/wikipedia/commons/0/0e/DefaultImage.png"
                      class="img-fluid place__holder__image mb-3" 
                      alt="Card Image">`
            }
            <strong class="text-sm mb-2">Created on : ${date.toDateString()}</strong>
            <h2 class="mb-2">${title}</h2>
            <p class="mb-4">${description}</p>
        </div>
    `;
};

// ------------------- Used to update / store data to the local storage ------------------------------
//  Why we need to store on the local storage
// 1. easy fetch [ You dont need to call the API's again and again and it takes tym to call the data from js file 
// to the browser ]
// Where we convert JSON > str (i.e.., for local storage)
const updateLocalStorage = () => {
    localStorage.setItem(
        "task", // Key and name should always be in a string formate . Here name is the task
        JSON.stringify({
            tasks : state.taskList, // Here key is the least of elements present in an array taskList
        })
    );
};

//  Load initial data
// Where we convert JSON < str (i.e.., for getting the cards on the screen back)
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);

    if(localStorageCopy) state.taskList = localStorageCopy.tasks;

    // Mapping
    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend",htmlTaskContents(cardDate));
    });
};

// When we update or when we edit ... we need to save [this is to get the field items from html to js file ]
const handleSubmit = (event) => {
    console.log("event Triggered");
    // Here date.now changes the value each time you reload so id is unique u gave the attribute as Date.now() 
    const id = `${Date.now()}`;
    const input = {
        url : document.getElementById("ImageUrl").value,  // imageUrl is the id name of the Image url
        title : document.getElementById("taskTitle").value,
        type : document.getElementById("taskType").value,
        description : document.getElementById("taskDescription").value,
    };

    if (input.title === "" || input.type  === "" || input.description === "" ) {
        return alert("Please fill the necessary details");
    }

    // To edit the content and display it on the screen [this is to get the updated data from js file to html] 
    taskContents.insertAdjacentHTML("beforeend",htmlTaskContents({ ...input , id }));
    // To store the updated data in the array called taskList in variable state
    state.taskList.push({ ...input , id });
    //  To store the things on the browser
    updateLocalStorage();
};

// Open Task [ When we click on open task we need the same details in a big screen to be displayed ]
const ToOpenTask = (e) => {
    if(!e) e = window.event; // Inside of this we can also write in this manner
    // The above line can be committed and inside htmlTaskContents in onclick="ToOpenTask.apply(this , arguments)"

    const getDeatilOT = state.taskList.find(({id}) => id === e.target.id);
    taskModal.innerHTML = htmlTaskBody(getDeatilOT);
}

// Trash Button [Delete Task]
const DeleteTask = (e) => {
    if(!e) e = window.event; // Inside of this we can also write in this manner
    // The above line can be committed and inside htmlTaskContents in onclick="DeleteTask.apply(this , arguments)"

    const DeleteCardId = e.target.getAttribute("name");
    // console.log(DeleteCardId); [when click on that particular tag it will display the id value]
    // console.log(e.target); [when click on that particular tag it will display the entier content]

    const DeleteType = e.target.tagName;
    // console.log(DeleteType);
    
    const removeTask = state.taskList.filter(({id}) => id !== DeleteCardId);  // Remove the content from array taskList
    // console.log(removeTask);
    updateLocalStorage(); // Remove the content from localStorage

    if(DeleteType == "BUTTON") {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild (
            e.target.parentNode.parentNode.parentNode
        );
    } else if (DeleteType == "I") {
        return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild (
            e.target.parentNode.parentNode.parentNode.parentNode
        );
    }
};

// Edit Task 
const EditTask = (e) => {
    if(!e) e = window.event;
    // window.event means that the event has been triggered on the new window or new card

    const editId = e.target.id; // To get the Id
    const editTypes = e.target.tagName; // To get the tag Name 

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let SubmitButton;

    if(editTypes == "BUTTON") {
        parentNode = e.target.parentNode.parentNode; 
                    // button . div => class => card-header . div => class => card
    } else if (editTypes == "I") {
        parentNode = e.target.parentNode.parentNode.parentNode;
                      // i   . button   . div => class => card-header . div => class => card 
    }
    // taskTitle = parentNode.childNodes[3].childNodes[7].childNodes;
    // console.log(taskTitle);

    // h4[1] . div => class => card-body[2] . div => class => card[3]
    taskTitle = parentNode.childNodes[3].childNodes[3]; 
    // console.log(taskTitle);

    // p[1] . h4[2] . div => class => card-body[3] . div => class => card-header[4] . div => class => card[5]
    taskDescription = parentNode.childNodes[3].childNodes[5];
    // console.log(taskDescription);

    // span[1] . div => class => taskType[2] . p[3] . h4[4] . div => class => card-body[5] . 
    // div => class => card-header[6] . div => class => card[7]
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    // console.log(taskType);

    // button[1] . div => class => card-footer[2] . div => class => card-body[3] . div => class => card-header[4] .
    //  div => class => card[5]
    SubmitButton = parentNode.childNodes[5].childNodes[1];
    // console.log(SubmitButton);

    // console.log(taskTitle , taskDescription , taskType , SubmitButton);

    // Set Attribute helps to edit the things from Js file directly to html file 
    // Syntax : setAttribute("contenteditable","true or false");
    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");

    SubmitButton.setAttribute("onclick","saveEdit.apply(this , arguments)");
    // data-bs-toggle="modal" data-bs-target="#OpenTask"
    SubmitButton.removeAttribute("data-bs-toggle");
    SubmitButton.removeAttribute("data-bs-target");
    SubmitButton.innerHTML = "Save Changes";
};

// Save Edit
const saveEdit = (e) => {
    if(!e) e = window.event;
   
    const saveId = e.target.id; 
    const parentNode = e.target.parentNode.parentNode;
    // button . div => class => card-footer . div => class => card 
    // console.log(parentNode.childNodes);

    const taskTitle = parentNode.childNodes[3].childNodes[3]; 
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const SubmitButton = parentNode.childNodes[5].childNodes[1];

    const updateData = {
        Title : taskTitle.innerHTML,
        Description : taskDescription.innerHTML,
        Type : taskType.innerHTML,
    };
    let stateCopy  = state.taskList;

    stateCopy = stateCopy.map((task) => task.id === saveId
            ?{
                  id : task.id,
                  title : updateData.Title,
                  description : updateData.Description,
                  type : updateData.Type,
                  url : task.url,
            }
            : task
        );
        state.taskList = stateCopy;
        updateLocalStorage();

        taskTitle.setAttribute("contenteditable","false");
        taskDescription.setAttribute("contenteditable","false");
        taskType.setAttribute("contenteditable","false");

        SubmitButton.setAttribute("onclick","ToOpenTask.apply(this , arguments)");
        SubmitButton.setAttribute("data-bs-toggle" , "modal");
        SubmitButton.setAttribute("data-bs-target" , "#OpenTask");
        SubmitButton.innerHTML = "Open Task";
};

// Search 
const searchTask = (e) => {
    if(!e) e = window.event;

    while(taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild);
    }
    const resultData = state.taskList.filter(({title}) => 
        title.toLowerCase().includes(e.target.value.toLowerCase())
    ); 
    // console.log(resultData);
    resultData.map((cardData) => {
        taskContents.insertAdjacentHTML("beforeend",htmlTaskBody(cardData))
    });
};
