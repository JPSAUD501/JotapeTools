import { runCnpj } from '../CNPJ/base'

export async function appCnpj (): Promise<void> {
  console.log('Bem vindo! Starting JotapeTools-CNPJ...')
  const runResponse = await runCnpj()
  if (!runResponse.success) {
    console.error(`Error running JotapeTools-CNPJ: ${runResponse.err}`)
    return
  }
  console.log('JotapeTools-CNPJ finalizado!')
}

void appCnpj()
