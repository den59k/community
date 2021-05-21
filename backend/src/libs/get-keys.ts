import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const certPath = path.join(process.cwd(), '/certs')
const publicKeyPath = certPath + '/public.pem'
const privateKeyPath = certPath + '/private.pem'
if(!fs.existsSync(certPath)) fs.mkdirSync(certPath)


export default function getKeys (){

	if(!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)){
		const keys = crypto.generateKeyPairSync('ec', { namedCurve: "prime256v1"	})

		const publicKey = keys.publicKey.export({ type: 'spki', format: 'pem' }) as Buffer
		const privateKey = keys.privateKey.export({ type: 'sec1', format: 'pem' }) as Buffer

		fs.writeFileSync(publicKeyPath, publicKey)
		fs.writeFileSync(privateKeyPath, privateKey)

		console.log('ECDSA Keys generated')

		return { publicKey, privateKey }
	}else{
		const publicKey = fs.readFileSync(publicKeyPath)
		const privateKey = fs.readFileSync(privateKeyPath)

		return { publicKey, privateKey }
	}
}