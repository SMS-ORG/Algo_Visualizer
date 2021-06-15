import {Utils, main, sort} from "./canvas.js";
var toggler = "";

//Add active class to Selected links
function ChangeActive(x) {
    let active = "active";
    if (toggler.length == 0) {
        toggler = x;
    } else {
        let ele = document.getElementById(toggler)
        ele.classList.remove(active);
        ele.style.pointerEvents = "auto";
        toggler = x;
    }
    let element = document.getElementById(toggler);
    element.classList.add(active);
    element.style.pointerEvents = "none";
}

//switch radio buttons
function checkRadio(event) {
    switch(this.value){
        case '1':
                // for new start
            break;
        case '2':
                // for new end
            break;
        case '3':
                //for remove mode 
            break;
        case '4':
                //for insert mode (default)
            break;
        default:
            console.log("default");
    }
}


const BubbleSort = ()=>{ 
    ChangeActive("bubblesort"); 
    };                                      //function for bubblesort

const HeapSort = ()=>{ 
    ChangeActive("heapsort");
    };                                      //function for Heapsort

const QuickSort = ()=>{ 
    ChangeActive("quicksort")               //function for quicksort
    }; 
const MergeSort = ()=>{ 
    ChangeActive("mergesort");
    };                                      //function for MergeSort

const PathFind = ()=>{ 
    ChangeActive("pathfind");
    };                                      //function for Path Finding Algorithm

const Linkedlist = ()=>{
    ChangeActive("linkedlist");
};                                          //function for Linked List

const Bst = ()=>{
    ChangeActive("bst");                    //function for Bst
}

function Sortingmethod() {
    if (toggler) {
        if (toggler === "pathfind" || toggler === "bst" || toggler === "linkedlist") {
            sort(toggler);
            return;
        }
    
        if (Utils.Sorting.arr.length == 0) {
            alert("Slide on the slider");
        } else {
            sort(toggler, Utils.Sorting.arr);
        }
    } else {
        alert("Select A Method First");
    }
}

(function (window, document, undefined) {

    // code that should be taken care of right away
    window.onload = init;

    function init() {
        // the code to be called when the dom has loaded
        // #document has its nodes
        document.getElementById("bubblesort").addEventListener("click", BubbleSort, false);
        document.getElementById("quicksort").addEventListener("click", QuickSort, false);
        document.getElementById("heapsort").addEventListener("click", HeapSort, false);
        document.getElementById("mergesort").addEventListener("click", MergeSort, false);
        document.getElementById("pathfind").addEventListener("click", PathFind, false);
        document.getElementById("bst").addEventListener("click", Bst, false);
        document.getElementById("linkedlist").addEventListener("click", Linkedlist, false);
        document.getElementById("clickable").addEventListener("click", Sortingmethod, false);


        document.getElementById("insert").addEventListener("click", checkRadio);
        document.getElementById("deleteNode").addEventListener("click", checkRadio);
        document.getElementById("insertEnd").addEventListener("click", checkRadio);
        document.getElementById("insertStart").addEventListener("click", checkRadio);

        document.querySelectorAll('input[type=radio][name="Insert"]').forEach(element => 
            {
                element.addEventListener("change",checkRadio);
            }
        );
        
        document.getElementById('canvas').style.visibility = "hidden";
        let slider = document.getElementById("myRange");

        slider.oninput = function () {
            Utils.Sorting.newarray(slider.value);
            main(Utils.Sorting.arr);
        }
    }

})(window, document, undefined);