import { makeAutoObservable } from "mobx";

class RouterStore {

	stack = []

	constructor(){
		makeAutoObservable(this)
	}

	get currentPage (){
		if(this.stack.length === 0) return { page: null }
		return this.stack[this.stack.length-1]
	}

	pop(){
		this.stack.pop()
	}

	clear(){
		this.stack.clear()
	}

	push(str){
		this.stack.push(str)
	}
}

export default RouterStore