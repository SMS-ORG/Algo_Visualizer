import {drawTree} from './canvas.js';

class LinkedList{
    static size = 0;
    constructor(key = null ){
        this.next = null;
        this.value = key;
        this.recentInsert = false;
        LinkedList.size ++;
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

        if(self.value > key){
            let node = new LinkedList(self.value);
            node.next = self.next;
            self.value = key;
            self.recentInsert = true;
            self.next = node;
        }
        else if ( self.next === null){
            let node = new LinkedList(key);
            node.recentInsert = true;
            self.next = node;
        }
        else{
            this.setValue(key, self.next);
        }
    }

    deleteKey(key, self = null){
        //if first root value is null return
        if(this.value === null)
        {
            return this;
        }
        else if( this.value == key)   //if root value is equal to key
        {  
            if( this.next != null){   // if next node has a value
                this.value = this.next.value;
                this.next = this.next.next;
            }else{
                this.value = null;
            }
            return this;
        }

        if(self === null){
            LinkedList.size --;
            self = this;
        }
        if (self.value === key){
            if (self.next != null){
                self.value = self.next.value;
                self.next = self.next.next;
                return self;
            }
            else
            {
                return null;
            }
        }
        if ( self.next != null){
            self.next = this.deleteKey(key, self.next);
        }
        return self;
    }

    getRoot(){
        return this.value;
    }

    clearRecentPriority(){
        let self = this;
        while( self!= null){
            if( self.recentInsert ){
                self.recentInsert = false;
            }
            self = self.next;
        }
    }

    clearList(){
        this.value = null;
        this.next = null;
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

    clearRecentPriority(node = null){
        if(node === null){
            node = this;
        }
        if(node.right != null){
            if(node.recentInsert){
                node.recentInsert = false;
            }
            this.clearRecentPriority(node.right);
        }
        if(node.left != null){
            if(node.recentInsert){
                node.recentInsert = false;
            }
            this.clearRecentPriority(node.left);
        }
    }

    clearTree(){
        this.right = null;
        this.value = null;
        this.left = null;
    }
}

//class that Handles Data Structures data for whole runtime
class LinBst{
    static Link = new LinkedList();
    static Bst = new BST();
}

function Linked(mode, number){
    LinBst.Link.clearRecentPriority();
    if (mode === 1){
        LinBst.Link.setValue(number);
    }
    else if (mode == 2){
        LinBst.Link.deleteKey(number);
    }
    else{
        LinBst.Link.clearList();
    }
    /* Temp Code */
    LinBst.Link.setValue(12); // Insert Value into linked list 
    LinBst.Link.setValue(123);
    LinBst.Link.setValue(1212);
    LinBst.Link.setValue(13);
    LinBst.Link.setValue(124);
    LinBst.Link.clearRecentPriority();  // The last inserted data value is green Coloured bubble ->
    LinBst.Link.setValue(13123);        // so Clear Recent Priority makes the coloured bubble normal
    drawTree(LinBst.Link, 1);  //calls Drawtree with flag value=(1) to draw linked list
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

export {Linked, Bst}