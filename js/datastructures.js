import {Utils} from './canvas.js';

class NodeList{
    constructor(_val = null)
    {
        this.next = null;
        this.value = _val;
    }
}

class NodeBst
{
    constructor(_val = null)
    {
        this.left = null;
        this.right = null;
        this.value = _val;
    }
}

class LinkedList{
    constructor( )
    {
        this.size = 0;
        this.root = null;
    }

    isEmpty()
    {
        return this.root === null;
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
            queue.push([key,1]);
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
            queue.push([self.value, 3]);
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
                queue.push([node.value, 4]);
                break;
            }
            queue.push([node.value, 3]);
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

    constructor(){
       this.root = null;
       this.size = 0;
    }


    isEmpty()
    {
        return this.root === null;
    }

    search(number, queue)
    {
        let node = this.root;
        while(node!=null)
        {
            if(node.value === number)
            {
                queue.push([node.value, 4]);
                break;
            }
            else if(node.value < number)
            {
                queue.push([node.value, 3]);
                node = node.right;
            }
            else{
                queue.push([node.value, 3]);
                node = node.left;
            }
        }
    }
    
    setValue(key, queue){               
        if(this.isEmpty())
        {
            queue.push([key,1]);
            let newNode = new NodeBst(key);
            this.root = newNode;
            this.size++;
        }
        else
        {
            this.insertNode(this.root, key, queue);
        }
    }

    insertNode(node, key, queue)
    {
        if(key < node.value)
        {
            if(node.left === null)
            {
                queue.push([node.value, 3]);
                queue.push([key,1]);
                node.left = new NodeBst(key);
                this.size++;
            }
            else
            {
                queue.push([node.value, 3]);
                this.insertNode(node.left, key, queue);
            }
        }
        else
        {
            if(node.right === null)
            {   
                queue.push([node.value, 3]);
                queue.push([key, 1]);
                node.right = new NodeBst(key);
                this.size++;
            }
            else
            {
                queue.push([node.value, 3]);
                this.insertNode(node.right, key, queue);
            }
        }
    }

    display(key, queue)
    {
        if(!this.isEmpty())
        {
            if(key === 5)
            {
                this.inOrder(queue,this.root);
            }
            else if(key === 6)
            {
                this.preOrder(queue, this.root);
            }
            else
            {
                this.postOrder(queue, this.root);
            }
        }
    }

    inOrder(queue, node = null)
    {
        if(node !== null)
        {
            this.inOrder(queue, node.left);
            queue.push([node.value,3]);
            this.inOrder(queue,node.right);
        }
    }

    preOrder(queue, node = null)
    {
        if(node !== null)
        {
            queue.push([node.value,3]);
            this.preOrder(queue, node.left);
            this.preOrder(queue, node.right);
        }
    }

    postOrder(queue, node = null)
    {
        if(node !== null)
        {
            this.postOrder(queue, node.left);
            this.postOrder(queue, node.right);
            queue.push([node.value,3]);
        }
    }

    deleteKey(data, queue = null)
    {
        if(!this.isEmpty()){
            this.root = this.removeNode(this.root, data, queue);
        }
    }

    findMinNode(node)
    {
        if(node.left === null)
        {
            return node;
        }
        else
        {
            return this.findMinNode(node.left);
        }
    }

    removeNode(node, key, queue = null)
    {
    
        if(node === null)
        {
            return null;
        }
        else if(key < node.value)
        {   
            if(queue != null){
                queue.push([node.value, 3]);
            }
            node.left = this.removeNode(node.left, key, queue);
            return node;
        }
        else if(key > node.value)
        {
            if(queue != null){
                queue.push([node.value, 3]);
            }
            node.right = this.removeNode(node.right, key, queue);
            return node;
        }
        else
        {
            if(node.left === null && node.right === null)
            {
                if(queue != null){
                    queue.push([node.value, 2]);
                }
                else{
                    node = null;
                    this.size--;
                }
                return node;
            }
            if(node.left === null)
            {
                if(queue != null){
                    queue.push([node.value, 2]);
                }
                else{
                    node = node.right;
                    this.size--;
                }
                return node;
            }
            
            else if(node.right === null)
            {
                if(queue != null){
                    queue.push([node.value, 2]);
                }else
                {
                    node = node.right;
                    this.size--;
                }
                return node;
            }
            if(node.value === key ){
                if(queue != null){                
                    queue.push([node.value, 4]);
                }
            }
            else
            {
                if(queue != null){
                    queue.push([node.value, 3]);
                }
            }
            var aux = this.findMinNode(node.right);
            node.value = aux.value;
            node.right = this.removeNode(node.right, aux.value, queue);
            return node;
        }
    
    }

}

//class that Handles Data Structures data for whole runtime
const LinBst={
    Link : new LinkedList(),
    Bst : new BST(),
    inputedValues :[],
    contained: function(number)
    {
        let node = LinBst.Link.root;
        while(node != null)
        {
            if(node.value === number)
            {
                return true;
            }
            node = node.next;
        }
        return false;
    },
    containedinBST: function(number)
    {
        let node = LinBst.Bst.root;
        while(node != null)
        {
            if(node.value === number)
            {
                return true;
            }
            if(number>node.value)
            {
                node = node.right;
            }
            else
            {
                node = node.left;
            }
        }
        return false;
    }
}

function Linked(number, mode, offset){
    let queue=[];
    if (mode == 1){
        LinBst.Link.setValue(number,  queue);
        if(offset === 1)
        {
            LinBst.Link.deleteKey(number, []);
        }
    }
    else if(mode == 2 && LinBst.Link.size != 0){
        LinBst.Link.deleteKey(number, queue);
        LinBst.Link.setValue(number, []);
    }
    else{
        LinBst.Link.search(number, queue);
    }
    Utils.queue = queue;
}

function Bst(number, mode,offset){
    let queue = [];
    if (mode === 1){
        if(offset === 1)
        {
            LinBst.Bst.setValue(number, queue);
            LinBst.Bst.deleteKey(number);
        }
        else
        {
            LinBst.Bst.setValue(number, []);
        }
    }
    else if (mode === 2){
        LinBst.Bst.deleteKey(number, queue);
    }
    else if(mode === 4)
    {
        LinBst.Bst.search(number,queue);
    }
    else{
        LinBst.Bst.display(mode, queue);
    }
    Utils.queue = queue;
}

export {Linked, Bst, LinBst};