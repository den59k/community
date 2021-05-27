import { makeAutoObservable, observable } from "mobx";

export default class ModalWindowStore {

	windowHistory = observable.array([], { deep: false })
	scroll = {}

	constructor(){
		makeAutoObservable(this)
	}

	get opened(){
		return this.windowHistory.length > 0
	}

	get currentWindow (){
		return this.opened? this.windowHistory[this.windowHistory.length-1]: null
	}

	replaceCurrent(modalWindow){
		this.windowHistory[this.windowHistory.length-1] = modalWindow
	}

	open(modalWindow){

		// this.scroll = {
		// 	left: window.pageXOffset, 
		// 	top: window.pageYOffset, 
		// 	offset: window.innerWidth-document.body.clientWidth
		// }

		this.windowHistory.push(modalWindow)
		//window.requestAnimationFrame(() => window.scroll(0, 0))
	}

	close(){
		if(!this.opened) return
		this.windowHistory.pop()
		//window.requestAnimationFrame(() => window.scroll(this.scroll.left, this.scroll.top))
	}

	closeAll(){
		this.windowHistory.clear()
		//window.requestAnimationFrame(() => window.scroll(this.scroll.left, this.scroll.top))
	}
}