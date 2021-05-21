import { observer } from "mobx-react-lite"
import { createContext, useContext, useEffect } from 'react'
import ModalWindowStore from "./store"
import cn from 'classnames'

import styles from './styles.module.sass'

const ModalWindowContext = createContext()
const modal = new ModalWindowStore()

export const ModalWindowProvider = observer(
	function ModalWindowProvider({children}){

		const opened = modal.opened
		useEffect(() => {
			if(opened){
				const keyDown = (e) => {
					if(e.code === 'Escape') modal.close()
				}

				document.addEventListener('keydown', keyDown)
				return () => document.removeEventListener('keydown', keyDown)
			}
		}, [opened])

		const modalScrollStyle = { 
			top: -modal.scroll.top+'px', 
			left: -modal.scroll.left+'px', 
			right: modal.scroll.offset+'px' 
		}

		const onBlackClick = (e) => {					
			const target = e.currentTarget;
			if(target === e.target){
				document.addEventListener("mouseup", (e2) => {
					if(target === e2.target) modal.close()
				}, { once: true });
			}		
		}

		return(
			<ModalWindowContext.Provider value={modal}>

				<div 
					className={cn( modal.opened && styles.fixed )} 
					style={modalScrollStyle}
				>
					{children}
				</div>	
				{modal.opened && (
					<div className={styles.black} role="button" onMouseDown={onBlackClick}>
						{ modal.currentWindow }
					</div>
				)}
			</ModalWindowContext.Provider>
		)
	}
)

export function useModal(){
	const modal = useContext(ModalWindowContext)
	return modal
}