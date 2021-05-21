import { makeAutoObservable } from "mobx"

class RouterStore {
	levels = []
	constructor(){
		makeAutoObservable(this)
		this.updateFromURL()
		window.onpopstate = () => this.updateFromURL()
	}

	updateFromURL(){
		const parsed = window.location.pathname.slice(1).split('/').filter(item => !!item)
		this.levels = parsed
	}

	push(to, level){
		if(level){
			for(let i = level; i < this.levels.length; i++)
				this.levels.pop()

			this.levels.push(to)
		}else
			this.levels = to.split('/').filter(item => !!item)

		window.history.pushState({}, '', this.url)
	}

	replace(to, level){
		this.levels[level] = to
		window.history.replaceState({}, '', this.url)
	}

	get(level){
		if(level < this.levels.length)
			return this.levels[level]
		else
			return null
	}

	get length(){
		return this.levels.length
	}

	get url(){
		if(this.length === 0) return '/'
		return this.levels.reduce((str, item) => str += '/'+item, '')
	}

}

export default RouterStore