import {drawTree, Utils} from './canvas.js';

class NodeList{
    constructor(_val = null)
    {
        this.next = null;
        this.value = _val;
    }
}
class LinkedList{
    constructor(key = null ){
        if(key){
            this.root = new NodeList(key);
            this.size = 1;
        }
        else{
            this.size = 0;
            this.root = null;
        }
    }

    isEmpty()
    {
        if(this.size === 0 || this.root === null)
        {
            return true;
        }
        else{
            return false;
        }
    }

    setRoot(key, queue = null)
    {
        if(this.isEmpty())
        {
            this.root = new NodeList(key);
        }
        else{
            let node = new NodeList(key);
            node.next = this.root;
            this.root = node;
        }
        this.size++;
        queue.push([key, 1]);
    }


    setValue(key, queue = null){
        if(this.isEmpty())
        {
            this.setRoot(key, queue);
            return;
        }
        this.root = this.setnewValue(key, queue, this.root);
        this.size++;
    }

    setnewValue(key, queue, self = null)
    {
        if(self.value > key)
        {
            queue.push([key, 1]);
            let node = new NodeList(self.value);
            self.value = key;
            node.next = self.next;
            self.next = node;
            return self;
        }
        if(self.next)
        {
            queue.push([self.value, 3]);
            self.next = this.setnewValue(key, queue, self.next);
        }
        else
        {
            self.next = new NodeList(key);
            queue.push([key, 1]);
        }

        return self;
    }

    deleteKey(key, queue = null){
        //if first root value is null return
        if(this.isEmpty())
        {
            return;
        }
        this.root = this.deletetheKey(key, queue, this.root);
        this.size--;
    }

    deletetheKey(key, queue, self = null)
    {
        if (self.value === key){
            queue.push([self.value, 2]);
            self = self.next;
            return self;
        }
        if(self.next){
            queue.push([self.value, 3]);
            self.next = this.deletetheKey(key,queue,self.next);
        }
        return self;
    }

    search(key, queue)
    {
        let node = this.root;
        while(node != null)
        {
            if(node.value == key)
            {
                queue.push([self.value, 4]);
                break;
            }
            queue.push([self.value, 3]);
            node = node.next;
        }
    }

    getRoot(){
        if(!this.isEmpty())
        {
            return this.root.value;
        }
    }
}

class BST{

    constructor(key = null){
        this.left = null;
        this.right = null;
        this.value = key;
        this.recentInsert = false;
    }

    setValue(key, self = null){
        if(this.value === null){
            this.value = key;
            this.recentInsert = true;
            return;
        }

        else if( self === null ){
            self = this;
        }

        if(key >= self.value){
            if( self.right != null ){
                this.setValue(key, self.right);
            }else{
                self.right = new BST(key);
                if(self.recentInsert){
                    self.recentInsert = false;
                }
                self.right.recentInsert = true; 
            }
        }
        if(key < self.value){
            if( self.left != null ){
                this.setValue(key, self.left);
            }else{
                self.left = new BST(key);
                if(self.recentInsert){
                    self.recentInsert = false;
                }
                self.left.recentInsert = true; 
            }
        } 
    }
}

//class that Handles Data Structures data for whole runtime
const LinBst={
    Link : new LinkedList(),
    Bst : new BST(),
    inputedValues : [[15,1],[123,1],[12,1],[20,1],[642,1],[123,2],[299,1]],
    Contained: function(number){
                    let node = LinBst.Link.root;
                    while(node!=null)
                    {
                        if(node.value === number)
                        {
                            return true;
                        }
                        node = node.next;
                    }
            }
}




function Linked(number, mode, delet = 0){
    let queue=[];
    if(LinBst.Contained(number))
    {
        if(mode === 1)
        {
            alert("Number dublication Restricted");
            return;
        }
    }
    else{
        if(mode === 2)
        {
            alert("Number not found");
        }
    }

    if (mode == 1){
        LinBst.Link.setValue(number,  queue);
        if(LinBst.Link.size >= 1 && delet != 0){
            LinBst.Link.deleteKey(number, []);
        }
    }
    else if(mode == 2 && LinBst.Link.size != 0){
        LinBst.Link.deleteKey(number, queue);
        if(delet != 0)
        {
            LinBst.Link.setValue(number, []);
        }
    }
    else{
        LinBst.Link.search(number, queue);
    }
    Utils.queue = queue;
}

function Bst(mode, number){
    LinBst.Bst.clearRecentPriority();
    if (mode === 1){
        LinBst.Bst.setValue(number);
    }
    else if (mode == 2){
        LinBst.Bst.deleteKey(number);
    }
    else{
        LinBst.Bst.clearList();
    }
    drawTree(LinBst.Bst, 2); 
}

export {Linked, Bst, LinBst};