import fs from 'fs'
import { BrasilApiCnpjInfo, getCnpjInfo } from './functions/getCnpjInfo'
import * as csv from 'fast-csv'
import { z } from 'zod'
import * as csvToXlsx from '@aternus/csv-to-xlsx'

const zodParsedCnpjsInfo = z.object({
  cnpj: z.string(),
  identificador_matriz_filial: z.number(),
  descricao_matriz_filial: z.string().optional(),
  razao_social: z.string(),
  nome_fantasia: z.string(),
  situacao_cadastral: z.number(),
  descricao_situacao_cadastral: z.string().optional(),
  data_situacao_cadastral: z.string().nullable(),
  motivo_situacao_cadastral: z.number(),
  nome_cidade_exterior: z.string().nullable().optional(),
  codigo_natureza_juridica: z.number(),
  data_inicio_atividade: z.string(),
  cnae_fiscal: z.number(),
  cnae_fiscal_descricao: z.string(),
  descricao_tipo_logradouro: z.string().optional(),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  cep: z.string(),
  uf: z.string(),
  codigo_municipio: z.number(),
  municipio: z.string(),
  ddd_telefone_1: z.string(),
  ddd_telefone_2: z.string().nullable(),
  ddd_fax: z.string().nullable(),
  qualificacao_do_responsavel: z.number(),
  capital_social: z.number(),
  porte: z.string(),
  descricao_porte: z.string(),
  opcao_pelo_simples: z.boolean().nullable(),
  data_opcao_pelo_simples: z.string().nullable(),
  data_exclusao_do_simples: z.string().nullable(),
  opcao_pelo_mei: z.boolean().nullable(),
  situacao_especial: z.string().nullable(),
  data_situacao_especial: z.string().nullable()
})
export type ParsedCnpjsInfo = z.infer<typeof zodParsedCnpjsInfo>

export async function runCnpj (): Promise<{
  success: true
} | {
  success: false
  err: string
}> {
  console.log('Iniciando leitura dos CNPJ\'s')
  const cnpjs = fs.readFileSync('Exports/cnpjs.txt', 'utf8').split('\n')
  const parsedCnpjs: string[] = []
  for (const cnpj of cnpjs) {
    const cnpjParsed = cnpj.replace(/\D/g, '')
    if (cnpjParsed.length <= 0) {
      continue
    }
    parsedCnpjs.push(cnpjParsed)
  }
  console.log('CNPJ\'s lidos')
  console.log(parsedCnpjs)
  console.log('Iniciando busca dos CNPJ\'s')
  const cnpjsInfo: BrasilApiCnpjInfo[] = []
  for (const cnpj of parsedCnpjs) {
    const cnpjInfo = await getCnpjInfo({ cnpj })
    if (!cnpjInfo.success) {
      return {
        success: false,
        err: cnpjInfo.err
      }
    }
    cnpjsInfo.push(cnpjInfo.cnpjInfo)
  }
  console.log('CNPJ\'s buscados')
  console.log('Iniciando escrita dos CNPJ\'s')
  const parsedCnpjsInfo: ParsedCnpjsInfo[] = []
  for (const cnpjInfo of cnpjsInfo) {
    parsedCnpjsInfo.push({
      cnpj: cnpjInfo.cnpj,
      identificador_matriz_filial: cnpjInfo.identificador_matriz_filial,
      descricao_matriz_filial: cnpjInfo.descricao_matriz_filial,
      razao_social: cnpjInfo.razao_social,
      nome_fantasia: cnpjInfo.nome_fantasia,
      situacao_cadastral: cnpjInfo.situacao_cadastral,
      descricao_situacao_cadastral: cnpjInfo.descricao_situacao_cadastral,
      data_situacao_cadastral: cnpjInfo.data_situacao_cadastral,
      motivo_situacao_cadastral: cnpjInfo.motivo_situacao_cadastral,
      nome_cidade_exterior: cnpjInfo.nome_cidade_exterior,
      codigo_natureza_juridica: cnpjInfo.codigo_natureza_juridica,
      data_inicio_atividade: cnpjInfo.data_inicio_atividade,
      cnae_fiscal: cnpjInfo.cnae_fiscal,
      cnae_fiscal_descricao: cnpjInfo.cnae_fiscal_descricao,
      descricao_tipo_logradouro: cnpjInfo.descricao_tipo_logradouro,
      logradouro: cnpjInfo.logradouro,
      numero: cnpjInfo.numero,
      complemento: cnpjInfo.complemento,
      bairro: cnpjInfo.bairro,
      cep: cnpjInfo.cep,
      uf: cnpjInfo.uf,
      codigo_municipio: cnpjInfo.codigo_municipio,
      municipio: cnpjInfo.municipio,
      ddd_telefone_1: cnpjInfo.ddd_telefone_1,
      ddd_telefone_2: cnpjInfo.ddd_telefone_2,
      ddd_fax: cnpjInfo.ddd_fax,
      qualificacao_do_responsavel: cnpjInfo.qualificacao_do_responsavel,
      capital_social: cnpjInfo.capital_social,
      porte: cnpjInfo.porte,
      descricao_porte: cnpjInfo.descricao_porte,
      opcao_pelo_simples: cnpjInfo.opcao_pelo_simples,
      data_opcao_pelo_simples: cnpjInfo.data_opcao_pelo_simples,
      data_exclusao_do_simples: cnpjInfo.data_exclusao_do_simples,
      opcao_pelo_mei: cnpjInfo.opcao_pelo_mei,
      situacao_especial: cnpjInfo.situacao_especial,
      data_situacao_especial: cnpjInfo.data_situacao_especial
    })
  }
  await new Promise((resolve, reject) => {
    csv.writeToPath('Exports/cnpjs.csv', parsedCnpjsInfo,
      {
        headers: true
      })
      .on('error', reject)
      .on('finish', resolve)
  })
  console.log('CNPJ\'s escritos')
  console.log('Convertendo para Excel')
  csvToXlsx.convertCsvToXlsx('Exports/cnpjs.csv', 'Exports/cnpjs.xlsx', {
    sheetName: 'CNPJs',
    overwrite: true
  })
  console.log('Convertido para Excel')
  console.log('Apagando CSV temporário')
  fs.unlinkSync('Exports/cnpjs.csv')
  console.log('CSV temporário apagado')
  console.log('Finalizando JotapeTools-CNPJ')
  return {
    success: true
  }
}
